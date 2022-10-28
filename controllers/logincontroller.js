const store = require("store2");

exports.setLocalstorage = (req,res,next) => {
    console.log(req.query);
    const hostname = req.query.plex;
    const port = 11443;
    const user = req.query.Id;
    const password = req.query.pass;
    const type = "basic";
    store.setAll({'hostname' : hostname, 'port' : port, 'user' : user, 'password' : password, 'type' : type});
    console.log(store.getAll());
    res.render('parameters', { title: 'Parameter Declaration',loggedIn:user});
}