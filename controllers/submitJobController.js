const Mainframe = require ('../services/mainframe')
const store = require("store2")

exports.getJobResult = function(req, res, next) {
    const hostname = store('hostname');
    const port = store('port');
    const user = store('user');
    const password = store('password');
    const type = store('type');
    const mainframe = new Mainframe(hostname, port, user, password,type);
    const account = 'TS4866';
    const info = mainframe.getJobResult();
    info.then(function(result) {
        if (result.search("RC=0008") === -1 && result.search("COND CODE 0008") === -1){
            res.render('jobResult',{title: 'jobResult',success:'Host Instance created successfully',loggedIn:user, spoolContent : result});
        }
        else {
            res.render('jobResult',{title: 'jobResult',success:'Instance not created',loggedIn:user, spoolContent : result});
        }
    }, function(err) {
        console.log(err);
    });
}