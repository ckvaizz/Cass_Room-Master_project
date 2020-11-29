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
                
            }
        }
        
    })
   
 }


 cancel=()=>{
     location.href='/admin/profile';
 }