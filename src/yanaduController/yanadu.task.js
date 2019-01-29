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
                        cb(null, yanaduData, data)
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
                        var isPolicy = false;
                        for (const key in yanaduData[index]) {
                            if (yanaduData[index].hasOwnProperty(key)) {
                                if (key.includes('policy') && yanaduData[index][key]) {
                                    isPolicy = true;
                                }
                            }
                        }
                        yanaduData[index].type = isPolicy ? 'policy' : 'task';
                        newData.push(yanaduData[index])
                    }
                }
                cb(null, newData)
            },
            (newData, cb) => {
                if (newData.length == 0) {
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
                        $unwind: {
                            path: "$activeCamp",
                            includeArrayIndex: ",",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                ]).toArray((err, allyanaduTaskEntry) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, allyanaduTaskEntry)
                    }
                })
            },
            (result, cb) => {
                var convertedData = [];
                try {
                    for (let index = 0; index < result.length; index++) {
                        const aDealData = result[index];
                        var aObj = {};
                        aObj.deal = {};
                        aObj.deal.contact = aDealData.activeCamp.acId;
                        aObj.deal.description = aDealData.description;
                        aObj.deal.currency = "usd";
                        aObj.deal.group = "3";
                        aObj.deal.owner = "1";
                        aObj.deal.taskId = aDealData.taskId;
                        aObj.deal.percent = null;
                        aObj.deal.title = aDealData.name;
                        aObj.deal.value = 1;
                        aObj.deal.type = aDealData.type;
                        convertedData.push(aObj);
                    }
                    cb(null, convertedData)
                } catch (error) {
                    return cb(error);
                }
            },
            (allyanaduTaskEntry, cb) => {
                var idArr = [];
                Promise.each(allyanaduTaskEntry, (aData) => {
                    return util.activeCampAddtask(idArr, aData);
                }).then((rest) => {
                    return cb(null, idArr)
                }).catch((err) => {
                    return cb(err)
                })
            },
            (result, cb1) => {
                var idArr = result.filter((aid) => {
                    if (aid.success) {
                        return aid;
                    }
                });
                if(idArr.length==0){return cb1(null,  null)}
                var yanaduTaskData = Database.getCollection('yanaduTaskData');
                var bulk = yanaduTaskData.initializeUnorderedBulkOp();
                for (let index = 0; index < idArr.length; index++) {
                    var element = idArr[index];
                    var searchQ = {
                        taskId: element.success
                    };
                    var updateQ = {
                        $set: {
                            syncWithAc: true,
                            acId: element.acId
                        }
                    }
                    bulk.find(searchQ).update(updateQ);
                }
                bulk.execute((err, response) => {
                    if (err) {
                        cb1(err);
                    } else {
                        cb1(null, response)
                    }
                })
            },
            (response, cb) => {
                var yanaduTaskData = Database.getCollection('yanaduTaskData');
                yanaduTaskData.find({
                    isDealTask: {
                        $ne: true
                    }
                }).toArray((err, data) => {
                    err ? cb(err) : cb(null, data);
                })
            },
            (data, cb) => {
                var idArr = [];
                Promise.each(data, (aData) => {
                    var obj = {
                        "dealTask": {
                            "reltype": "Subscriber",
                            "relid": aData.acId,
                            "status": "0",
                            "note": aData.description,
                            "dealTasktype": "5",
                            '_id':aData._id
                        }
                    }
                    var newDate = new Date();
                    newDate=new Date(newDate.setMonth(newDate.getMonth()+1)).toISOString();
                    obj.dealTask.duedate=aData.dueDate?new Date(aData.dueDate).toISOString():newDate;
                    return util.activeCampAddDealTask(idArr, obj);
                }).then((resp)=>{
                    cb(null, idArr);
                }).catch((err)=>{
                    cb(err)
                })
            },
            (idArr, cb)=>{
                var succedArr=idArr.filter((aField)=>{
                    if(aField.success){
                        return aField.success;
                    }
                })
                if(succedArr.length==0){
                    return cb(null, 'Nothing To Update');
                }
                var yanaduTaskData = Database.getCollection('yanaduTaskData');
                var bulk = yanaduTaskData.initializeUnorderedBulkOp();
                for (let index = 0; index < succedArr.length; index++) {
                    bulk.find({_id:succedArr[index].success}).update({$set:{isDealTask:true,dealTaskId:succedArr[index].acId}})
                }
                bulk.execute((err, resp)=>{
                    err?cb(err):cb(null, resp)
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