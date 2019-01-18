var express = require('express');
var router = express.Router();
var explore = require('../lib/explore.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Block Explorer Endpoint' });
});

router.post('/test', function(req, res, next) {
	console.log(req.body.test)
	res.json(req.body)
});

router.post('/ethflow', async function(req, res, next) {

	try{
		var output = await explore.getBlkInfo(req.body.from,req.body.to)
		res.json(output)
	}catch(error){
		next(error)
	}


});

module.exports = router;
