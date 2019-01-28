var routes = require('express').Router();
const axios = require('axios');
var YanaduCtr = require(__baseDir + '/src/yanaduController/yanadu.ctrl');
var YanaduTask = require(__baseDir + '/src/yanaduController/yanadu.task');
routes.get('/getList', (req, res) => {
  YanaduCtr.getList().then((data) => {
    data = Object.values(data).filter((aEntry) => {
      if (typeof (aEntry) == "object") {
        return aEntry
      }
    });
    res.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    res.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
});
routes.get('/emailTask', (req, res) => {
  YanaduCtr.emailTask().then((data) => {
    data = Object.values(data).filter((aEntry) => {
      if (typeof (aEntry) == "object") {
        return aEntry
      }
    });
    res.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    res.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
});

routes.get('/getTask', (req, res) => {
  var id = req.query.id;
  YanaduCtr.getTask(id).then((data) => {
    res.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    res.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
});
routes.put('/updateTask', (req, res) => {
  var id = req.body.id;
  var data = req.body.data;
  YanaduCtr.updateTask(id, data).then((data) => {
    res.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    res.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
});

routes.post('/createTask', (req, resp) => {
  let data = req.body;
  YanaduCtr.createTask(data).then((data) => {
    return resp.send({
      success: true,
      ...data
    })
  }).catch((err) => {
    return resp.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
})

routes.get('/getStatuses', (req, resp) => {
  let id = req.query.id;
  YanaduCtr.getStatuses(id).then((data) => {
    data = Object.values(data).filter((aEntry) => {
      if (typeof (aEntry) == "object") {
        return aEntry
      }
    });

    return resp.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    return resp.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
})

routes.get('/getAllUser', (req, resp) => {
  YanaduCtr.getAllUser().then((data) => {
    data = Object.values(data).filter((aEntry) => {
      if (typeof (aEntry) == "object") {
        return aEntry
      }
    });

    return resp.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    return resp.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
})
routes.get('/getListContacts', (req, resp) => {
  var listid = req.query.id;
  if (!listid) {
    return res.send({
      success: false,
      error: "List Id Missing"
    });
  }
  YanaduCtr.getListContacts(listid).then((data) => {
    // var data1 = Object.values(data).filter((aEntr6y) => {
    //   if (typeof (aEntry) == "object") {
    //     return aEntry
    //   }
    // });
    return resp.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    return resp.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
})

routes.get('/mergeWithAc', (req, resp) => {
  YanaduCtr.mergeWithAc().then((data) => {
    return resp.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    return resp.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
})
routes.get('/taskToDeal', (req, resp) => {
  YanaduTask.mergetaskwithAc().then((data) => {
    return resp.send({
      success: true,
      data: data
    })
  }).catch((err) => {
    return resp.send({
      success: false,
      error: err.response ? err.response.data : err
    })
  })
})

module.exports = routes;