let controller = {}
let ActiveSrv = require('./active.srv');
controller.syncData = function(req,res){
    let obj = {};
    ActiveSrv.syncData(function(result) {
        res.json(result);
    })
}
controller.getContacts = function(req,res){
    ActiveSrv.getContacts(function(result){
        res.json(result)
    })
}
controller.getContactsDB = function(req,res){
    ActiveSrv.getContactsDB(function(result) {
        res.json(result);
    });
}

module.exports = controller;