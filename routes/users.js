var express = require('express');
var router = express.Router();
const studentHelper = require('../helpers/studentHelper'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login',(req,res)=>{
  res.render('students/login')
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


module.exports = router;
