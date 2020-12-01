var express = require('express');
var router = express.Router();
var adminHelper =require('../helpers/adminHelper')
const verifyLogin=(req,res,next)=>{
if(req.session.adminLogin)next()
else res.redirect('/admin')
}

router.get('/', function(req, res, next) {
    if(req.session.adminLogin) res.render('tutor/tutorpage',{adminLogin:req.session.adminLogin})
    else res.render('tutor/tutorlogin',{loginErr:req.session.adminLoginErr}) ,req.session.adminLoginErr=false
});
router.post('/login',(req,res)=>{
    console.log(req.body);
    adminHelper.doLogin(req.body).then((response)=>{
        if(response.login){
            req.session.adminLogin=true
            req.session.admin=response.user
            
            res.render('tutor/tutorpage',{adminLogin:req.session.adminLogin})

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
res.render('tutor/tutorprofile',{adminLogin:req.session.adminLogin,profile})
})
router.get('/editprofile',verifyLogin,async(req,res)=>{
    let profile= await adminHelper.getProfile(req.session.admin)
    res.render('tutor/tutoreditprofile',{adminLogin:req.session.adminLogin,profile})
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
    
    res.render('tutor/students',{adminLogin:req.session.adminLogin,students})
})
router.get('/addstudent',verifyLogin,(req,res)=>{
    res.render('tutor/addstudent',{adminLogin:req.session.adminLogin})
})
router.post('/addstudent',verifyLogin,(req,res)=>{
   
    adminHelper.addStudent(req.body).then(()=>{
        res.json({status:true})
    })
})

router.get('/editstudent',verifyLogin,async(req,res)=>{
    
    const student=await adminHelper.getStudent(req.query.id)
 res.render('tutor/editstudent',{student,adminLogin:req.session.adminLogin})
})
router.post('/editStudent',verifyLogin,(req,res)=>{
    
    adminHelper.editStudent(req.body,req.query.id).then((response)=>{
        res.json({status:true})
    })
})
module.exports = router;