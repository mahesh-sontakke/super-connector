var routes = require('express').Router();
var DatatableService = require('./datatable.serv');
routes.get('/contacts', (req,res)=>{
    var ajax_data = req.query;
    DatatableService.contacts(ajax_data).then((data)=>{
        data.draw=Number(req.body.draw);
        data.success=true;
        return res.send(data)
    }).catch((err)=>{
        res.send({
            success: false,
            data: err
          })
    })
})
routes.get('/deals', (req,res)=>{
    var ajax_data = req.query;
    DatatableService.deals(ajax_data).then((data)=>{
        data.draw=Number(req.body.draw);
        data.success=true;
        return res.send(data)
    }).catch((err)=>{
        res.send({
            success: false,
            data: err
          })
    })
})
module.exports = routes;