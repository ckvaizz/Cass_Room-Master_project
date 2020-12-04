var db=require('../config/connection');
var collections=require('../config/collections');
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
const accountSID ="ACad1ba650469ec2893ff472d077ef76f3"
const authTOKEN = "cabd46f937c65039efe062114727fffa"  
 const serviceId ="KSf6c0354d1526427132f27fae21cc8f8a"
const otpclient = require('twilio')(accountSID,authTOKEN)

module.exports={
    checkMobile_NO:(Number  )=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collections.STUDENTS_COLLECTION).findOne({Mobile:Number.Mobile}).then((response)=>{
                if(response){
                    const number = parseInt(Number.Mobile) 
                    console.log("calling");
                  otpclient.verify.services(serviceId).verifications.create({
                    to:`+${number}`,
                    channel:"sms"
                    
                  }).then((data)=>{
                    console.log("caliing");  
                    console.log(data);

                  }).catch((err)=>{
                      console.log("err",err);
                  })  
                }else{
                    reject({status:false})
                }
            })
        })
    }

}