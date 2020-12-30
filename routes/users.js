var express = require('express');
var router = express.Router();
const studentHelper = require('../helpers/studentHelper'); 
const fs = require('fs')
const mongodb=require('mongodb')
const binary = mongodb.Binary
const paypal = require('paypal-rest-sdk');
const { getVideoDurationInSeconds } = require('get-video-duration');
let reloadPage=false;

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AZxmIss0kurFWl7jACnwAocWcWAJ5ruCJK-9VEjGmDgBhTyvknVYnMajGycuJwPdbDRKmzNUDitwAwDK',
  'client_secret': 'EOv-WdYNe88YyoXKTKjqgpXM4HsbtcooXimj1BNDQdCGuYpzr4XChUiLUyBgUpngK9EdgnncbCk96trD'
});

const markAttendance=(time,note,stdId)=>{
 
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
router.get('/loginstd-otp',async(req,res)=>{
  let events = await studentHelper.getEvents()
 let announcements = await studentHelper.getAnnouncements()
studentHelper.getStudent(req.query.num).then(student=>{
  let date = new Date().toLocaleDateString()
  let todayStatus = false
  let Messages = student.Messages
  student.Attendance.map(att=>{
    if(att.Date == date){
      if(att.status){
        todayStatus = true
      }
    }
  })
  req.session.student=student
  req.session.studentLogin=true
  
  res.render('students/std-Home',{Messages,events,todayStatus,student,studentLogin:req.session.studentLogin,login:true,announcements})
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


router.get('/logintrue',verifyLogin,async(req,res)=>{
  let events =await studentHelper.getEvents()
  let announcements = await studentHelper.getAnnouncements()
  let student = await studentHelper.getStudentDetails(req.session.student._id)
  let Messages = student.Messages
  let date = new Date().toLocaleDateString()
  let todayStatus = false
  student.Attendance.map(att=>{
    if(att.Date == date){
     if(att.status){
      todayStatus = true
     }
    }
  })
  if(req.session.studentLogin){
    res.render('students/std-Home',{Messages,events,student:req.session.student,studentLogin:req.session.studentLogin,login:true,announcements,todayStatus})
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



router.get('/view-announcement',verifyLogin,async(req,res)=>{
  let announcement = await studentHelper.getAnnouncement(req.query.id)
  res.render('students/std-viewannouncement',{login:true,student:req.session.student,announcement})
})


router.get('/events',verifyLogin,async(req,res)=>{
let events= await studentHelper.getEvents()
let student= await studentHelper.getStudentDetails(req.session.student._id)
let paidEvents=student.Paidevents

res.render('students/std-events',{paidEvents,login:true,student:req.session.student,events,})

})



router.get('/viewevntImg',verifyLogin,async(req,res)=>{
  let event = await studentHelper.getEvent(req.query.id)
  let path=(`./public/datas/events/images/${req.query.id}.${event.ImgType}`)
  var file = fs.createReadStream(path);
  var stat = fs.statSync(path);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'image/png');
  //res.setHeader('Content-Disposition', 'attachment; file.pdf');
  file.pipe(res);

})


router.get('/viewevntVideo',verifyLogin,(req,res)=>{
  var path=`./public/datas/events/videos/${req.query.id}.mp4`
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


router.get('/viewevntPdf',verifyLogin,(req,res)=>{
  let path=(`./public/datas/events/pdfs/${req.query.id}.pdf`)
  var file = fs.createReadStream(path);
  var stat = fs.statSync(path);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  //res.setHeader('Content-Disposition', 'attachment; file.pdf');
  file.pipe(res);
})


//events payments Razorpay--

var payedEventId=''
router.post('/payEventRazor',verifyLogin,async(req,res)=>{
  payedEventId=req.body.EventId
  console.log(req.body)
  studentHelper.generateRazorepay(req.body).then(data=>{
    
    res.status(200).json(data)
  }).catch(err=>{
    console.log(err,"--") 
    payedEventId=''
     res.status(200).json({paymentErr:true})})
})

router.post('/verify-payment-Razor',verifyLogin,(req,res)=>{
  studentHelper.verifyPayment_Razor(req.body).then(async response=>{
    await studentHelper.addPayedstatus(req.session.student,payedEventId).then(r=>{
      payedEventId=''
      res.status(200).json({payment:true})

    })
  }).catch(err=> res.status(500).json({payment:false}))
})


// paypal Payment gateway --
let paytmstd= ''
let payamount=''
router.get('/payEventPal',verifyLogin,async(req,res)=>{
  paytmstd = req.session.student
  payedEventId = req.query.id 
  let total= parseFloat(req.query.total)
  payamount= total
  const create_payment_json = {
    "intent": "authorize",
"payer": {
"payment_method": "paypal"
},
"redirect_urls": {
"return_url": "http://localhost:3000/paypalsuccess",
"cancel_url": "http://localhost:3000/paypalErr'"
},
"transactions": [{
"amount": {
"total": total,
"currency": "INR"
},
"description": " a book on mern stack "
}]
}
  

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {

      console.log("error on paypal",error)
  } else {
    payment.links.map(link=>{
      
      if(link.rel==='approval_url'){
       
        res.redirect(`${link.href}`);
      }
    })
  }
});

});




router.get('/paypalsuccess',(req,res)=>{
  
  studentHelper.addPayedstatus(paytmstd,payedEventId).then(r=>{
  paytmstd= ''
  payedEventId= ''
  let rep = {
    Trn_id:req.query.paymentId,
    Method:"PAYPAL",
    Date:new Date().toLocaleDateString(),
    Amount:payamount
  }
  payamount=''
  res.render('students/paymentSuccess',{rep}) 
})
  })



router.get('/paypalErr',(req,res)=>{
  paytmstd= ''
  payedEventId= ''
  res.send('<center>Payment Error Try again..</center></br> <a href="/events">Go Back To Events</a>')
})

//payment Gateway of paytm --
var check_sum = require('../config/paytm/checksum')

router.get('/payEventPaytm',verifyLogin,(req,res)=>{
  paytmstd = req.session.student
  payedEventId= req.query.id

  var params = {};
  params['MID'] = "bqHsko02713256491688";
  params['WEBSITE'] = "WEBSTAGING";
  params['CHANNEL_ID'] = "WEB";
  params['INDUSTRY_TYPE_ID'] = "Retail";
  params['ORDER_ID'] = 'TEST_' + new Date().getTime();
  params['CUST_ID'] = req.session.student._id;
  params['TXN_AMOUNT'] = req.query.total.toString();
  params['CALLBACK_URL'] = "http://localhost:3000/paytmresponse";
  params['EMAIL'] = req.session.student.Email;
  params['MOBILE_NO'] = req.session.student.Mobile;

  
let key = "giy3zEXhio&jFRj%"

  check_sum.genchecksum(params,key, function (err, checksum) {
    var txn_url = "https://securegw-stage.paytm.in/order/process"; // for staging
    // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
    if(err) console.log("error"+err)

    var form_fields = "";
    for (var x in params) {
      
      form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
    }
    form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script>');
    res.end();
  })
})


//paytm payment response

router.post('/paytmresponse',async (req, res) => {
  let data= req.body
  if(data.STATUS == 'TXN_SUCCESS'){
     await studentHelper.addPayedstatus(paytmstd,payedEventId).then(r=>{
      paytmstd= ''
      payedEventId= ''
      let rep = {
        Trn_id:data.ORDERID,
        Method:"PAYTM",
        Date:new Date().toLocaleDateString(),
        Amount:data.TXNAMOUNT
      }
      res.render('students/paymentSuccess',{rep}) 
    })

  }else{
    console.log(data)
    payedEventId= ''
    res.send('<center><h2>Payment Failled</h2></br> '+data.RESPMSG+'</br><a href="/events">Go Back..</a></center>')
  }
  
})

//-------

router.get('/view-event',verifyLogin,async(req,res)=>{
  let event =  await studentHelper.getEvent(req.query.id)
  res.render('students/std-viewEvents',{event,login:true,student:req.session.student})
})


//fee payment with PAYPAL

router.get('/payfee-Paypal',verifyLogin,(req,res)=>{
paytmstd= req.session.student
  let amount= parseFloat(req.query.amount)
  
  const create_payment_json = {
    "intent": "authorize",
"payer": {
"payment_method": "paypal"
},
"redirect_urls": {
"return_url": "http://localhost:3000/paypalFeesuccess",
"cancel_url": "http://localhost:3000/paypalFeeerr"
},
"transactions": [{
"amount": {
"total": amount,
"currency": "INR"
},
"description": " a book on mern stack "
}]
}
  

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {

      console.log("error on paypal",error)
  } else {
    payment.links.map(link=>{
      
      if(link.rel==='approval_url'){
       
        res.redirect(`${link.href}`);
      }
    })
  }
});
})

router.get('/paypalFeesuccess',(req,res)=>{
  studentHelper.addFeeStatus(paytmstd).then(r=>{
   
    let rep = {
      Trn_id:req.query.paymentId,
      Method:"PAYPAL",
      Date:new Date().toLocaleDateString(),
      Amount:"25,000"
    }
    res.render('students/paymentSuccess',{rep}) 
  })
})
//fee payment with PAYTM

router.get('/payfee-Paytm',verifyLogin,(req,res)=>{
  paytmstd = req.session.student
 

  var params = {};
  params['MID'] = "bqHsko02713256491688";
  params['WEBSITE'] = "WEBSTAGING";
  params['CHANNEL_ID'] = "WEB";
  params['INDUSTRY_TYPE_ID'] = "Retail";
  params['ORDER_ID'] = 'TEST_' + new Date().getTime();
  params['CUST_ID'] = req.session.student._id;
  params['TXN_AMOUNT'] = req.query.amount.toString();
  params['CALLBACK_URL'] = "http://localhost:3000/paytmFEEresponse";
  params['EMAIL'] = req.session.student.Email;
  params['MOBILE_NO'] = req.session.student.Mobile;

  
let key = "giy3zEXhio&jFRj%"

  check_sum.genchecksum(params,key, function (err, checksum) {
    var txn_url = "https://securegw-stage.paytm.in/order/process"; // for staging
    // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
    if(err) console.log("error"+err)

    var form_fields = "";
    for (var x in params) {
      
      form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
    }
    form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script>');
    res.end();
  })
})


//paytm payment response

router.post('/paytmFEEresponse',async (req, res) => {
   let data= req.body
  if(data.STATUS == 'TXN_SUCCESS'){
     await studentHelper.addFeeStatus(paytmstd).then(r=>{
      payedEventId=''
      
      let rep = {
        Trn_id:data.ORDERID,
        Method:"PAYTM",
        Date:new Date().toLocaleDateString(),
        Amount:data.TXNAMOUNT
      }
      res.render('students/paymentSuccess',{rep}) 

    })

  }else{
    console.log(data)
    payedEventId= ''
    res.send('<center><h2>Payment Failled</h2></br> '+data.RESPMSG+'</br><a href="/login">Go Back..</a></center>')
  }
  
})

// fee Payment with RAZORPAY

router.post('/payfee-Razor',verifyLogin,(req,res)=>{
  let data ={
    Price:req.body.amount,
    EventId:req.session.student._id
  }  

  studentHelper.generateRazorepay(data).then(data=>{
    
    res.status(200).json(data)
  }).catch(err=>{
      console.log(err,"--") 
     res.status(200).json({paymentErr:true})})

})

router.post('/verify-Feepayment-Razor',verifyLogin,(req,res)=>{
  studentHelper.verifyPayment_Razor(req.body).then(async response=>{
    await studentHelper.addFeeStatus(req.session.student).then(r=>{
      
      res.status(200).json({payment:true})

    })
  }).catch(err=> res.status(500).json({payment:false}))

})
const Socket = require('../config/socketio')
router.post('/sendMessage',verifyLogin,(req,res)=>{
console.log(req.body)
let msg ={
  Message:req.body.message,
  Time:new Date().toLocaleTimeString(),
  Date:new Date().toLocaleDateString(),
  Tutor:false
}
   studentHelper.sendMessage(msg,req.session.student._id).then(data=>{
     Socket.StdSendMsg(msg,req.session.student._id)
     res.json({status:true})
   }).catch(e=> res.json({status:false})) 
})
 


module.exports = router;
