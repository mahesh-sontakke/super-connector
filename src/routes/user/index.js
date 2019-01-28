var routes = require('express').Router();
const UserCtrl = require('./user.ctrl');
routes.get('/logs', function(req, res) {
    return res.send("6");
});
routes.get('/getCurrentUser', UserCtrl.getCurrentUser);
routes.post('/login',UserCtrl.login);
routes.post('/register', UserCtrl.register);
routes.get('/logout', UserCtrl.logout);

module.exports = routes;
