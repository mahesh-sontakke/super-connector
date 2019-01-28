let service = {};
service.init = function(){
    let scheduleUtils = require('../../utils/schedule');
    let db = require('../../database');
    let Contact = db.getCollection('contacts');
    let API_URLS = require('../../config/constants').API_URLS.ACTIVE_CAMPAIGN;
    service.syncData = function(callback){
        scheduleUtils.activeToDbSyncSchedule(service.getContacts);
        callback({success : true, message : 'Schedule Started !'});
    }
    service.getContacts = function(callback){
        let data = { url : API_URLS('contacts'), method : 'get', data : {}}
        utils.makeApiCall(data,function(err,res){
            if(!err){
                service.storeContacts(res.contacts);
                callback({success : true, data : res })
            }else
                // console.log('Request Error ', err)
                callback({success : false, error  : err })
        })
    }
    service.getContactsDB = function(callback){
        Contact.find().toArray().then(contacts =>{
            callback({success : true, data : contacts});
        }).catch(err =>{
            callback({success : false, error : err});
        })
    }
    service.storeContacts = function(contacts){
        for(let contact of contacts){
            contact.contactType = 'ActiveCampaign';
            Contact.updateOne({email : contact.email},{$set : contact},{upsert : true})
                .then(result => {
                    console.log( contact.email +' Contact Inserted!')
                }).catch(err => {
                    console.log( ' Error Contact!')
                })
        }
    }
}
module.exports = service;