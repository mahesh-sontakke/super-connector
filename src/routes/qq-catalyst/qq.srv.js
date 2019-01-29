let service = {};
service.init = function(){
    service.accessUser = null;
    service.axios_instance = null;
    console.log("qq srv called");
    var ClientOAuth2 = require('client-oauth2')
    var axios = require('axios')

    var qqAuth = new ClientOAuth2({
      clientId: process.env.QQ_CATALYST_CLIENT_ID,
      clientSecret: process.env.QQ_CATALYST_CLIENT_SECRET,
      accessTokenUri: 'https://login.qqcatalyst.com/oauth/token',
      authorizationUri: 'https://login.qqcatalyst.com/oauth/authorize',
      redirectUri: process.env.QQ_CATALYST_CALLBACKURL
    })
    var storeNewToken = function (token) {
      console.log('at refresh token');
      // console.log(service.accessUser);
    }
    qqAuth.owner.getToken(process.env.QQ_CATALYST_USERNAME, process.env.QQ_CATALYST_PASSWORD)
    .then(function (user) {
      service.accessUser = user;
      console.log('at get token');

      // console.log("service.accessUser.accessToken ", service.accessUser.accessToken );
      service.axios_instance = axios.create({
        baseURL: 'http://api.qqcatalyst.com/',
        datatype: "application/json",
        // timeout: 1000,
        headers: {'Authorization': service.accessUser.accessToken}
      });


      // var credentials = Database.getCollection('credentials');
      // var data = { accessToken: user.accessToken, refreshToken: user.refreshToken }
      // var data2 = { accessToken: user.accessToken, refreshToken: user.refreshToken }
      // console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }

      // user.refresh().then(storeNewToken)
    })

    let scheduleUtils = require('../../utils/schedule');
    // let db = require('../../database');
    service.getContacts = function (callback) {
      service.axios_instance.get('v1/Contacts/LastModifiedCreated').then(function (emailResponse) {
        // console.log("response \n\n\n\n\n ", response );
        // service.axios_instance.get('v1/Search/Policies').then(function (customerResponse) {
          // v1/Search/PolicyQuoteList/{customer_id}
        // service.axios_instance.get('v1/Lookups/ContactInfoTypes').then(function (response3) {
        // v1/Search/Policies
        // v1/Customers/19/CustomerDetailSummary
        // v1/Contacts/19/Emails
        // v1/Search/Customers/BasicSearch
        // v1/Search/Policies

        console.log("At response" );
        // var data = {
        //   name: customerResponse.DisplayName,
        //   email: emailResponse.EmailAddress,
        //   phone: "",
        //   address: emailResponse.EmailAddress,
        //
        //   // name: "",
        //   // name: "",
        //   // name: "",
        //   // name: "",
        // }
        var customerResponse = {}
        callback({success: true, data: emailResponse.data, data2: customerResponse.data})
      }, function (error) {
        console.log("Aterror " );
        for (var variable in error) {
          if (error.hasOwnProperty(variable)) {
            console.log("variable ", variable );

          }
        }
        callback({success: false, data:error.response.data.Message})

      // })
    // })
    })


    }
    // let Contact = db.getCollection('contacts');
    // let API_URLS = require('../../config/constants').API_URLS.ACTIVE_CAMPAIGN;
    // service.syncData = function(callback){
    //     scheduleUtils.activeToDbSyncSchedule(service.getContacts);
    //     callback({success : true, message : 'Schedule Started !'});
    // }
    // service.getContacts = function(callback){
    //     let data = { url : API_URLS('contacts'), method : 'get', data : {}}
    //     utils.makeApiCall(data,function(err,res){
    //         if(!err){
    //             service.storeContacts(res.contacts);
    //             callback({success : true, data : res })
    //         }else
    //             // console.log('Request Error ', err)
    //             callback({success : false, error  : err })
    //     })
    // }
    service.getContactsDB = function(callback){
      service.axios_instance.get('v1/Contacts/LastModifiedCreated').then(function (response) {
        // console.log("response \n\n\n\n\n ", response );
        console.log("At response" );
        console.log("response ", response );
        callback({success: true, data: response.data})
      }, function (error) {
        console.log("Aterror " );
        callback({success: false, data:error.data})

      })
    }
    // service.storeContacts = function(contacts){
    //     for(let contact of contacts){
    //         contact.contactType = 'ActiveCampaign';
    //         Contact.updateOne({email : contact.email},{$set : contact},{upsert : true})
    //             .then(result => {
    //                 console.log( contact.email +' Contact Inserted!')
    //             }).catch(err => {
    //                 console.log( ' Error Contact!')
    //             })
    //     }
    // }
}
module.exports = service;
