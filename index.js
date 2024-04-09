const http=require('http');
const express= require('express');
const cors=require('cors');
const socketIO=require('socket.io');

const app=express();
const port=4500 || process.env.PORT; //process.env.PORT means ... 4500 mila acha nahi to auto koi port utha lega

const users=[{}];
app.use(cors());
 app.get("/",(req,res)=>{
    res.send("HELL ITS WORKING");
 })

// create a server
const server=http.createServer(app);
// io is connection 
const io= socketIO(server);

io.on("connection",(socket)=>{
    console.log("New connection");

    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log("joined");
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin", message:`Welcome to the chat, ${users[socket.id]} `});
    })

    socket.on('message',({message,id})=>{
       io.emit('sendMessage',{user:users[id],message,id})
    })
  socket.on('disconnect',()=>{
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
    console.log(`user left`)
  })
    
    
});

server.listen(port,()=>{
    console.log(`server is working on http://localhost:${port}`);
})