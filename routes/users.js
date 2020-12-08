var express = require('express');
var router = express.Router();
const studentHelper = require('../helpers/studentHelper'); 
const fs = require('fs')
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
  res.send(buffer)
  res.end("okke")
    
    })
     
module.exports = router;
