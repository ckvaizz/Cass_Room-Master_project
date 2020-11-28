$(function(){
    $('.edittutorprofile').on('submit', function(event){
        event.preventDefault();
        event.stopPropagation();
        console.log("calling++");
        $('.editconfirm1').addClass('editconfirm').removeClass('editconfirm1');
    });
});


submitprofile=()=>{
    
    $.ajax({
        url:'/admin/editprofile',
        method:'post',
        data:$('#tutorForm').serialize(),
        success:()=>{
            console.log("ajaxxx")
        }
        
    })
   
 }


 $(document).ready(function() {
    console.log($.ajax);
  });