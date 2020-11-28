var db=require('../config/connection');
var collections=require('../config/collections');
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
module.exports={
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("userData:",userData)
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
            console.log(details,admin)
            db.get().collection(collections.ADMIN_COLLECTION).updateOne({_id:objectId(admin._id)},{
            $set:{
                Profile:details
            }   
            }).then((response)=>{
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
    }
}
