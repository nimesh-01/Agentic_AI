require('dotenv').config();
const app = require('./src/app')
const connectDb=require('./src/DB/db')
const initSocketServer=require('./src/Sockets/socket.server')
const httpServer=require('http').createServer(app)

initSocketServer(httpServer)
connectDb()
httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
})