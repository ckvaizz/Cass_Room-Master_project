var db=require('../config/connection');
var collections=require('../config/collections');
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId

module.exports={
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collections.ADMIN_COLLECTION).findOne({name:userData.name})
            if(user){
            bcrypt.compare(userData.password,user.password).then((status)=>{
                if (status){
                    console.log('login')
                    resolve({login:true,user:user})
                }else{
                    console.log("login error");
                    resolve({login:false})
                }
            
            })
        }else{
            reject({userName:null})
        }
                    
        })
    },
    editProfile:(details,admin)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.ADMIN_COLLECTION).updateOne({_id:objectId(admin._id)},{
            $set:{
                Profile:details
            }   
            }).then(()=>{
                resolve();
            })
        })
    },
    getProfile:(data)=>{
        return new Promise(async(resolve,reject)=>{
            const admin =await db.get().collection(collections.ADMIN_COLLECTION).findOne({_id:objectId(data._id)});
            if(admin.Profile){
                resolve(admin.Profile)
            }else{
                resolve(false)
            }
            
        })
    },
    addStudent:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENTS_COLLECTION).insertOne(data).then((respo)=>{
                resolve()
            })
        })
    },
    getStudents:()=>{
        return new Promise(async(resolve,reject)=>{
            const students=await db.get().collection(collections.STUDENTS_COLLECTION).find().toArray();
                resolve(students)
        })
    },

    getStudent:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            
             db.get().collection(collections.STUDENTS_COLLECTION).findOne({_id:objectId(userId)}).then((data)=>{
        
            resolve(data)
             })
        })
    },
    editStudent:(data,Id)=>{
        return new  Promise((resolve,reject)=>{
           db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(Id)},{
                $set:{
                    "Name":data.Name,
                    "Gender":data.Gender,
                    "Roll-No":data['Roll-No'],
                    "Mobile":data.Mobile,
                    "Email":data.Email,
                    "Address":data.Address
                }
            }).then((response)=>{

                resolve()
            })
        })
    },
    addAssignment:(file)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collections.ASSIGNMENTS_COLLECTION).insertOne(file).then((response)=>{
                resolve(response.ops[0])
            })
        })
    },
    getAssignment:(Id)=>{
        return new Promise(async(resolve,reject)=>{
          const data = await  db.get().collection(collections.ASSIGNMENTS_COLLECTION).findOne({_id:objectId(Id)})
            resolve(data);
        })
    },
    getAssignments:()=>{
        return new Promise(async(resolve,reject)=>{
            let assignments= await db.get().collection(collections.ASSIGNMENTS_COLLECTION).find({}).toArray()
            resolve(assignments);
        })
    },
    deleteStudent:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENTS_COLLECTION).removeOne({_id:objectId(Id)}).then((response)=>{
                resolve();
            })
        })
    },
    deleteAssignment:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.ASSIGNMENTS_COLLECTION).removeOne({_id:objectId(Id)}).then((response)=>{
                resolve()
            })
        })
    },
    addNote:(file)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.NOTES_COLLECTION).insertOne(file).then((response)=>{
               
                resolve(response.ops[0]._id)
            })
        })
    },
    getNotes:()=>{
        return new Promise(async(resolve,reject)=>{
            let notes= await db.get().collection(collections.NOTES_COLLECTION).find({}).toArray()
            resolve(notes)
        })
    },
    deleteNote:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let note= await db.get().collection(collections.NOTES_COLLECTION).findOne({_id:objectId(Id)})
            db.get().collection(collections.NOTES_COLLECTION).removeOne({_id:objectId(Id)}).then((response)=>{
                let status={}
                if(note.video && !note.VideoLink){
                    status.video=true
                }else{
                    status.video=false
                }
                if(note.noPdf){
                    status.pdf=false
                }else {
                    status.pdf=true
                }
                resolve(status)
            })
        })
    },
    getNote:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let note=await db.get().collection(collections.NOTES_COLLECTION).findOne({_id:objectId(Id)});
            resolve(note)
        })
    },
    getStdAssignment:(Id,stdId)=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collections.STUDENTS_COLLECTION).findOne({_id:objectId(stdId)})
            data.Assignments.map(std=>{
                if(std.TopicId==Id){

                }
        })
        })
    },
    setMark:(details)=>{
        return new Promise((resolve,reject)=>{
            console.log(details)
            db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(details.StdId),'Assignments.TopicId':details.AssId},{
                $set:{'Assignments.$.Mark':details.Mark}
            }).then(response=>{
                console.log(response)
                resolve()
            })
        

    })
    },
    uploadPhoto:(photo)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PHOTOS_COLLECTIONS).insertOne(photo).then(response=>{
                resolve(response.ops[0]._id)
        })
        })
    },
    getPhotos:()=>{
        return new Promise(async(resolve,reject)=>{
            let Photos = await db.get().collection(collections.PHOTOS_COLLECTIONS).find({}).toArray()
            resolve(Photos)
        })

    },
    deletePhoto:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PHOTOS_COLLECTIONS).removeOne({_id:objectId(Id)}).then(response=>{
                resolve()
            })
        })
    },
    uploadAnnouncements:(file)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.ANNOUNCEMENTS_COLLECTIONS).insertOne(file).then(response=>{
                resolve(response.ops[0]._id)
            })
        })
    },
    getAnnouncements:()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collections.ANNOUNCEMENTS_COLLECTIONS).find({}).toArray()
            resolve(data)
        })
    },

    deleteAnnouncement:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let ann = await db.get().collection(collections.ANNOUNCEMENTS_COLLECTIONS).findOne({_id:objectId(Id)})
            db.get().collection(collections.ANNOUNCEMENTS_COLLECTIONS).removeOne({_id:objectId(Id)}).then(r=>{
                resolve(ann)
            })

        })
    },
    getAnnouncement:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collections.ANNOUNCEMENTS_COLLECTIONS).findOne({_id:objectId(Id)})
            resolve(data)
        })
    },
    addEvent:(file)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.EVENTS_COLLECTIONS).insertOne(file).then(response=>{
                resolve(response.ops[0]._id)
            }).catch(err=>{
                reject(err)
            })
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
            db.get().collection(collections.EVENTS_COLLECTIONS).findOne({_id:objectId(Id)}).then(data=>{
                resolve(data)
            })
        })
    },
    getFees:()=>{
        return new Promise(async(resolve,reject)=>{
            let fees = await db.get().collection(collections.FEE_COLLECTIONS).find({}).toArray()
            resolve(fees)
        })
    },
    sendMessage:(msg,Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.STUDENTS_COLLECTION).updateOne({_id:objectId(Id)},{
                $push:{Messages:msg}
            }).then(d=> resolve()).catch(e=> reject())
    })
    }

}
