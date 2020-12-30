 let Socket;
 
 module.exports ={
    scktioC:(io)=>{
        
        io.on('connection', (socket) => {
            Socket= socket
            console.log('a user connected');
          
        }); 
    },
    NewAssignmentAdded:(data)=>{
        
        Socket.emit('AssignmentAdded',{message:'helllo'})
    },
    StdSendMsg:(data,Id)=>{
        Socket.emit('stdmsg',{data:data,Id:Id})
    },
    AdmSendMsg:(data)=>{
        Socket.emit('admmsg',data)
    }


}