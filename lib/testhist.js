var explore = require('./explore.js');

//testhist(3697046,3697047)
//testhist(3697044,3697045)
//testhist(3697044,3697045)
//printqh(3697044,3697045)

run()

async function run(){

	await testhist(3697045,3697044)
	await testhist(3697046,3697047)
	console.log('######################')
}

async function testhist(from,to){
	var res = await explore.getBlkInfo(from,to)

	console.log(JSON.stringify(res))

}

