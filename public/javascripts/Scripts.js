


$(function(){
    $('.edittutorprofile').on('submit', function(event){
        event.preventDefault();
        
        console.log("calling++");
        $('.editconfirm1').addClass('editconfirm').removeClass('editconfirm1');
    });
});


submitprofile=()=>{
    let data=$('#tutorForm')
    console.log(data)
    $.ajax({
        url:'/admin/editprofile',
        method:'post',
        data:$('#tutorForm').serialize(),
        success:(response)=>{
            if(response.status) {
                $('.editsuccess1').addClass('editsuccess').removeClass('editsuccess1');
            }
        }
        
    })
   
 }


 cancel=()=>{
     location.href='/admin/profile';
 }

 $('#addstudentform').submit((e)=>{
     e.preventDefault();
     $.ajax({
         url:'/admin/addstudent',
         method:'Post',
         data:$('#addstudentform').serialize(),
         success:(response)=>{
            location.href='/admin/students'
         }
     })
 })



 $(function(){
    $('#editstudentform').on('submit', function(event){
        event.preventDefault();
        
        console.log("calling++");
        $('.studnteditconfirm1').addClass('studnteditconfirm').removeClass('studnteditconfirm1');
    });
});

SaveStudent=(Id)=>{

$.ajax({
    url:'/admin/editStudent?id='+Id,
    method:'post',
    data:$('#editstudentform').serialize(),
    success:()=>{
        location.href='/admin/students'
    }
})
}
let delteStudentId='';


deleteStudentconfrm=(Id)=>{
    delteStudentId=Id
$('.deltestudentcnfrm1').addClass('deltestudentcnfrm').removeClass('deltestudentcnfrm1');
}

deltStudent=()=>{
$.ajax({
    url:'/admin/deletestudent?id='+delteStudentId,
    method:'get',
    success:()=>{
        
        $('.deltestudentcnfrm').addClass('deltestudentcnfrm1').removeClass('deltestudentcnfrm')
        $('#tr'+delteStudentId).remove()
        delteStudentId='';
        $('.studentremovedalert1').addClass('studentremovedalert').removeClass('studentremovedalert1')
        
    }
    
})
}
removespan=()=>{
    $('.studentremovedalert').addClass('studentremovedalert1').removeClass('studentremovedalert')
}

let deleteAssignmentId='';

deleteAssignmentcnfrm=(Id)=>{
delteAssignmentId=Id
$('.deleteassignmentcnfrm1').addClass('deleteassignmentcnfrm').removeClass('deleteassignmentcnfrm1')

}

deleteAssignment=()=>{
    $.ajax({
        url:'/admin/deleteassignment?id='+delteAssignmentId,
        method:'get',
        success:()=>{
            $('.deleteassignmentcnfrm').addClass('deleteassignmentcnfrm1').removeClass('deleteassignmentcnfrm')
            $('#tr'+delteAssignmentId).remove()
            delteAssignmentId='';
        }
    })
}

   window.onbeforeunload=()=>{
   
    $('.loading1').addClass('loading').removeClass('loading1')
   
}
window.onload=()=>{
  
    $.ajax({
        url:'/markattndc',
        method:'get'
    })
}

let deleteNoteId=''
let video=''
let link=''
deleteNotecnfrm=(id)=>{
    console.log("calling");
    deleteNoteId=id
    
$('.deleteassignmentcnfrm1').addClass('deleteassignmentcnfrm').removeClass('deleteassignmentcnfrm1')
}
deleteNote=()=>{
$.ajax({
    url:`/admin/deleteNote?id=${deleteNoteId}`,
    method:'get',
    success:()=>{
        $('.deleteassignmentcnfrm').addClass('deleteassignmentcnfrm1').removeClass('deleteassignmentcnfrm')
        $('#tr'+deleteNoteId).remove()
        deleteNoteId='';
        
    }
})
}
let option=false;
showoptions=()=>{
if(!option){
    option=true;
    $('.passwordoptions1').addClass('passwordoptions').removeClass('passwordoptions1')
}else{
    option=false
    $('.passwordoptions').addClass('passwordoptions1').removeClass('passwordoptions')
}
}
creatPassWordForm=()=>{
    $('.stdLoginForm').addClass('stdLoginForm1').removeClass('stdLoginForm')
    $('.stdCreatePassword1').addClass('stdCreatePassword').removeClass('stdCreatePassword1')
}

