const app = require("express")();
const server = require("http").createServer(app);

const cors = require("cors");

const io = require("socket.io")(server,{
     cors:{
        origin: "*", 
        // allows access from all origins
        methods: ["GET","POST"]
     }

});

app.use(cors());

const PORT = process.env.PORT || 5002;

app.get("/",(req,res) =>{
    res.send("Server is running");
}); 
// sockets are used for real time data communication
io.on('connection', (socket) =>{
        socket.emit('me',socket.id);
        // gives us own id on the frontend

        socket.on('disconnect',()=>{
            socket.broadcast.emit("call ended");
        })

        socket.on("call user",({userToCall, signalData, from, name}) =>{
            io.to(userToCall).emit('calluser',{signal:signalData, from, name});
        })

        socket.on("answer call",({data}) =>{
            io.to(data.to).emit("call accepted",data.signal);
        } )
         
})


server.listen(PORT,()=> console.log(`Server listening on ${PORT}`))
 