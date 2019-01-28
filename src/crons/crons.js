var Crons = {};
var YanaduCtr = require('../yanaduController/yanadu.ctrl');
var YanaduTask = require('../yanaduController/yanadu.task');
var Database = require('../database')
var schedule = require('node-schedule');
var async = require('async');
Crons.startCron = ()=>{
    return new Promise((cronResolve, cronReject) => {
        var contacts = schedule.scheduleJob('*/2 * * * *',()=>{
            var cronsList = Database.getCollection('cronsList');
            var insertNewCron = ()=>{
                return new Promise((newCronResolve, newCronreject) => {
                    var insertQ = {
                        task: 'yanaduToAC',
                        startAt : new Date(),
                        startBy : 'system',
                        status:'started'
                    }
                    cronsList.insertOne(insertQ,(err, data)=>{
                        err?newCronreject(err):newCronResolve(data.insertedId)
                    })
                })
            }
            var startCronProcess = (insertedId)=>{
                return new Promise((newCronResolve, newCronreject) => {
                    YanaduCtr.mergeWithAc(insertedId).then((data)=>{
                        newCronResolve(data.insertedId);
                    }).catch((err)=>{
                        newCronreject(err)
                    })
                })
            }
            var updateCronList = (insertedId, status, error)=>{
                return new Promise((newCronResolve, newCronreject) => {
                    var updateQ = {
                        finishAt :new Date(),
                        status : status,
                    }
                    error?updateQ['error']=error:'';
                    cronsList.updateOne({_id:insertedId},{$set:updateQ},(err, resp)=>{
                        err?newCronreject(err):newCronResolve(resp);
                    })
                })
            }
            async.waterfall([
                (cb)=>{
                    insertNewCron().then((insertedId)=>{
                        cb(null,insertedId)
                    }).catch((err)=>{
                        cb(err)
                    })
                },
                (insertedId,cb)=>{
                    startCronProcess(insertedId).then((insertedId) => {
                       cb(null,insertedId)
                    }).catch((err)=>{
                        cb(err)
                    })
                }
                // (insertedId, cb)=>{
                   
                //     cronsList.updateOne({_id:insertedId},{$set:updateQ}, (err, resp)=>{
                //         if (err) {
                //             cb(err);
                //         } else {
                //             cb(null, resp);
                //         }
                //     })
                // }
            ],(err,insertedId)=>{
                if (err) {
                    updateCronList(insertedId, 'failed', err).then((resp)=>{
                        cronReject(resp);
                    }).catch((err)=>{
                        cronReject(err);
                    })
                } else {
                    updateCronList(insertedId, 'finished').then((resp)=>{
                        cronResolve(resp)
                    }).catch((err)=>{
                        cronReject(err);
                    })
                }
            })
        })
    })
    
}


module.exports = Crons;