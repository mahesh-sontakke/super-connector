var router = require('express').Router();
const db = require('../../database');
const User = db.getCollection('users');
let service = {};

service.login = (userData,cb) => {
    userData.password = utils.createHash(userData.password);
    if(userData.email && userData.password){
        User.findOne({email : userData.email})
        .then(user => {
            if(user){
                if(user.password === userData.password){
                    req.session.user = user;
                    cb({success : true, user : { email : user.email, name : user.name}});
                }else
                    cb({success : false, error : 'Password is Invalid!'});
            }else{
                cb({success : false, error : 'Email is not found!'});
            }
        }).catch(err => {
            cb({success : false, error : 'Database Error : ' + err});
        })     
    }else{
        cb({success : false, error : 'Email And Password is required!'});
    }
    
}

service.register = (userData) => {
    isEmailExists(userData.email)
        .then((exists) => {
           if(!exists){
                User.insertOne(userData).then(user => {
                    cb({success : true, user : user})
                }).catch(err => {
                    cb({success : false, error : err});
                })
           }else{
                cb({success : false, error : 'Email ID Already Exists!'});
           }
        })
        .catch(err => {
            cb({success : false, error : err});
        })
}

service.logout = (req,cb) => {
    if(req.session.user){
       delete req.session.user;
       cb({success : true});
    }else{
       cb({success : false, error : 'Error While Logouting ..'})
    }
}
module.exports = service;
