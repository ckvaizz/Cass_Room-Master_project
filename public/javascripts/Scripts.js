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