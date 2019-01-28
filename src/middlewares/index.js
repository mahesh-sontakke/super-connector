var multer = require('multer')
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

let middlewares = {};

var storage = multer.diskStorage(
    {
        destination: __baseDir + '/uploads',
        filename: function (req, file, cb) {
            var fileName = file.originalname.split('.')[0];
            var extenstion = '.' + file.originalname.split('.').pop();
            cb(null, fileName + '-' + Date.now() + extenstion);
        }
});
middlewares.upload = multer({ storage: storage });
middlewares.bodyParser = { json : bodyParser.json({limit: "200mb"}),encoded : bodyParser.urlencoded({limit: "200mb", extended: true, parameterLimit:50000})}
middlewares.cookieParser = require('cookie-parser')("asdfasdf");
middlewares.session = (db) => {
    return session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ db: db}),
        cookie: {
          maxAge: null
        }
      });
}
middlewares.cors = (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    };

module.exports = middlewares;