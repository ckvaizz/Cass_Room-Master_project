var db=require('../config/connection');
var collections=require('../config/collections');
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
const accountSID ="ACad1ba650469ec2893ff472d077ef76f3"
const authTOKEN = "a049e12e1b256546e07c082a9b600899"  
 const serviceId ="VA465cc0f99ed26a52dde7f6111fda0102"
const otpclient = require('twilio')(accountSID,authTOKEN)

module.exports={
    checkMobile_NO:(Number)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collections.STUDENTS_COLLECTION).findOne({Mobile:Number.Mobile}).then((response)=>{
                if(response){
                    const number = parseInt(Number.Mobile) 
                    console.log("calling");
                  otpclient.verify.services(serviceId).verifications.create({
                    to:`+91${number}`,
                    channel:"sms"
                    
                  }).then((data)=>{
                    console.log("caliing");  
                    console.log(data);
                    resolve({status:true})

                  }).catch((err)=>{
                      console.log("err",err);
                  })  
                }else{
                    reject({status:false})
                    
                }
            })
        })
    },
    checkOtp:(data,mob)=>{
        console.log(data,mob);
        return new Promise((resolve,reject)=>{
            otpclient.verify.services(serviceId).verificationChecks.create({
                to:`+91${mob}`,
                code:data.OTP
            }).then(data=>{
                console.log(data.status)
                if(data.status==='approved'){
                    resolve({status:true})
                }else{
                    reject({status:false})
                }
            }).catch(err=>{
                console.log("error in verification",err)
            })
        })
    },
    newPassword:(data)=>{
        return new Promise(async(resolve,reject)=>{
            if(data.Mobile==''){
               reject({mobile:null})
            }else{
            data.Password =await bcrypt.hash(data.Password,10)
            db.get().collection(collections.STUDENTS_COLLECTION).updateOne({Mobile:data.Mobile},{
                $set:{
                    Password:data.Password
                }
            }).then(response=>{
                console.log("response",response)
                //resolve({})
            })}
    
        })
        }

}