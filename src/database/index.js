var mongodb = require('mongodb');
var utils = require('../utils');
var db = {};
let mainDb;

db.loadDB = function(callback) {
  var MongoClient = mongodb.MongoClient;
  var urlString = 'mongodb://shashank:password2019@ds113815.mlab.com:13815/heroku_lzd9dkpg'
  console.log(urlString);
  MongoClient.connect(urlString, async function(err, client) {
    if (err) {
      return;
    }
    let dbName = ((process.env.PROD_MODE === 'false')?'Dev_':'') + process.env.DB_NAME;
    mainDb = client.db(dbName);
    callback(mainDb);
  });
}

db.toObjectId = function(_id) {
  var objId = undefined;
  try {
    if (typeof(_id) == 'string')
      objId = new mongodb.ObjectID(_id);
    else {
      objId = _id;
    }
  } catch (e) {
    logger.error(e);
    logger.log("provided id : ", _id);
  } finally {
    return objId;
  }
}

db.getCollection = function(name) {
  return mainDb.collection(name);
};

db.getDB = function() {
  return mainDb;
}

module.exports = db;
