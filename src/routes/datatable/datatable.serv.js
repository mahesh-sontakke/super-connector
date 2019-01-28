var async = require('async');
var Database = require('../../database');
var DatatableService = {};
DatatableService.contacts = (ajaxData) => {
    var filteredSQ = {
        $or: [{
            "email": new RegExp("^" + ajaxData.search ? ajaxData.search.value.toLowerCase() : '', "i")
        }, {
            "name": new RegExp("^" + ajaxData.search ? ajaxData.search.value.toLowerCase() : '', "i")
        }]
    }
    var sortQ={};
    var colNo=parseInt(ajaxData.order[0]['column']);
    var dir=ajaxData.order[0]['dir'];
    var fieldName = ajaxData['columns'][colNo]['data'];
    sortQ[fieldName]=dir=="asc"?1:-1;
    var getTotalCount = () => {
        return new Promise((resolve2, reject2) => {
            var yanaduContacts = Database.getCollection('yanaduContacts');
            yanaduContacts.count({}, (err, counts) => {
                err ? reject2(err) : resolve2(counts)
            })
        })
    }
    var getFilterCount = () => {
        return new Promise((resolve2, reject2) => {
            var yanaduContacts = Database.getCollection('yanaduContacts');
            yanaduContacts.count(filteredSQ, (err, counts) => {
                err ? reject2(err) : resolve2(counts)
            })
        })
    }
    var getFilterData = () => {
        var start = 0;
        var length = 10;
        if (!ajaxData.start) {
            start = 0;
        } else {
            start = parseInt(ajaxData.start);
        }
        if (!ajaxData.length) {
            length = 10;
        } else {
            length = parseInt(ajaxData.length);
        }
        return new Promise((resolve2, reject2) => {
            var yanaduContacts = Database.getCollection('yanaduContacts');
            yanaduContacts.find(filteredSQ).sort(sortQ).skip(start).limit(length).toArray((err, data) => {
                err ? reject2(err) : resolve2(data)
            })
        })
    }
    return new Promise((resolve1, reject1) => {
        var finalObj = {};
        async.waterfall([
            (cb) => {
                getTotalCount().then((data) => {
                    finalObj.recordsTotal = data;
                    cb(null, finalObj)
                }).catch((err) => {
                    cb(err)
                })
            },
            (finalObj, cb) => {
                getFilterCount().then((data) => {
                    finalObj.recordsFiltered = data;
                    cb(null, finalObj)
                }).catch((err) => {
                    cb(err)
                })
            },
            (finalObj, cb) => {
                getFilterData().then((data) => {
                    finalObj.data = data;
                    cb(null, finalObj)
                }).catch((err) => {
                    cb(err)
                })
            }
        ], (err, data) => {
            err ? reject1(err) : resolve1(data)
        })
    })

}

DatatableService.deals = (ajaxData) => {
    var filteredSQ = {
        $or: [{
            "taskId": new RegExp("^" + ajaxData.search ? ajaxData.search.value.toLowerCase() : '', "i")
        }, {
            "assigneeName": new RegExp("^" + ajaxData.search ? ajaxData.search.value.toLowerCase() : '', "i")
        }, {
            "name": new RegExp("^" + ajaxData.search ? ajaxData.search.value.toLowerCase() : '', "i")
        }]
    }
    var sortQ={};
    var colNo=parseInt(ajaxData.order[0]['column']);
    var dir=ajaxData.order[0]['dir'];
    var fieldName = ajaxData['columns'][colNo]['data'];
    sortQ[fieldName]=dir=="asc"?1:-1;
    var getTotalCount = () => {
        return new Promise((resolve2, reject2) => {
            var yanaduTaskData = Database.getCollection('yanaduTaskData');
            yanaduTaskData.count({}, (err, counts) => {
                err ? reject2(err) : resolve2(counts)
            })
        })
    }
    var getFilterCount = () => {
        return new Promise((resolve2, reject2) => {
            var yanaduTaskData = Database.getCollection('yanaduTaskData');
            yanaduTaskData.count(filteredSQ, (err, counts) => {
                err ? reject2(err) : resolve2(counts)
            })
        })
    }
    var getFilterData = () => {
        var start = 0;
        var length = 10;
        if (!ajaxData.start) {
            start = 0;
        } else {
            start = parseInt(ajaxData.start);
        }
        if (!ajaxData.length) {
            length = 10;
        } else {
            length = parseInt(ajaxData.length);
        }
        return new Promise((resolve2, reject2) => {
            var yanaduTaskData = Database.getCollection('yanaduTaskData');
            yanaduTaskData.find(filteredSQ).sort(sortQ).skip(start).limit(length).toArray((err, data) => {
                err ? reject2(err) : resolve2(data)
            })
        })
    }
    return new Promise((resolve1, reject1) => {
        var finalObj = {};
        async.waterfall([
            (cb) => {
                getTotalCount().then((data) => {
                    finalObj.recordsTotal = data;
                    cb(null, finalObj)
                }).catch((err) => {
                    cb(err)
                })
            },
            (finalObj, cb) => {
                getFilterCount().then((data) => {
                    finalObj.recordsFiltered = data;
                    cb(null, finalObj)
                }).catch((err) => {
                    cb(err)
                })
            },
            (finalObj, cb) => {
                getFilterData().then((data) => {
                    finalObj.data = data;
                    cb(null, finalObj)
                }).catch((err) => {
                    cb(err)
                })
            }
        ], (err, data) => {
            err ? reject1(err) : resolve1(data)
        })
    })

}

module.exports = DatatableService;