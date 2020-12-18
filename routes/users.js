var express = require('express');
var router = express.Router();
const studentHelper = require('../helpers/studentHelper'); 
const fs = require('fs')
const mongodb=require('mongodb')
const binary = mongodb.Binary
const { getVideoDurationInSeconds } = require('get-video-duration');
const { log } = require('util');
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
    let path=(`./public/datas/notePdfs/${req.query.id}.pdf`)
    var file = fs.createReadStream(path);
    var stat = fs.statSync(path);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; file.pdf');
    file.pipe(res); 
  })


  router.get('/downloadNote',async(req,res)=>{
    let path=(`./public/datas/notePdfs/${req.query.id}.pdf`)
    var file = fs.createReadStream(path);
    var stat = fs.statSync(path);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; file.pdf');
    file.pipe(res); 
    })


    router.get('/viewVideo',verifyLogin,async(req,res)=>{
      let note=await studentHelper.getNote(req.query.id)
      if(!note.VideoLink){
        var path=`./public/datas/notes/${req.query.id}.mp4`
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
         
          if (req.headers.range){ 
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
          
           
            res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
            //markAttendance(Duration)
            fs.createReadStream(path).pipe(res);
          }
      }
     
      else{ 
        studentHelper.markAttendance(note,req.session.student._id,true)
        res.redirect(`${note.VideoLink}`)  
    } })


     router.get('/markattndc',(req,res)=>{
       reloadPage=true;
       
     })


     router.post('/searchNotes',verifyLogin,(req,res)=>{
       studentHelper.search(req.body).then(data=>{
         res.json(data)
       })
     })


     router.get('/todayTask',verifyLogin,async(req,res)=>{
      let assignments = await studentHelper.getAssignments()
      let notes = await studentHelper.getNotes()
      let date = new Date().toLocaleDateString()
      let note=''
      let assignment=''
      notes.map(nte=>{
        if(nte.Date == date){
          note = nte
        }
      })
      assignments.map(ass=>{
        if(ass.Date == date){
          assignment= ass
        }
      })
      res.render('students/std-todayTask',{studentLogin:req.session.studentLogin,login:true ,student:req.session.student,assignment,note})
     })


     router.get('/view-Assignment',verifyLogin,async(req,res)=>{
        let path=(`./public/datas/assignments/${req.query.id}.pdf`)
    var file = fs.createReadStream(path);
    var stat = fs.statSync(path);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; file.pdf');
    file.pipe(res); 
    })


    router.post('/submitAssignment',verifyLogin,(req,res)=>{
      let file={Topic:req.body.Topicname,TopicId:req.body.assId,Date:new Date().toLocaleDateString(),Time:new Date().toLocaleTimeString()}
      studentHelper.submitAssignment(file,req.session.student._id).then(respose=>{
       let pdf = req.files.File
       pdf.mv(`./public/datas/assignments/submited/${req.body.assId+req.session.student._id}.pdf`)
       res.json("okke")
      })
    })


    router.get('/assignments',verifyLogin,async(req,res)=>{
     let assignments = await studentHelper.getAssignments()
      res.render('students/std-assignments',{assignments,login:true,student:req.session.student,studentLogin:req.session.studentLogin})
     })



router.get('/getAssignment',verifyLogin,async(req,res)=>{
let student = await studentHelper.getStudentDetails(req.session.student._id);
let assnment=' '
await student.Assignments.map(ass=>{if(ass.TopicId == req.query.id){ assnment=ass } })
res.json(assnment)

})



router.get('/viewsubmited',verifyLogin,(req,res)=>{
  let path=(`./public/datas/assignments/submited/${req.query.id+req.session.student._id}.pdf`)
  var file = fs.createReadStream(path);
  var stat = fs.statSync(path);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  //res.setHeader('Content-Disposition', 'attachment; file.pdf');
  file.pipe(res); 
})



router.get('/gallery',verifyLogin,async(req,res)=>{
  let Photos = await studentHelper.getPhotos()
 res.render('students/std-gallery',{login:true,student:req.session.student,Photos})
})


router.get('/attendance',verifyLogin,async(req,res)=>{
  let std =await studentHelper.getStudentDetails(req.session.student._id)
  let stdAttedance = std.Attendance
 res.render('students/std-attendance',{login:true,student:req.session.student,stdAttedance})
})


router.get('/attendanceM',verifyLogin,async(req,res)=>{
  let std =await studentHelper.getStudentDetails(req.session.student._id)
  let Attendance = std.Attendance
  let m = req.query.month
  let month =m.split("-").reverse()
  let stdAttedance = []
  Attendance.map(att=>{
    let date = att.Date.split("/")
    console.log(month)
    console.log(date)
    if(month[0]==date[1] && month[1]==date[2]){
      stdAttedance.push(att)
    }
  })
  console.log(stdAttedance,"===")
  res.render('students/std-attendance',{login:true,student:req.session.student,stdAttedance,Date:req.query.month})
})




router.get('/announcements',verifyLogin,async(req,res)=>{

let announcements= await studentHelper.getAnnouncements()
res.render('students/std-announcements',{login:true,student:req.session.student,announcements})

})


router.get('/viewAnnVideo',verifyLogin,(req,res)=>{

  var path=`./public/datas/announcements/videos/${req.query.id}.mp4`
  var stat = fs.statSync(path);
  var total = stat.size;

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
    fs.createReadStream(path).pipe(res);
  }
})



router.get('/viewAnnPdf',verifyLogin,(req,res)=>{
  let path=(`./public/datas/announcements/pdfs/${req.query.id}.pdf`)
  var file = fs.createReadStream(path);
  var stat = fs.statSync(path);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  //res.setHeader('Content-Disposition', 'attachment; file.pdf');
  file.pipe(res);
})



router.get('/viewAnnImage',verifyLogin,async(req,res)=>{
  let ann = await studentHelper.getAnnouncement(req.query.id)
  let path=(`./public/datas/announcements/images/${req.query.id}.${ann.ImgType}`)
  var file = fs.createReadStream(path);
  var stat = fs.statSync(path);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'image/png');
  //res.setHeader('Content-Disposition', 'attachment; file.pdf');
  file.pipe(res);
})
module.exports = router;
