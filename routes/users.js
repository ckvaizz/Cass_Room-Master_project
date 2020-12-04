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
    
  })

})

module.exports = router;
