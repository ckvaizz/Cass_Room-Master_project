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
                resolve()
            })}
    
        })
        },
       getStudent:(number)=>{
        return new Promise(async(resolve,reject)=>{
            const student= await db.get().collection(collections.STUDENTS_COLLECTION).findOne({Mobile:number})
            resolve(student)
        })
       },
       doLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collections.STUDENTS_COLLECTION).findOne({Mobile:data.Mobile})
            if(user!=null){
                bcrypt.compare(data.Password,user.Password).then(status=>{
                    if(status){
                        resolve(user)
                    }else reject({status:false})
                    
                })
            }else reject({status:false})
                
            
        })
       },
       getNotes:()=>{
           return new Promise(async(resolve,reject)=>{
               const notes = await db.get().collection(collections.NOTES_COLLECTION).find({}).toArray()
               console.log(notes)
               resolve(notes)
            })
       },
       getNote:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.NOTES_COLLECTION).findOne({_id:objectId(id)}).then(note=>{
                resolve(note)
            })
        })
       },
       markAttendance:(note,stdId,status)=>{
        

        return new Promise(async(resolve,reject)=>{
            let assgnmntObj={
                Topic:note.Name,
                Date:note.Date,
                status:status,
                TopicId:objectId(note._id)
            }
            console.log("*****")
            const student= await db.get().collection(collections.STUDENTS_COLLECTION).findOne({_id:objectId(stdId)})
            student.Attendance.map(attendance=>{
                console.log(attendance.TopicId,"--");
                console.log(typeof(attendance.TopicId));
                if(attendance.TopicId === objectId(note._id)){
                    console.log("found===");
                }
            })   
            console.log(note._id,"NoteId==")
            console.log(typeof(note._id));
           
            //db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(stdId)},{
            //    $push:{Attendance:assgnmntObj}
            //}).then(reponse=> resolve())
        
            
            })
       }

}