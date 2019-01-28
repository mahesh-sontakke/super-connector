var request = require("request");
var Database = require('../database');
var async = require('async');
module.exports = {
  makeApiCall: function (apiData, callback) {

    var options = {
      method: apiData.method,
      url: apiData.url,
      headers: {
        'api-token': process.env.ACTIVE_CAMPAIGN_API_KEY,
        'content-type': 'application/json'
      },
      json: true
    }

    if (apiData.method === 'post') options.body = apiData.data;
    else options.sqs = apiData.data

    request(options, function (error, response, body) {
      if (error) callback(error, null);
      else
        callback(null, body);
    });
  },
  activeCampAddContact: function (idArr, apiData) {
    return new Promise((resolve1, reject1) => {
      var options = {
        method: apiData.method,
        url: process.env.ACTIVE_CAMPAIGN_API_DOMAIN + "/contacts",
        headers: {
          'api-token': process.env.ACTIVE_CAMPAIGN_API_KEY,
          'content-type': 'application/json'
        },
        json: true,
        body: {
          contact: apiData.data
        }
      }
      // if (apiData.method === 'post') options.body = apiData.data; else options.sqs = apiData.data
      request(options, function (error, response, body) {
        if (error) reject1(error);

        else {
          if (body.errors) {
            resolve1(body.errors);
          } else {
            var acId = body.contact ? body.contact.id : '';
            idArr.push({
              success: apiData.data.id,
              acId: acId
            })
            resolve1({
              success: apiData.data.id
            })
            // var yanaduContacts = Database.getCollection('yanaduContacts');
            // var updateQ={$set:{syncWithAc:true}}
            // body.contact?updateQ['$set']['acId']=body.contact.id:'';
            // yanaduContacts.findOneAndUpdate({id:apiData.data.id},updateQ, (err, data)=>{
            //   if (err) {
            //     reject1(err);
            //   } else {
            //     resolve1(data)
            //   }
            // })
          }
          // resolve1(body)
        }
      });
    })
  },
  
  activeCampAddtask: function (idArr, apiData) {
    var addDeal = ()=>{
      return new Promise((resolve3, reject3) => {
        var options = {
          method: 'post',
          url: process.env.ACTIVE_CAMPAIGN_API_DOMAIN + "/deals",
          headers: {
            'api-token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'content-type': 'application/json'
          },
          json: true,
          body: apiData
        }
        request(options, function (error, response, body) {
          console.log("error, response, body", error, response, body);
          if (error) reject3(error);
          else {
            if (body.errors) {
              resolve2(body.errors);
            } else {
              console.log(response, body);
  
              var acId = body.deal ? body.deal.id : '';
              idArr.push({
                success: apiData.deal.taskId,
                acId: acId
              })
              resolve3({
                success: body.deal,
                apiData
              })
            }
          }
        });
      })
    }
    var activeCampAddCustomField=(data)=>{
      return new Promise((resolve2, reject2) => {
        var options = {
          method: 'post',
          url: process.env.ACTIVE_CAMPAIGN_API_DOMAIN + "/dealCustomFieldData",
          headers: {
            'api-token': process.env.ACTIVE_CAMPAIGN_API_KEY,
            'content-type': 'application/json'
          },
          json: true,
          body: data
        }
        request(options, function (error, response, body) {
          if (error || body.error) {
            reject2(error?error:body.error)
          } else {
            resolve2(body)
          }
        })
      })
    }
    return new Promise((resolve11, reject11) => {
      async.waterfall([
        (cb)=>{
          addDeal().then((resp)=>{
            cb(null, resp)
          }).catch((err)=>{
            cb(null)
          })
        },
        (resp, cb)=>{
          var customFields = Database.getCollection('customFields');
          customFields.findOne({}, (err, data)=>{
            if (err) {
              cb(err)
            } else {
             cb(null,resp, data) 
            }
          })
        },
        (resp, data, cb3)=>{
          var obj= {
            "dealCustomFieldDatum": {
              "dealId": resp.success.id,
              "custom_field_id": data.acId,
              "fieldValue": resp.apiData.deal.type
            }
          };
          activeCampAddCustomField(obj).then((resp)=>{
            cb3(null, resp)
          }).catch((err)=>{
            cb3(err)
          })
        }
      ],(err, resp)=>{
        if (err) {
          reject11(err)
        } else {
          resolve11(resp)
        }
      })
    })
   
   
   
  },

  activeCampAddCustomField: function (idArr, apiData) {
    return new Promise((resolve1, reject1) => {
      var options = {
        method: 'post',
        url: process.env.ACTIVE_CAMPAIGN_API_DOMAIN + "/dealCustomFieldMeta",
        headers: {
          'api-token': process.env.ACTIVE_CAMPAIGN_API_KEY,
          'content-type': 'application/json'
        },
        json: true,
        body: apiData
      }
      request(options, function (error, response, body) {
        console.log("error, response, body", error, response, body);
        if (error) reject1(error);
        else {
          if (body.errors) {
            resolve1(body.errors);
          } else {
            console.log(response, body);

            var acId = body.dealCustomFieldMetum ? body.dealCustomFieldMetum.id : '';
            var obj=apiData.dealCustomFieldMetum;
            obj.acId= acId;
            idArr.push(obj)
            resolve1(obj)
          }
        }
      });
    })
  }

}