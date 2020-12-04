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
//$('#assignmentupload').submit(e=>{
   // e.preventDefault()
   // $.ajax({
    //    url:'/admin/assignment',
    //    method:'post',
  //      data:$("#File")[0].files[0],
//        success:()=>{

  //      }
  //  })
//})

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
    console.log("loading")
    $('.loading1').addClass('loading').removeClass('loading1')
   
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

            }else{

            }
        }
    })
})