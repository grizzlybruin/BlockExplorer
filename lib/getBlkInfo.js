var explore = require('./explore.js');

if (process.argv.length < 4) {
    console.log("Please enter from and to arguments");
}else if(process.argv.length > 4){
	console.log("Too many arguments, please enter only from and to");
}else{
	run(process.argv[2],process.argv[3])
}

async function run(from,to){

	var res =await explore.getBlkInfo(from,to)
	console.log("Response Data")
	for(data in res){
		console.log(data+": "+JSON.stringify(res[data]))
	}
	return res

}
