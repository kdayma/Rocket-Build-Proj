const Mainframe = require ('../services/mainframe')
const store = require("store2")

exports.getInfo = function(req, res, next) {
    const hostname = store('hostname');
    const port = store('port');
    const user = store('user');
    const password = store('password');
    const type = store('type');
    const mainframe = new Mainframe(hostname, port, user, password,type);
    const account = 'TS4866';
    const info = mainframe.getInfo(req);
    info.then(function(result) {
        if (result === undefined) {
            res.render('submitJob',{title:'Job submit Parameters', loggedIn:user, success:'Pred Member updated successfull'});
        }
        else {
            res.render('error',{title:'Error Occured', message:result, status:200});
        }
    }, function(err) {
        console.log(err);
    });
}