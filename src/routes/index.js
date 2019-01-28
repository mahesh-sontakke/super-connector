var routes = {};
const express = require('express');
const path = require('path');
const Auth = require("../auth");
const middlewares = require('../middlewares');

// routes.bindAll = function(){
//   this.bindMiddlewares();
//   this.setPermissions();
//   this.bindApi();
//   this.statics();
// }
routes.bindMiddlewares = function(db){
  app.use(middlewares.cors);
  app.use(middlewares.session(db));
  app.use(middlewares.bodyParser.json);
  app.use(middlewares.bodyParser.encoded);
  app.use(middlewares.cookieParser);
}
routes.setPermissions = function() {
 /*  var authenticateURLS = [
    '/dashboard/*',
    '/admin/*'
  ]
  app.all(authenticateURLS, Permissions.shouldBeAuthenticated);
  app.all('/api/checkUseCaseAccess', Permissions.checkUseCaseAccess);
  app.all('/api/fetchUseCases', Permissions.fetchUseCases); */
}
routes.bindApi = function() {
  app.use('/api', require('./user'));
  app.use('/ytoa', require('./contacts'));
  app.use('/datatable', require('./datatable'));
  app.use('/api', require('./active-campaign/active.api'));
}
routes.statics = function() {
  app.use("/", express.static(path.join(__baseDir,"frontend","screens")));
  app.use("/support", express.static(path.join(__baseDir,"frontend","support")));
}
routes.start = function(callback) {
  app.listen(process.env.APP_PORT, () => {
    console.log('Example app listening on port ' + process.env.APP_PORT)
    callback(true)
  });
  // app.emit( "app_started" )
}
module.exports = routes;