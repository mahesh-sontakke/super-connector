global.__baseDir = __dirname;
require('dotenv').config({path: __baseDir + '/.env'});
const express = require('express')
global.app = express(); // ?
global.permit = require('./src/permissions');
global.utils = require('./src/utils');
global.Crons = require('./src/crons/crons');
global.Promise = require("bluebird");
var YanadUdefault =require('./src/yanaduController/yanadu.default');
global.enableCluster = process.env.ENABLECLUSTER;
enableCluster = false; 
if (enableCluster) {
    var cluster = require('cluster');
    var workers = process.env.WORKERS || require('os').cpus().length;
    if (cluster.isMaster) {
        console.log('start cluster with %s workers', workers);
        for (var i = 0; i < workers; ++i) {
            var worker = cluster.fork().process;
            console.log('worker %s started.', worker.pid);
        }
        cluster.on('exit', function (worker) {
            console.log('worker %s died. restart...', worker.process.pid);
            cluster.fork();
        });
    } else {
        executeServerCode()
    }
} else {
    executeServerCode();
}

function executeServerCode(){
  global.logger = require('tracer').colorConsole({level: 'log'});
  var Database = require('./src/database');
  var Routes = require('./src/routes');
  let Schedules = require('./src/utils/schedule')

  Database.loadDB(function(db) {
    Crons.startCron();
    Routes.bindMiddlewares(db);
    Routes.setPermissions();
    Routes.bindApi();
    Routes.statics();
    Routes.start(function(result){
        Schedules.startSchedules();
    });
    YanadUdefault.insertDefault().then((res)=>{}).catch((err)=>{console.error("custom fields error",err);})
  });
}

if(process.env.TESTING){
    // module.exports = global.app;
    console.log('Testing Mode');
}

module.exports = app;