backToLogin=()=>{
    $('.stdLoginForm1').addClass('stdLoginForm').removeClass('stdLoginForm1')
    $('.stdCreatePassword').addClass('stdCreatePassword1').removeClass('stdCreatePassword')

}
let stdMobile=''
$('#MobileCheck').submit(e=>{
    e.preventDefault()
    stdMobile=$('#Mob_no').val()
    $.ajax({
        url:'/checkNumber',
        method:'post',
        data:$('#MobileCheck').serialize(),
        success:(response)=>{
            console.log(response.status)
            if(response.status==true){
                $('.stdCreatePassword').addClass('stdCreatePassword1').removeClass('stdCreatePassword')
                $('.stdOtp1').addClass('stdOtp').removeClass('stdOtp1')
            
            }else{
                $('.errorh21').addClass('errorh2').removeClass('errorh21')
            }
        }
    })
})

$('#stdOtp').submit(e=>{
    e.preventDefault()

    $.ajax({
        url:'/verifyOtp?No='+stdMobile,
        method:'post',
        data:$('#stdOtp').serialize(),
        success:(response)=>{
            if(response.status===true){
                $('.stdOtp').addClass('stdOtp1').removeClass('stdOtp')
                $('.stdNewpassword1').addClass('stdNewpassword').removeClass('stdNewpassword1')
            }else{
                $('.errotp1').addClass('errotp').removeClass('errotp1')
            }
        }
    })
})
 
$('#NewPasswordForm').submit(e=>{
    e.preventDefault()

    let newPswrd=$('#Newpswrd').val()
    let rePswrd =$('#re-entrpswrd').val()
    if(newPswrd===rePswrd){
       $.ajax({
           url:'/newPassword',
           method:'post',
           data:{
               Password:newPswrd,
               Mobile  :stdMobile
           },
           success:(response)=>{
              
              if(response.status===false){
                alert("something ERROR please try again");
                location.reload()
              }else{
                 location.href='/loginstd-otp?num='+stdMobile
              }
           }

       })
    }else{
        $('.matchingerr1').addClass('matchingerr').removeClass('matchingerr1')
    }
})

repasword=()=>{
    let newPswrd=$('#Newpswrd').val()
    let rePswrd =$('#re-entrpswrd').val()
    if(newPswrd!=rePswrd){
        $('.matchingerr1').addClass('matchingerr').removeClass('matchingerr1')
    }else{
        $('.matchingerr').addClass('matchingerr1').removeClass('matchingerr')
    }
}

$('#stdloginForm').submit(e=>{
    e.preventDefault()
    $.ajax({
        url:'/login',
        method:'post',
        data:$('#stdloginForm').serialize(),
        success:(response)=>{
           if(response.status){
               location.href='/logintrue'
           }else{
            $('.loginError1').addClass('loginError').removeClass('loginError1')   
           }
        }
    })
})

OtpLogin=()=>{
    $('.stdLoginForm').addClass('stdLoginForm1').removeClass('stdLoginForm')
    $('.otpLogin1').addClass('otpLogin').removeClass('otpLogin1')
}

