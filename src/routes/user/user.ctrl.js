const UserSrv = require('./user.srv');
const controller = {};

controller.getCurrentUser = (req, res) => {
    if (req.user) {
        return res.send({success:true,data:req.user});
    }
    else{
        return res.send({success:false,data:'/login'});
    }
};
controller.login = (req, res) => {
    const userData = { email :  req.body.email, password : password};
    UserSrv.login(userData,(result) => {
        res.json(result);
    })  
};
controller.register = (req,res) => {
    const userData = {
        name :  req.body.name,
        email : req.body.email,
        password : utils.createHash(req.body.password),
        role:'patient'
    }
    UserSrv.register(userData,(result) => {
        if(result.success)
            req.session.user = result.user;
        res.json(result);
    });
};
controller.logout = (req,res) => {
    UserSrv.logout(req,(result) => {
        res.json(result);
    })
};
module.exports = controller;
