var express = require('express');
var router = express.Router();
var adminHelper =require('../helpers/adminHelper')
const mongodb=require('mongodb')
const binary = mongodb.Binary
const fs= require('fs')
const path =require('path')
const verifyLogin=(req,res,next)=>{
if(req.session.adminLogin)next()
else res.redirect('/admin')
}

router.get('/', function(req, res, next) {
    if(req.session.adminLogin) res.render('tutor/tutorpage',{adminLogin:req.session.adminLogin,login:true})
    else res.render('tutor/tutorlogin',{loginErr:req.session.adminLoginErr}) ,req.session.adminLoginErr=false
});
router.post('/login',(req,res)=>{
    console.log(req.body);
    adminHelper.doLogin(req.body).then((response)=>{
        if(response.login){
            req.session.adminLogin=true
            req.session.admin=response.user
            
            res.render('tutor/tutorpage',{adminLogin:req.session.adminLogin,login:true})

        }else{
            req.session.adminLoginErr='Invalid Login'
            res.redirect('/admin')
        }
    }).catch(()=>{
        req.session.adminLoginErr='Invalid Login '
        res.redirect('/admin')

    })

})
router.get('/logout',(req,res)=>{
    req.session.admin=null;
    req.session.adminLogin=false
    res.redirect('/admin')
})
router.get('/profile',verifyLogin,async(req,res)=>{
    let profile=await adminHelper.getProfile(req.session.admin)
    console.log("++",profile)
res.render('tutor/tutorprofile',{adminLogin:req.session.adminLogin,profile,login:true})
})
router.get('/editprofile',verifyLogin,async(req,res)=>{
    let profile= await adminHelper.getProfile(req.session.admin)
    res.render('tutor/tutoreditprofile',{adminLogin:req.session.adminLogin,profile ,login:true})
})
router.post('/editprofile',(req,res)=>{
   console.log(req.body)
    adminHelper.editProfile(req.body,req.session.admin).then(()=>{
       res.json({status:true})
 })

})

router.get('/students',verifyLogin,async(req,res)=>{
    let students=await adminHelper.getStudents()
   await students.sort((a,b)=>{
        return a['Roll-No']-b['Roll-No']
    })
    
    res.render('tutor/students',{adminLogin:req.session.adminLogin,students,login:true})
})


router.get('/addstudent',verifyLogin,(req,res)=>{
    res.render('tutor/addstudent',{adminLogin:req.session.adminLogin,login:true})
})
router.post('/addstudent',verifyLogin,(req,res)=>{
   
    adminHelper.addStudent(req.body).then(()=>{
        res.json({status:true})
    })
})

router.get('/editstudent',verifyLogin,async(req,res)=>{
    
    const student=await adminHelper.getStudent(req.query.id)
 res.render('tutor/editstudent',{student,adminLogin:req.session.adminLogin,login:true})
})
router.post('/editStudent',verifyLogin,(req,res)=>{
    
    adminHelper.editStudent(req.body,req.query.id).then((response)=>{
        res.json({status:true})
    })
})
router.get('/assignments',verifyLogin,async(req,res)=>{
    let assignments= await adminHelper.getAssignments();
    console.log("++",assignments);
    res.render('tutor/assignments',{adminLogin:req.session.adminLogin,assignments,login:true})
})
router.post('/assignment',(req,res)=>{


    let file ={ Name:req.body.Name,Date:new Date().toLocaleDateString(),Time:new Date().toLocaleTimeString(),fileName:req.files.File.name }
    adminHelper.addAssignment(file).then((data)=>{
        console.log(data._id)
   
        let pdf=req.files.File
        pdf.mv(`./public/datas/assignments/${data._id}.pdf`)
         res.redirect('/admin/assignments')
    })
})
 