otp_Mob=()=>{
    let otpMob=$('#otp-Mob').val()
   
    if(otpMob.length === 10){
        $.ajax({
            url:'/checkNumber',
            method:'post',
            data:{
                Mobile:otpMob
            },
            success:(response)=>{
                if(response.status){
                    $('.wait4otp1').addClass('wait4otp').removeClass('wait4otp1')                  
                    $('.otp-mob-err').addClass('otp-mob-err1').removeClass('otp-mob-err')
                }else{
                    $('.otp-mob-err1').addClass('otp-mob-err').removeClass('otp-mob-err1')          
                }
            }
        })
    }else {
        $('.otp-mob-err1').addClass('otp-mob-err').removeClass('otp-mob-err1')
}}


$('#OtpLogin').submit(e=>{
    e.preventDefault()
    const otp=$('#otp-Otp').val()
    const mob=$('#otp-Mob').val()
    $.ajax({
      url:'/verifyOtp?No='+mob,
      method:'post',
      data:{
          OTP:otp
      },
      success:(response)=>{
        if(response.status) location.href='/loginstd-otp?num='+mob
        else $('.otp-Err1').addClass('otp-Err').removeClass('otp-Err1')
      }
  })

})

addLink=()=>{
    $('.videoNoteform').addClass('videoNoteform1').removeClass('videoNoteform')
    $('.linkNoteform1').addClass('linkNoteform').removeClass('linkNoteform1')
}
addVideo=()=>{
    $('.linkNoteform').addClass('linkNoteform1').removeClass('linkNoteform')
    $('.videoNoteform1').addClass('videoNoteform').removeClass('videoNoteform1')
}

noteDwn=()=>{
    setTimeout(()=>{
        $('.loading').addClass('loading1').removeClass('loading')
    },3000)
}
let searchType="name";
$('#Searchnote').on('change keyup paste',()=>{
    
    let val = $('#Searchnote').val();
    if(val){
        $(".searchNotes1").addClass("searchNotes row").removeClass("searchNotes1")
        $(".searchLoad1").addClass("searchLoad").removeClass("searchLoad1")
    }else{
        $(".searchNotes").addClass("searchNotes1").removeClass("searchNotes row")
    }
   
    $.ajax({
        url:'/searchNotes',
        method:'post',
        data:{
            val:val,
            type:searchType
        },
        success:(data)=>{
            $(".searchLoad").addClass("searchLoad1").removeClass("searchLoad")
            if(data!=''){
                document.getElementById('searchNote').innerHTML=`${data.map(note=>{
                    return `  <div onclick="searchCancel()" class="searchCancel"><i class="fa fa-close"></i></div>
                    <div class="note col-md-3">
                    <i class="fa fa-book"></i> 
                   <h3>${note.Name}</h3>
                   <p><a href="/viewNote?id=${note._id}">Pdf</a> <a href="/downloadNote?id=${note._id}"><i onclick="noteDwn()" class="fa fa-download"></i></a></p>
                    <a href="/viewVideo?id=${note._id}" >Video <i class="fa fa-eye"></i></a>
                    <p>Date:${note.Date}</p>
                </div>`
                })}`
            }else{
                document.getElementById('searchNote').innerHTML=`
                <div onclick="searchCancel()" class="searchCancel"><i class="fa fa-close"></i></div>
                <h3 class="noNotes">No Notes</h3>`
            }
        }
    })

})
$('#SearchDate').on('change keyup paste',()=>{
    
    let val = $('#SearchDate').val();
    if(val){
        $(".searchNotes1").addClass("searchNotes row").removeClass("searchNotes1")
        $(".searchLoad1").addClass("searchLoad").removeClass("searchLoad1")
    }else{
        $(".searchNotes").addClass("searchNotes1").removeClass("searchNotes row")
    }
   
    $.ajax({
        url:'/searchNotes',
        method:'post',
        data:{
            val:val,
            type:searchType
        },
        success:(data)=>{
            $(".searchLoad").addClass("searchLoad1").removeClass("searchLoad")
            if(data!=''){
             
                document.getElementById('searchNote').innerHTML=`${data.map(note=>{
                    return ` <div onclick="searchCancel()" class="searchCancel"><i class="fa fa-close"></i></div>
                     <div class="note col-md-3">
                    <i class="fa fa-book"></i> 
                   <h3>${note.Name}</h3>
                   <p><a href="/viewNote?id=${note._id}">Pdf</a> <a href="/downloadNote?id=${note._id}"><i onclick="noteDwn()" class="fa fa-download"></i></a></p>
                    <a href="/viewVideo?id=${note._id}" >Video <i class="fa fa-eye"></i></a>
                    <p>Date:${note.Date}</p>
                </div>`
                })}`
            }else{
                
                document.getElementById('searchNote').innerHTML=`
                <div onclick="searchCancel()" class="searchCancel"><i class="fa fa-close"></i></div>
                <h3 class="noNotes">No Notes</h3>`
            }
        }
    })

})
changeSearch=()=>{
    if(searchType=='name'){
$('.searchName').addClass('searchName1').removeClass('searchName')
$('.searchDate1').addClass('searchDate').removeClass('searchDate1')
$('.searchwithntext1').addClass('searchwithntext').removeClass('searchwithntext1')
    $('.searchwithdText').addClass('searchwithdText1').removeClass('searchwithdText')
searchType='date'
}else{
    $('.searchName1').addClass('searchName').removeClass('searchName1')
    $('.searchDate').addClass('searchDate1').removeClass('searchDate')
    $('.searchwithntext').addClass('searchwithntext1').removeClass('searchwithntext')
    $('.searchwithdText1').addClass('searchwithdText').removeClass('searchwithdText1')
     
    searchType='name'
}
}
searchCancel=()=>{
    $(".searchNotes").addClass("searchNotes1").removeClass("searchNotes row")
    $("#Searchnote").val('')
    $("#SearchDate").val('')
    
}

