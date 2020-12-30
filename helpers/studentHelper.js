var db=require('../config/connection');
var collections=require('../config/collections');
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
 
 const twilo = require('../config/twiloConfig')  
 
const otpclient = require('twilio')(twilo.accountSID,twilo.authTOKEN)
var Razorpay=require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_74IUoLSXBjLRXM',
    key_secret: 'o3po6jeg50ebWG1bvYNjfT1e',
  });
module.exports={
    checkMobile_NO:(Number)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collections.STUDENTS_COLLECTION).findOne({Mobile:Number.Mobile}).then((response)=>{
                if(response){
                    const number = parseInt(Number.Mobile) 
                    console.log("calling");
                  otpclient.verify.services(twilo.serviceId).verifications.create({
                    to:`+91${number}`,
                    channel:"sms"
                    
                  }).then((data)=>{
                    
                    resolve({status:true})

                  }).catch((err)=>{
                      console.log("err",err);
                      reject({status:false})
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
            otpclient.verify.services(twilo.serviceId).verificationChecks.create({
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
                reject({status:false})
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
       },
       getPhotos:()=>{
           return new Promise(async(resolve,reject)=>{
            let Photos = await db.get().collection(collections.PHOTOS_COLLECTIONS).find({}).toArray()
            resolve(Photos)
           })
       },
       getAnnouncements:()=>{
           return new Promise(async(resolve,reject)=>{
               let ann = await db.get().collection(collections.ANNOUNCEMENTS_COLLECTIONS).find({}).toArray()
               resolve(ann)
           })
       },
       getAnnouncement:(id)=>{
           return new Promise(async(resolve,reject)=>{
               let ann = await db.get().collection(collections.ANNOUNCEMENTS_COLLECTIONS).findOne({_id:objectId(id)})
                resolve(ann)
            })
       },
       getEvents:()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collections.EVENTS_COLLECTIONS).find({}).toArray()
            resolve(data)
        })
       },
       getEvent:(Id)=>{
           return new Promise((resolve,reject)=>{
               db.get().collection(collections.EVENTS_COLLECTIONS).findOne({_id:objectId(Id)})
               .then(data=>resolve(data))
           })
       },
       generateRazorepay:(details)=>{
           return new Promise((resolve,reject)=>{
            var options = {
                amount: details.Price*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ""+details.EventId
              };
              console.log(options,"==")
              instance.orders.create(options, function(err,data) {
                if (err) {
                    console.log("err",err)
                   reject(err)
                }else{
                    
              resolve(data)
                }
           })
        })
    },
    verifyPayment_Razor:(details)=>{
        return new Promise((resolve,reject)=>{
           
            const crypto =require('crypto');
            let hmac= crypto.createHmac('sha256','o3po6jeg50ebWG1bvYNjfT1e')

            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
            hmac=hmac.digest('hex')
            if(hmac==details['payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }
        })
    },
    addPayedstatus:(student,eventId)=>{
        return new Promise(async(resolve,reject)=>{
            
            let obj={
                Student:student._id,
                Name:student.Name,
                PaidDate:new Date().toLocaleDateString(),
                PaidTime:new Date().toLocaleTimeString()
            }
            db.get().collection(collections.EVENTS_COLLECTIONS).updateOne({_id:objectId(eventId)},{
                $push:{PaidStudents:obj}
            }).then(response=>{
                db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(student._id)},{
                    $push:{Paidevents:{
                        EventId:eventId,
                        PaidDate:new Date().toLocaleDateString()
                    }}
                }).then(response=> resolve())
            })
        })
    },
    addFeeStatus:(std)=>{
        return new Promise(async(resolve,reject)=>{
            let data ={
                Name:std.Name,
                StdId:std._id,
                PaidDate:new Date().toLocaleDateString(),
                PaidTime:new Date().toLocaleTimeString()
            }
            db.get().collection(collections.FEE_COLLECTIONS).insertOne(data).then(reponse=>{
                resolve(reponse)
            })
        })
    },
    sendMessage:(msg,Id)=>{
        return new Promise((resolve,reject)=>{

        db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(Id)},{
            $push:{Messages:msg}
        }).then(reponse=> resolve()).catch(err=> reject())
    })
    }

    

}