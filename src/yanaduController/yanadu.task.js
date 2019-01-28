const axios = require('axios');
var async = require('async');
const Database = require('../database');
var path = require('path');
var YanaduTask = {};
var util = require('../utils');
let API_URLS = require('../config/constants').API_URLS.ACTIVE_CAMPAIGN;
var YanaduCtr = require('./yanadu.ctrl');
YanaduTask.mergetaskwithAc = () => {
    return new Promise((resolve2, reject2) => {
        async.waterfall([
            (cb) => {
                YanaduCtr.getTask().then((data) => {
                    cb(null, data)
                }).catch((err) => {
                    cb(err)
                })
            },
            (yanaduData, cb) => {
                var yanaduTaskArr = yanaduData.map((aData) => {
                    return aData.taskId;
                });
                var yanaduTaskData = Database.getCollection('yanaduTaskData');
                yanaduTaskData.find({
                    taskId: {
                        $in: yanaduTaskArr
                    }
                }, {
                    taskId: 1
                }).toArray((err, data) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null,yanaduData,  data)
                    }
                })
            },
            (yanaduData, data, cb) => {
                
                var newData = [];
                for (let index = 0; index < yanaduData.length; index++) {
                    const element = yanaduData[index];
                    var isFound = false;
                    for (let index2 = 0; index2 < data.length; index2++) {
                        const element2 = data[index2];
                        if (element.taskId == element2.taskId) {
                            isFound = true;
                            break;
                        }
                    }
                    if (!isFound) {
                        yanaduData[index].syncWithAc = false;
                        var isPolicy=false;
                        for (const key in yanaduData[index]) {
                            if (yanaduData[index].hasOwnProperty(key)) {
                                if(key.includes('policy') && yanaduData[index][key]){
                                    isPolicy=true;
                                }
                            }
                        }
                        yanaduData[index].type=isPolicy?'policy':'task';
                        newData.push(yanaduData[index])
                    }
                }
                cb(null, newData)
            },
            (newData, cb) => {
                if(newData.length==0){
                    return cb(null, null)
                }
                var yanaduTaskData = Database.getCollection('yanaduTaskData');
                yanaduTaskData.insertMany(newData, (err, result) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, result)
                    }
                })
            },
            (result, cb) => {
                var yanaduTaskData = Database.getCollection('yanaduTaskData');
                yanaduTaskData.aggregate([
    
                    {
                        $match: {
                            syncWithAc: false
                        }
                    },
                    {
                        $lookup: {
                            from: "yanaduContacts",
                            localField: "assigneeId",
                            foreignField: "id",
                            as: "activeCamp"
                        }
                    },
                    {
                        $unwind:{
                            path:"$activeCamp",
                            includeArrayIndex:",",
                            preserveNullAndEmptyArrays:true
                        }
                    },
                ]).toArray((err, allyanaduTaskEntry) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null,allyanaduTaskEntry)
                    }
                })
            },
            (result , cb)=>{
                var convertedData = [];
                try {
                    for (let index = 0; index < result.length; index++) {
                        const aDealData = result[index];
                        var aObj={};
                        aObj.deal={};
                        aObj.deal.contact=aDealData.activeCamp.acId;
                        aObj.deal.description=aDealData.description;
                        aObj.deal.currency="usd";
                        aObj.deal.group="3";
                        aObj.deal.owner="1";
                        aObj.deal.taskId=aDealData.taskId;
                        aObj.deal.percent=null;
                        aObj.deal.title=aDealData.name;
                        aObj.deal.value=1;
                        aObj.deal.type=aDealData.type;
                        convertedData.push(aObj);
                    }
                    cb(null, convertedData)
                } catch (error) {
                    return cb(error);
                }
            },
            (allyanaduTaskEntry, cb) => {
                var idArr=[];
                Promise.each(allyanaduTaskEntry, (aData) => {
                   return util.activeCampAddtask(idArr,aData);
                }).then((rest)=>{
                    return cb(null, idArr)
                }).catch((err)=>{
                    return cb(err)
                })
            },
            (result, cb1)=>{
                var idArr=result.filter((aid)=>{
                   if(aid.success){
                     return aid;
                   }
                 });
                 var yanaduTaskData = Database.getCollection('yanaduTaskData');
                 var bulk = yanaduTaskData.initializeUnorderedBulkOp();
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
        ], (err, response) => {
            if (err) {
                reject2(err)
            } else {
                resolve2(response);
            }
        })
    })
    
}





module.exports = YanaduTask;