$("#attendanceDate").on('change keyup paste',()=>{
    let date= $('#attendanceDate').val();
   
    location.href="/admin/attendanceD?date="+date
})

changeMark=(Id,std)=>{
    
    let mark=$('#Mark-Ass'+Id).val()

    $.ajax({
        url:'/admin/Ass-Mark',
        method:'post',
        data:{
            AssId:Id,
            StdId:std,
            Mark:mark
        },
        success:(response)=>{
            alert(ooke)
            $('#Mark-Ass').val(mark)
        }
    })
}



$(document).ready(function() {

     $('#taskForm').submit(function(e) {
       e.preventDefault()
        $(this).ajaxSubmit({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        $('.progress1').addClass('progress').removeClass('progress1')
                        var percentComplete = (evt.loaded / evt.total) * 100;
                        // Place upload progress bar visibility code here
                        $('.progress-bar').css("width",percentComplete+"%")
                        console.log(percentComplete)
                    }
                }, false);
                return xhr;
            },

            success: function(response) {
                setTimeout(()=>{
                    $('.progress').addClass('progress1').removeClass('progress')
                    $('.uploadedstatus1').addClass('uploadedstatus').removeClass('uploadedstatus1')
                   $('#assFile').val(' ')
                    setTimeout(()=>{
                        $('.uploadedstatus').addClass('uploadedstatus1').removeClass('uploadedstatus')
                    },2000)
                },2000)
            }
    });
        
    return false;
    });    
});
closeback=(Id)=>{
    let div =document.querySelector("#div"+Id)
    div.style="transform:rotateY(0deg)"
    
}

view_assdetails=(Id)=>{
let div =document.querySelector("#div"+Id)

div.style="transform:rotateY(180deg)"

$.ajax({
    url:'/getAssignment?id='+Id,
    method:'get',
    success:(data)=>{
        $('.backload').addClass('backload1').removeClass('backload')
        if(data!= ' '){
        
            document.getElementById('back'+Id).innerHTML =`
            <div  class="closeback"><i onclick="closeback('${Id}')" class="fa fa-close"></i></div>
            <div class="datadetails"><h5><a href="/view-Assignment?id=${data.TopicId}">${data.Topic}</a></h5>
            <p>Date : ${data.Date}</p>
            <p>Submited Time : ${data.Time}</p>
            <p>Mark : ${data.Mark ? data.Mark : `Not valued` } </p>
            <a href="/viewsubmited?id=${data.TopicId}" class="btn btn-primary"> view submited </a> 
            </div>
            `
        
    }else{
        document.getElementById('back'+Id).innerHTML = `
        <div class="closeback"><i onclick="closeback('${Id}')" class="fa fa-close"></i></div>
        <h5>Not Attend</h5>
        `
        }
    }
})


}







