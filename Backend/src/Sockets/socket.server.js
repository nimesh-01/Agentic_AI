const { Server } = require("socket.io")
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const messageModel = require("../models/message.model")
const { generateRes, generateVector } = require("../services/ai.service")
const { createMemory, queryMemory } = require("../services/vector.service")

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin:  ["https://agentic-ai-01.onrender.com","http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    // Middleware for authentication
    io.use(async (socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "")
            if (!cookies.token) {
                return next(new Error("Authentication error: No token provided"))
            }

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)
            if (!user) return next(new Error("Authentication error: User not found"))

            socket.user = user
            next()
        } catch (error) {
            next(new Error("Authentication error: Invalid Token"))
        }
    })

    io.on("connection", (socket) => {
        socket.on("ai-msg", async (payload) => {
            try {
                const [msg, vectors] = await Promise.all([
                    messageModel.create({
                        user: socket.user._id,
                        chat: payload.chat_id,
                        content: payload.content,
                        role: "user",
                    }),
                    generateVector(payload.content),
                ])
                console.log("step1");
                
                await createMemory({
                    vectors,
                    messageId: msg._id,
                    metadata: {
                        chat: payload.chat_id,
                        user: socket.user._id,
                        text: payload.content,
                    },
                })
                console.log("step2");

                const [memories, chatHistory] = await Promise.all([
                    queryMemory({
                        queryVector: vectors,
                        limit: 3,
                        filter: { user: { $eq: socket.user._id } },
                        includeMetadata: true,
                    }),
                    messageModel
                        .find({ chat: payload.chat_id })
                        .sort({ createdAt: -1 })
                        .limit(5)
                        .lean(),
                ])
                console.log("step3");

                const stm = chatHistory.reverse().map((item) => ({
                    role: item.role,
                    parts: [{ text: item.content }],
                }))
                console.log("step4");

                const ltm = [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `These are some previous messages from the chat, use them to generate a response:\n${memories
                                    .map((m) => m.metadata.text)
                                    .join("\n")}`,
                            },
                        ],
                    },
                ]
                console.log("step5");

                const res = await generateRes([...ltm, ...stm])
                console.log("step6");

                socket.emit("ai-res", { msg: res })
                console.log("step7");

                const [resmsg, resVector] = await Promise.all([
                    messageModel.create({
                        user: socket.user._id,
                        chat: payload.chat_id,
                        content: res,
                        role: "model",
                    }),
                    generateVector(res),
                ])
                console.log("step8");

                await createMemory({
                    vectors: resVector,
                    messageId: resmsg._id,
                    metadata: {
                        chat: payload.chat_id,
                        user: socket.user._id,
                        text: res,
                    },
                })
                console.log("step9");

            } catch (error) {
                console.error("AI message handling error:", error)
                socket.emit("ai-res", { msg: "⚠️ Something went wrong. Please try again." })
            }
        })
    })
}

module.exports = initSocketServer
