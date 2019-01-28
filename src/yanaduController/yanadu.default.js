const axios = require('axios');
var async = require('async');
const Database = require('../database');
var path = require('path');
var YanadUdefault = {};
var util = require('../utils');

var customFieldsArr = ['type'];
YanadUdefault.insertDefault = () => {
    return new Promise((resolve2, reject2) => {
        var customFields = Database.getCollection('customFields');
        async.waterfall([
            (cb) => {
                customFields.find({
                    field_label: {
                        $in: customFieldsArr
                    }
                }, {
                    field_label: 1
                }).map((aData) => {
                    return aData.field_label
                }).toArray((err, data) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, data)
                    }
                })
            },
            (data, cb) => {
                var newCustField = data.filter((aField) => {
                    return customFieldsArr.indexOf(aField) < 0
                });
                if(newCustField.length==0){
                    return cb(null, [])
                }
                var idArr = [];
                Promise.each(newCustField, (aData) => {
                    var aObj = {
                        "dealCustomFieldMetum": {
                            "field_label": aData,
                            "field_type": "text",
                            "field_default": "",
                            "is_form_visible": 1,
                            "is_required": 0,
                            "display_order": 1
                        }
                    }
                    return util.activeCampAddCustomField(idArr, aObj);
                }).then((resp) => {
                   return cb(null, idArr);
                }).catch((err) => {
                    return cb(err);
                })
            },
            (data, cb)=>{
                if(data.length==0){
                    return cb(null, null)
                }
                customFields.insertMany(data, (err, resp) => {
                    return err?cb(err):cb(null, resp)
                })
            }
        ], (err, resp) => {
            err?reject2(err):resolve2(resp);
        })
    })
}
module.exports = YanadUdefault;