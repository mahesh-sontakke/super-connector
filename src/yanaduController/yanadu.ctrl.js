const axios = require('axios');
var async = require('async');
const Database = require('../database');
var path = require('path');
var YanaduCtr = {};
var util = require('../utils');
let API_URLS = require('../config/constants').API_URLS.ACTIVE_CAMPAIGN;

YanaduCtr.mergeWithAc = (insertedId) => {
  
  return new Promise((resolve2, reject2) => {
    async.waterfall([
      (cb) => {
        YanaduCtr.getAllUser().then((data) => {
         cb(null, data)
        }).catch((err) => {
          cb(err)
        })
      },
      (data, cb) => {
        var idArr = data.map((aData) => aData.id);
        var yanaduContacts = Database.getCollection('yanaduContacts');
        var searchQ = {
          $and: [{
            id: {
              $in: idArr
            }
          }]
        }
        var projQ = {
          id: 1
        }
        yanaduContacts.find(searchQ, projQ).map((aDoc) => {return aDoc.id}).toArray((err, contactsid) => {
          if (err) {
            return cb(err)
          } else {
            let newEntry = [];
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              var isFound = false;
              for (let index2 = 0; index2 < contactsid.length; index2++) {
                const aContactId = contactsid[index2];
                if (element.id == aContactId) {
                  isFound = true;
                  break;
                }
              }
              if (!isFound) {
                data[index]['stored'] = true;
                data[index]['syncWithAc'] = false;
                newEntry.push(data[index]);
              }
            }
            cb(null, newEntry)
          }
        })
      },
      (newEntry, cb)=>{
        if(newEntry.length==0){
          return cb(null, null)
        }
        var yanaduContacts = Database.getCollection('yanaduContacts');
        yanaduContacts.insertMany(newEntry, function (error, result) {
          if (error) {
            cb(error)
          } else {
            cb(null, result)
          }
        })
      },
      (result, cb)=>{
        var yanaduContacts = Database.getCollection('yanaduContacts');
        var searchQ = {
          syncWithAc : false
        }
        yanaduContacts.aggregate([
          {
               $lookup:{
                   from:"yanaduContacts",
                   localField:"assigneeId",
                   foreignField:"",
                   as:""
               }
           }, 
       ])
        yanaduContacts.find(searchQ).toArray((error, data) =>{
          if (error) {
            cb(error)
          } else {
            cb(null, data)
          }
        })
      },
      (data,cb)=>{
        var idArr = [];
        Promise.each(data, (aData)=>{
          aData.first_name=aData.name;
          aData.field={};
          aData.field['id']=aData.id;
          let aData1 = { url : API_URLS('contacts'), method : 'post', data : aData}
          return util.activeCampAddContact(idArr,aData1)
        }).then((result, a, b ,c)=> {
          return cb(null, idArr)
        }).catch((err) =>{
          return cb(err)
        })
      },
      (result, cb1)=>{
      if(result.length == 0){
        return cb1(null,null)
      }
       var idArr=result.filter((aid)=>{
          if(aid.success){
            return aid;
          }
        });
        var yanaduContacts = Database.getCollection('yanaduContacts');
        var bulk = yanaduContacts.initializeUnorderedBulkOp();
        for (let index = 0; index < idArr.length; index++) {
          var element = idArr[index];
          var searchQ = {taskId:element.success};
          var updateQ={$set:{syncWithAc:true,acId:element.acId}}
          bulk.find( searchQ).update(updateQ);
        }
        bulk.execute((err, response)=>{
          if (err) {
            cb1(err);
          } else {
            cb1(null,response)
          }
        })
      }
    ], (err, finalData) => {
      if (err) {
        reject2(err)
      } else {
        resolve2({finalData, insertedId})
      }
    })
  })

}
YanaduCtr.getList = () => {
  return new Promise((resolve1, reject1) => {
    axios.get(' https://api.yanado.com/public-api/lists', {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve1(response.data);
    }).catch((error) => {
      reject1(error);
    });
  })
}
YanaduCtr.emailTask = () => {
  return new Promise((resolve1, reject1) => {
    axios.get(' https://api.yanado.com/public-api/email-tasks', {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve1(response.data);
    }).catch((error) => {
      reject1(error);
    });
  })
}

YanaduCtr.getTask = (id) => {
  return new Promise((resolve1, reject1) => {
    var subStr = id ? ('/' + id) : '';

    axios.get('https://api.yanado.com/public-api/tasks' + subStr, {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve1(response.data);
    }).catch((error) => {
      reject1(error);
    });
  })
}
YanaduCtr.updateTask = (id, data) => {
  return new Promise((resolve1, reject1) => {
    if (!id) {
      return reject1("No ID");
    }
    var subStr = id ? ('/' + id) : '';


    axios.put('https://api.yanado.com/public-api/tasks' + subStr, data, {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve1(response.data);
    }).catch((error) => {
      reject1(error);
    });
  })
}
YanaduCtr.createTask = (data) => {
  return new Promise((resolve2, reject2) => {
    axios.post(' https://api.yanado.com/public-api/tasks', data, {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve2(response.data);
    }).catch((error) => {
      reject2(error);
    });
  })
}
YanaduCtr.getStatuses = (id) => {
  return new Promise((resolve2, reject2) => {
    if (!id) {
      return reject1("Id is missing")
    };
    axios.get(' https://api.yanado.com/public-api/lists/' + id + '/statuses', {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve2(response.data);
    }).catch((error) => {
      reject2(error);
    });
  })
}
YanaduCtr.getAllUser = () => {
  return new Promise((resolve2, reject2) => {
    axios.get(' https://api.yanado.com/public-api/users', {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve2(response.data);
    }).catch((error) => {
      reject2(error);
    });
  })
}
YanaduCtr.getListContacts = (listid) => {
  return new Promise((resolve2, reject2) => {
    if (!listid) {
      return reject1("Id is missing")
    };
    // https://api.yanado.com/public-api/lists/project_51003_1548152817115/users
    axios.get(' https://api.yanado.com/public-api/lists/' + listid + '/users', {
      headers: {
        "X-API-Key": process.env.YanadoAPIKey
      }
    }).then((response) => {
      resolve2(response.data);
    }).catch((error) => {
      reject2(error);
    });
  })
}
module.exports = YanaduCtr;