let img_view=document.querySelector('.img-view'),
upload = document.querySelector('#photo-file'),
cropper = '';

// on change show image with crop options
upload.addEventListener('change', (e) => {
  if (e.target.files.length) {
		// start file reader
    const reader = new FileReader();
    reader.onload = (e)=> {
      if(e.target.result){
				// create new image
				let img = document.createElement('img');
				img.id = 'image';
				img.src = e.target.result
       
			
				
				// append new image
               img_view.appendChild(img);
				// show save btn and options
			
				// init cropper
				cropper = new Cropper(img);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});


$('#upload-Photo').submit(e=>{
    e.preventDefault()

    let imgsrc = cropper.getCroppedCanvas({
        width:"300"
    }).toDataURL()
   
   $('#croped-img').val(imgsrc)
    
    $('#upload-Photo').ajaxSubmit({
        success:()=>{
           location.reload();
        }
    });
    return false;
})
let deltePhotoId=''
photodeletecnfrm=(Id)=>{
deltePhotoId=Id
    $('.photodelete1').addClass('photodelete').removeClass('photodelete1')
}

deltePhoto=()=>{
   
    $.ajax({
        url:'/admin/deletePhoto?id='+deltePhotoId,
        method:'get',
        success:(response)=>{

            if(response.status) $('#div'+deltePhotoId).remove()
            deltePhotoId=''
            $('.photodelete').addClass('photodelete1').removeClass('photodelete')
        }
    })
}

cncldeltePhoto=()=>{
    $('.photodelete').addClass('photodelete1').removeClass('photodelete')
    deltePhotoId=''
}

function takeAttmonth(){
    let month = $('#attendancemonth').val()
       location.href = '/attendanceM?month='+month

}


 function openOptions_ann(id){
     
    let div = document.querySelector('#frnt'+id)
        div.style='transform:translate(70px)'
        $('#btn'+id).addClass('optionbtnAnn1').removeClass('optionbtnAnn')
        $('#btnc'+id).addClass('optioncnlAnn').removeClass('optioncnlAnn1')
}
function cancelOption_ann(id){
    let div = document.querySelector('#frnt'+id)
    div.style='transform:translate(0px)'
    $('#btn'+id).addClass('optionbtnAnn').removeClass('optionbtnAnn1')
    $('#btnc'+id).addClass('optioncnlAnn1').removeClass('optioncnlAnn')
}   
var delteAnnId=''

function anndeleteCnfrm (Id){
 delteAnnId = Id;
$('.anndelete1').addClass('anndelete').removeClass('anndelete1')
}

function delteAnn(){
    $.ajax({
        url:'/admin/delteAnn?id='+delteAnnId,
        method:'get',
        success:(r)=>{
            $('.anndelete').addClass('anndelete1').removeClass('anndelete')
            $('#div'+delteAnnId).remove()

        }
    })
}

function cncldelteAnn(){
    $('.anndelete').addClass('anndelete1').removeClass('anndelete')
    delteAnnId = ' '
}
var openann = false

function openAnn(){

    if(openann){
        $('.anncontnt').addClass('anncontnt1').removeClass('anncontnt')
    $('.closeannbtn').addClass('closeannbtn1').removeClass('closeannbtn')
        openann = false
    }else{
        $('.anncontnt1').addClass('anncontnt').removeClass('anncontnt1')
     $('.closeannbtn1').addClass('closeannbtn').removeClass('closeannbtn1')
        openann = true
    }
}



function showAttstatus(){
    $('.todayTasktext').addClass('todayTasktext1').removeClass('todayTasktext')
    $('.todayTaskstatus1').addClass('todayTaskstatus').removeClass('todayTaskstatus1')
}


function PaywithRazorPay(id,price){
    
   
    $.ajax({
        url:'/payEventRazor',
        method:'post',
        data:{
            EventId:id,
            Price:price
        },
          success:(responce)=>{
              if(responce.paymentErr){
                alert("payment error")
                  
              } else {
                razorPayment(responce)
              }
            
    }
    })
}

function razorPayment(data){
    var options = {
        "key": "rzp_test_74IUoLSXBjLRXM", // Enter the Key ID generated from the Dashboard
        "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Class Room",
        "description": "Test Transaction",
        "image": "https://lh3.googleusercontent.com/proxy/yqFfR8_Li7B6SorbTcnd_lCYrrh5i0oVYsdqRdUkxfIT8Dm0WHxie8SObIvM8iwVlV3TW8TAQ2-ebFsHcP3jd9TPZqInMPzrBN5P-WC_hHP_W-NNAAUaDzwwEQdpAurLTdEmCIPPb7thkbxilYAd5v3vnMJwYJNcLsgGR_sGt26Er-0owIKCs_SF8tSSpwFlLPWsXwIMPxJYiWkpWt0Nm84SDbFEVZiY_g",
        "order_id":data.id, 
        "handler": function (response){
            
            verifyPayment(response,data)
        },
        "prefill": {
            "name": "Class Room",
            "email": "ClassRoom@gmail.com",
            "contact": "9072956555"
        },
        "notes": {
            "address": "ClassRoom Corporate Office"
        },
        "theme": {
            "color": "#F37254"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
}

function  verifyPayment(payment,data){
    $.ajax({
        url:'/verify-payment-Razor',
        data:{
        payment,
        data
    },
    method:'post',
    success:(responce)=>{
        if(responce.payment){
            location.reload()
        }else{
            alert("payment error")
        }

    }
    })
}


var openevnt= false
 function openhomeevnt(){
    
    if(!openevnt){ 
        $('.homeevnt-cntent1').addClass('homeevnt-cntent').removeClass('homeevnt-cntent1')
        openevnt=true
    }
        else{
             $('.homeevnt-cntent').addClass('homeevnt-cntent1').removeClass('homeevnt-cntent') 
              openevnt=false
        }
            }
var feeoption= false
function openfee(){
    if(feeoption){
       $('.fees-methods').addClass('fees-methods1').removeClass('fees-methods')
       feeoption= false 
    }else{
        $('.fees-methods1').addClass('fees-methods').removeClass('fees-methods1')
       feeoption= true
    }

}


function payfee_razor(amount){
    $.ajax({
        url:'/payfee-Razor',
        method:'post',
        data:{
            amount:amount
        },
        success:(response)=>{
            if(response.paymentErr){
                alert("payment error")
                  
              } else {
                razorFeePayment(response)
              }
        }
    })

}

function razorFeePayment(data){
    var options = {
        "key": "rzp_test_74IUoLSXBjLRXM", // Enter the Key ID generated from the Dashboard
        "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Class Room",
        "description": "Fee Transaction",
        "image": "https://lh3.googleusercontent.com/proxy/yqFfR8_Li7B6SorbTcnd_lCYrrh5i0oVYsdqRdUkxfIT8Dm0WHxie8SObIvM8iwVlV3TW8TAQ2-ebFsHcP3jd9TPZqInMPzrBN5P-WC_hHP_W-NNAAUaDzwwEQdpAurLTdEmCIPPb7thkbxilYAd5v3vnMJwYJNcLsgGR_sGt26Er-0owIKCs_SF8tSSpwFlLPWsXwIMPxJYiWkpWt0Nm84SDbFEVZiY_g",
        "order_id":data.id, 
        "handler": function (response){
            
            verifyFeePayment(response,data)
        },
        "prefill": {
            "name": "Class Room",
            "email": "ClassRoom@gmail.com",
            "contact": "9072956555"
        },
        "notes": {
            "address": "ClassRoom Corporate Office"
        },
        "theme": {
            "color": "#F37254"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
}
function  verifyFeePayment(payment,data){
    $.ajax({
        url:'/verify-Feepayment-Razor',
        data:{
        payment,
        data
    },
    method:'post',
    success:(responce)=>{
        if(responce.payment){
           show_feeStatus()
        }else{
            alert("payment error")
        }

    }
    })
}

function  show_feeStatus(){
    
    let div = document.querySelector('.paidStatus')
    div.style="left:10%;"
    setTimeout(() => {
        div.style='left:-20%'
    }, 4000);
}

function showchat_box(){
    $('.chat-box1').addClass('chat-box').removeClass('chat-box1')
    var height = 0;
   $('#chat-body div').each(function(i, value){
    height += parseInt($(this).height());
    
    });

height += '';

$('#chat-body').animate({scrollTop: height*height});
}

function hidechat_box(){
    $('.chat-box').addClass('chat-box1').removeClass('chat-box')
}


function stdsend_Message(){
 let msg = $('#msg').val()
 $('#msg').val('')
    $.ajax({
        url:'/sendMessage',
        method:'post',
        data:{
            message: msg
        },
        success:(data)=>{
            if(data.status){
                document.getElementById('chat-body').innerHTML +=`
                <div class="message-s">
                  <p>${msg}</p>
               </div>`
               var height = 0;
               $('#chat-body div').each(function(i, value){
                height += parseInt($(this).height());
                
                });
            
            height += '';
            
            $('#chat-body').animate({scrollTop: height*height});
            
            }else {
                alert('sending failed') }
        }
    })
}
var selectedStd = '';
function show_stdmsg(id){
    selectedStd = ''
    $('.selctmsg').addClass('selctmsg1').removeClass('selctmsg')
    $('.studentchat-message1').addClass('studentchat-message').removeClass('studentchat-message1')
    $.ajax({
        url:'/admin/getMessages',
        method:'post',
        data:{
            Id:id
        },
        success:(data)=>{
            $('.loadingmsg').addClass('loadingmsg1').removeClass('loadingmsg')
            if(data){
                selectedStd = data.Id;
                document.getElementById('msg-head').innerHTML = `<h4>${data.Name}</h4>`
                if(data.Messages){
                document.getElementById('msg-body').innerHTML = 
               
                data.Messages.map(msg=>{
                    return `
                        <div class=${msg.Tutor ? "admsg-s" : "admsg-r"}>
                        <p>${msg.Message}</p>
                        </div>                   
                    `
                })

                var height = 0;
                $('#msg-body div').each(function(i, value){
                 height += parseInt($(this).height());
                 
                 });
             
             height += '';
             
             $('#msg-body').animate({scrollTop: height*height});

            }else{
                document.getElementById('msg-body').innerHTML = ' '
            }
            }else{
                location.reload()
            }

        }
    })
}

function sendMessage_admin(){
    let msg = $('#adminmsg').val()
    $('#adminmsg').val('')
    $.ajax({
        url:'/admin/sendMessage',
        method:'post',
        data:{
            message:msg,
            Id:selectedStd
        },
        success:(data)=>{
            if(data.status){
                document.getElementById('msg-body').innerHTML +=`
                <div class=admsg-s>
                <p>${msg}</p>
                `   
                var height = 0;
                $('#msg-body div').each(function(i, value){
                 height += parseInt($(this).height());
                 
                 });
             
             height += '';
             
             $('#msg-body').animate({scrollTop: height*height});             
            }else alert('sending failed')
        }
    })
}

