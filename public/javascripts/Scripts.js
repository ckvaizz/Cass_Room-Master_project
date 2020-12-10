

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

deleteNotecnfrm=(Id)=>{
    console.log("calling");
    deleteNoteId=Id
$('.deleteassignmentcnfrm1').addClass('deleteassignmentcnfrm').removeClass('deleteassignmentcnfrm1')
}
deleteNote=()=>{
$.ajax({
    url:'/admin/deleteNote?id='+deleteNoteId,
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
        $(".searchNotes1").addClass("searchNotes").removeClass("searchNotes1")
    }else{
        $(".searchNotes").addClass("searchNotes1").removeClass("searchNotes")
    }
   
    $.ajax({
        url:'/searchNotes',
        method:'post',
        data:{
            val:val,
            type:searchType
        },
        success:(data)=>{
            if(data!=''){
                document.getElementById('searchNote').innerHTML=`${data.map(note=>{
                    return ` <div class="note col-md-3">
                    <i class="fa fa-book"></i> 
                   <h3>${note.Name}</h3>
                   <p><a href="/viewNote?id=${note._id}">Pdf</a> <a href="/downloadNote?id=${note._id}"><i onclick="noteDwn()" class="fa fa-download"></i></a></p>
                    <a href="/viewVideo?id=${note._id}" >Video <i class="fa fa-eye"></i></a>
                    <p>Date:${note.Date}</p>
                </div>`
                })}`
            }else{

            }
        }
    })

})
$('#SearchDate').on('change keyup paste',()=>{
    
    let val = $('#SearchDate').val();
    if(val){
        $(".searchNotes1").addClass("searchNotes row").removeClass("searchNotes1")
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
            if(data!=''){
                document.getElementById('searchNote').innerHTML=`${data.map(note=>{
                    return ` <div class="note col-md-3">
                    <i class="fa fa-book"></i> 
                   <h3>${note.Name}</h3>
                   <p><a href="/viewNote?id=${note._id}">Pdf</a> <a href="/downloadNote?id=${note._id}"><i onclick="noteDwn()" class="fa fa-download"></i></a></p>
                    <a href="/viewVideo?id=${note._id}" >Video <i class="fa fa-eye"></i></a>
                    <p>Date:${note.Date}</p>
                </div>`
                })}`
            }else{

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