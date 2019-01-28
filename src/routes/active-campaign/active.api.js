var routes = require('express').Router();

const ActiveCtrl = require('./active.ctrl');
routes.get('/active/sync', ActiveCtrl.syncData);
routes.get('/active/fetch/contacts', ActiveCtrl.getContacts);
routes.get('/active/contacts', ActiveCtrl.getContactsDB);
module.exports = routes;
