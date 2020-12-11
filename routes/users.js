var express = require('express');
var router = express.Router();
const studentHelper = require('../helpers/studentHelper'); 
const fs = require('fs')
const { getVideoDurationInSeconds } = require('get-video-duration')
let reloadPage=false;

const markAttendance=(time,note,stdId)=>{
  console.log(time,"TiME",reloadPage,"studentId=",stdId);
  setTimeout((async()=>{
 
    if(reloadPage) await studentHelper.markAttendance(note,stdId,false) 
    else await studentHelper.markAttendance(note,stdId,true)
 }),parseInt(time)*1000/1.5)
}
const verifyLogin=(req,res,next)=>{
if(req.session.studentLogin) next()
else res.redirect('/login')
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login',(req,res)=>{
  if(req.session.studentLogin) res.redirect('/logintrue')
  else res.render('students/login')
})
router.post('/checkNumber',(req,res)=>{
  console.log(req.body);
  studentHelper.checkMobile_NO(req.body).then((response)=>{
    res.json(response)
  }).catch(response=>{
    res.json(response)
  })

})
router.post('/verifyOtp',(req,res)=>{
  studentHelper.checkOtp(req.body,req.query.No).then(response=>{
    res.json(response)
  }).catch(response=>{
    res.json(response)
  })
})
router.post('/newPassword',(req,res)=>{
  console.log(req.body)
  studentHelper.newPassword(req.body).then((response)=>{
    res.json({status:true})
  }).catch(err=>{
    res.json({status:false})
  })
})
router.get('/loginstd-otp',(req,res)=>{
studentHelper.getStudent(req.query.num).then(student=>{
  req.session.student=student
  req.session.studentLogin=true
  res.render('students/std-Home',{student,studentLogin:req.session.studentLogin,login:true})
})
  
})
router.post('/login',(req,res)=>{
studentHelper.doLogin(req.body).then(response=>{
  req.session.student=response
  req.session.studentLogin=true
  res.json({status:true})
}).catch(err=>{
  res.json({status:false})
}) 
})
router.get('/logintrue',verifyLogin,(req,res)=>{
  if(req.session.studentLogin){
    res.render('students/std-Home',{student:req.session.student,studentLogin:req.session.studentLogin,login:true})
  }else{
    res.redirect('/login')
  }
})
router.get('/logout',(req,res)=>{
  req.session.studentLogin=false
  req.session.student=''
  res.redirect('/login')
}) 
router.get('/notes',verifyLogin,(req,res)=>{
  studentHelper.getNotes().then(notes=>{
    res.render('students/std-Notes',{ student:req.session.student,studentLogin:req.session.studentLogin,login:true,notes})
  })
  })
  router.get('/viewNote',async(req,res)=>{
    let note= await studentHelper.getNote(req.query.id)
    const buffer=note.file.buffer;
   res.type('application/pdf');
   res.end(buffer);
  })
  router.get('/downloadNote',async(req,res)=>{
    let note= await studentHelper.getNote(req.query.id)
    console.log("note",note)
    const buffer=note.file.buffer
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=file.pdf');
  res.end(buffer)
  
    
    })
    router.get('/viewVideo',verifyLogin,async(req,res)=>{
      let note=await studentHelper.getNote(req.query.id)
      if(note.Video){
        var path=`./public/notes/${req.query.id}.mp4`
          var stat = fs.statSync(path);
          var total = stat.size;
          let Duration=''
          getVideoDurationInSeconds(path).then((duration) => {
            
            Duration=duration;
            reloadPage=false
            markAttendance(Duration,note,req.session.student._id)
          }).catch(err=>{
            console.log(err)
          })
         
          if (req.headers.range) { 
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];
         
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total-1;
            var chunksize = (end-start)+1;
            console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
        
            var file = fs.createReadStream(path, {start: start, end: end});
            res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
           
            file.pipe(res);
            
          } else {
          
            console.log('ALL: ' + total);
            res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
            //markAttendance(Duration)
            fs.createReadStream(path).pipe(res);
          }
      }
     
      else{ 
        studentHelper.markAttendance(note,req.session.student._id,true)
        res.redirect(`${note.VideoLink}`)  
    }
      
    })
     router.get('/markattndc',(req,res)=>{
       reloadPage=true;
       
     })
     router.post('/searchNotes',verifyLogin,(req,res)=>{
       studentHelper.search(req.body).then(data=>{
         res.json(data)
       })
     })
     router.get('/todayTask',verifyLogin,(req,res)=>{
      res.render('students/std-todayTask',{studentLogin:req.session.studentLogin,login:true ,student:req.session.student})
     })
module.exports = router;