router.get('/deletestudent',verifyLogin,(req,res)=>{
    adminHelper.deleteStudent(req.query.id).then(()=>{
        res.json({status:true})
    })
})
router.get('/deleteassignment',verifyLogin,(req,res)=>{
    adminHelper.deleteAssignment(req.query.id).then(()=>{
        res.json({status:true})
    })
})
router.get('/view-assignment',verifyLogin,async(req,res)=>{
   // let file=await adminHelper.getAssignment(req.query.id)
   // const buffer=file.file.buffer;
   let path=(`./public/datas/assignments/${req.query.id}.pdf`)
   

   var file = fs.createReadStream(path);
var stat = fs.statSync(path);
res.setHeader('Content-Length', stat.size);
res.setHeader('Content-Type', 'application/pdf');
//res.setHeader('Content-Disposition', 'attachment; file.pdf');
file.pipe(res);

})
router.get('/notes',verifyLogin,async(req,res)=>{
    let notes= await adminHelper.getNotes()
    res.render('tutor/notes',{adminLogin:req.session.adminLogin,notes,login:true})
})
router.post('/notes',verifyLogin,(req,res)=>{ 
    let file=''
   if(req.files.File) file ={ Name:req.body.Name, Date:new Date().toLocaleDateString(),Time:new Date().toLocaleTimeString(),fileName:req.files.File.name}
    else file ={ Name:req.body.Name, Date:new Date().toLocaleDateString(),Time:new Date().toLocaleTimeString(),noPdf:true}
   if(req.files.Video) file.video=true
    adminHelper.addNote(file).then((Id)=>{
        if(req.files.Video){
        let video =req.files.Video
      video.mv(`./public/datas/notes/${Id}.mp4`)
      //   res.redirect('/admin/notes') 
        }
        if(req.files.File){
            let pdf = req.files.File
            pdf.mv(`./public/datas/notePdfs/${Id}.pdf`)
        }
        res.redirect('/admin/notes')
    }) 
})
router.get('/deleteNote',verifyLogin,(req,res)=>{

    adminHelper.deleteNote(req.query.id).then((status)=>{
        console.log(status,"=======")
        if(status.video) fs.unlinkSync(`./public/datas/notes/${req.query.id}.mp4`)
        if(status.pdf) fs.unlinkSync(`./public/datas/notePdfs/${req.query.id}.pdf`)
        res.json({status:true})
    })
})


router.get('/view-Notes',verifyLogin,async(req,res)=>{

    let path=(`./public/datas/notePdfs/${req.query.id}.pdf`)
    var file = fs.createReadStream(path);
    var stat = fs.statSync(path);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; file.pdf');
    file.pipe(res); 

})
router.get('/view-Video',verifyLogin,async(req,res)=>{
    let note= await adminHelper.getNote(req.query.id)
    if(!note.VideoLink){
      var path=`./public/datas/notes/${req.query.id}.mp4`
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
    }else{
       
        res.redirect(`${note.VideoLink}`)  
    
    }
})

router.post('/linkNotes',verifyLogin,(req,res)=>{
   
    let file =' ';
   
   if(req.files) {file ={ Name:req.body.Name, Date:new Date().toLocaleDateString(),Time:new Date().toLocaleTimeString(),fileName:req.files.File.name}}
   else file ={ Name:req.body.Name, Date:new Date().toLocaleDateString(),Time:new Date().toLocaleTimeString(),noPdf:true}
    if(req.body.Video_Link) file.VideoLink=req.body.Video_Link ,file.video=true
   adminHelper.addNote(file).then(response=>{
    if(req.files){
        let pdf=req.files.File
        pdf.mv(`./public/datas/notePdfs/${response}.pdf`)
    }   
    res.redirect('/admin/notes')
   })

})
router.get('/attendance',verifyLogin,async(req,res)=>{
    let date=new Date().toLocaleDateString()
    let students=await adminHelper.getStudents()
    await students.sort((a,b)=>{
         return a['Roll-No']-b['Roll-No']
     })
    res.render('tutor/attendance',{adminLogin:req.session.adminLogin,login:true,students,date})
})
router.get('/attendanceD',verifyLogin,async(req,res)=>{
    let day=req.query.date
    let date=day.split("-").reverse().join("/")



    let students=await adminHelper.getStudents()
    await students.sort((a,b)=>{
         return a['Roll-No']-b['Roll-No'] 
    })
    res.render('tutor/attendance',{adminLogin:req.session.adminLogin,login:true,students,date})
})
router.get('/viewStudent',verifyLogin,async(req,res)=>{
    let viewStudent= await adminHelper.getStudent(req.query.id)
    
    console.log(viewStudent);
    res.render('tutor/studentDetails',{login:true,adminLogin:req.session.adminLogin,viewStudent})
})
router.get('/viewstudentAssignment',verifyLogin,async(req,res)=>{
   console.log(req.query.id,req.query.std)

   let path=(`./public/datas/assignments/submited/${req.query.id+req.query.std}.pdf`)
    var file = fs.createReadStream(path);
    var stat = fs.statSync(path);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    //res.setHeader('Content-Disposition', 'attachment; file.pdf');
    file.pipe(res); 

})


router.post('/Ass-Mark',verifyLogin,(req,res)=>{
adminHelper.setMark(req.body).then(response=>{
    res.json({status:true})
})
})
module.exports = router;