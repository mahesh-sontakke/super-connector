var routes = require('express').Router();

const QQCtrl = require('./qq.ctrl');
routes.get('/qq/sync', QQCtrl.syncData);
routes.get('/qq/fetch/contacts', QQCtrl.getContacts);
routes.get('/qq/contacts', QQCtrl.getContactsDB);
module.exports = routes;
