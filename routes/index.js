var express = require('express');
var router = express.Router();
const path = require('path');
var paramController = require('../controllers/paramController');
var logincontroller = require('../controllers/logincontroller');
var submitJobController = require('../controllers/submitJobController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ITOM Instance Customizer' });
});

router.get('/login', logincontroller.setLocalstorage);

router.post('/params', paramController.getInfo);

router.get('/params/submitjced', submitJobController.getJobResult);

module.exports = router;
