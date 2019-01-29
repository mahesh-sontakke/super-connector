let controller = {}
let QQSrv = require('./qq.srv');
controller.syncData = function(req,res){
    let obj = {};
    QQSrv.syncData(function(result) {
        res.json(result);
    })
}
controller.getContacts = function(req,res){
    QQSrv.getContacts(function(result){
        res.json(result)
    })
}
controller.getContactsDB = function(req,res){
    QQSrv.getContactsDB(function(result) {
        res.json(result);
    });
}

module.exports = controller;
