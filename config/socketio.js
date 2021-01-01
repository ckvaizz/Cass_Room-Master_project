 
 let IO;
 module.exports ={
    scktioC:(io)=>{
        
        io.on('connection', (socket) => {
            IO=io
           
            console.log('a user connected');
          
        }); 
    },
    NewAssignmentAdded:(data)=>{
       
        IO.emit('AssignmentAdded',{message:'helllo'})
    },
    StdSendMsg:(data,id)=>{
        console.log(id,"Id")
        IO.emit('stdmsg',{data:data,Id:id})
    },
    AdmSendMsg:(data,id)=>{

        IO.emit('admmsg',{data:data,Id:id})
    },
    sharevideoLink:(Link)=>{
        IO.emit('VideoCall',Link)
    }


}