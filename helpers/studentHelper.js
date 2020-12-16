var db=require('../config/connection');
var collections=require('../config/collections');
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
const accountSID ="ACad1ba650469ec2893ff472d077ef76f3"
const authTOKEN = "3f50afe920866c17fc5adb2f05f77d83"  
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
                TopicId:note._id
            }
            
            const student= await db.get().collection(collections.STUDENTS_COLLECTION).findOne({_id:objectId(stdId)})
            if(student.Attendance){
                let topicExist=await student.Attendance.findIndex(att=>objectId(att.TopicId).toString()== objectId(note._id).toString())  
                console.log("topic",topicExist)
                if(topicExist!=-1){
                
               await student.Attendance.map(async attendance=>{
                if(objectId(attendance.TopicId).toString() == objectId(note._id).toString()){
                    console.log("found===");
                    if(attendance.status){
                       console.log("matching++");
                         return ( resolve())
                         
                    }else{
                       await db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(stdId),'Attendance.TopicId':objectId(note._id)},{
                            $set:{'Attendance.$.status':status}
                        }).then(response=> { 
                            return (resolve())})
                    }
                } })}

                else{    
                db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(stdId)},{
                    $push:{Attendance:assgnmntObj}
                 }).then(reponse=>{return (resolve())})
                } 
             }else{
                console.log("calling**")
                db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(stdId)},{
                   $push:{Attendance:assgnmntObj}
                }).then(reponse=>{return ( resolve())})

            }  })
       },
       search:(Data)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(Data.val);
        if(Data.type=='name'){
            let data = await db.get().collection(collections.NOTES_COLLECTION).find({ Name: { $regex: Data.val, $options: '$i' }}).toArray()
            resolve(data)

        }else{
            var newdate = Data.val.split("-").reverse().join("/")
            console.log("date",newdate)
            let data = await db.get().collection(collections.NOTES_COLLECTION).find({ Date: { $regex: newdate, $options: '$i' }}).toArray()
              console.log(data)
            resolve(data)

        }
        
    })
        
       },
       getAssignments:()=>{
           return new Promise(async(resolve,reject)=>{
            let assignments= await db.get().collection(collections.ASSIGNMENTS_COLLECTION).find({}).toArray()
            resolve(assignments)
        })
       },
       getAssignment:(id)=>{
           return new Promise(async(resolve,reject)=>{
               let assignment=await  db.get().collection(collections.ASSIGNMENTS_COLLECTION).findOne({_id:objectId(id)})
               resolve(assignment)

       })
       },
       submitAssignment:(file,id)=>{
           return new Promise(async(resolve,reject)=>{
             db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(id)},{
                 $push:{Assignments:file}
             }).then(response=>{
                 resolve()
             })
            
           })
       },
       getStudentDetails:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let student= await db.get().collection(collections.STUDENTS_COLLECTION).findOne({_id:objectId(Id)})
            resolve(student)
        })
       }

}