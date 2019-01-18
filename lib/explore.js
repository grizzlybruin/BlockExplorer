Web3 = require('web3')
_ = require('lodash')

//set Network
if (process.env.NETWORK) {
  var NETWORK = process.env.NETWORK;
}else{
	var NETWORK = 'rinkeby'
}

console.log("network: "+NETWORK)

web3 = new Web3(new Web3.providers.HttpProvider("https://"+NETWORK+".infura.io/"));

//ToDo: possible graphql db or inmemory query storage
//ToDo: batch request


//read blocks once for performance
let blocks;

async function getBlkInfo(from,to){

	//check blocks aren't greater than max block in network
	//confirms correct inputed order
	try{
	var querykey = await checkKey(from,to)
	}catch(error){
		console.log(error.message)
		throw error
	}

	//get blocks within specified range
	try{
		blocks = await mergeBlks(querykey.from,querykey.to)
	}catch(err){
			return err
	}

	let resp = {};
		
	resp['querytime'] = new Date();
	resp['sumEth'] = await getBlksTxsValueSum(blocks.transactions,querykey.from,querykey.to)
	resp['recievingAddr'] = await getBlksTxsValueTo(blocks.transactions,querykey.from, querykey.to)
	resp['sendingAddr'] = await getBlksTxsValueFrom(blocks.transactions,querykey.from, querykey.to)
	//console.log("is array"+Array.isArray(resp['recievingAddr']))
	resp['countRecieving'] = await resp['recievingAddr'].length
	resp['countSending'] = await resp['sendingAddr'].length

	return resp
	
}


async function getBlksTxsValueSum(blocks,from,to){

	var sumEth = 0;

	for(tx in blocks){
		sumEth = sumEth + parseInt(blocks[tx].value)
	}

	return sumEth
}

async function getBlksTxsCountFrom(data){
	var countFrom = await _.countBy(data, 'addr')
	return countFrom
}


async function getBlksTxsCountTo(data){

	var countTo = await _.countBy(data, 'addr')
	return countTo
}



async function getBlksTxsValueTo(blocks,from,to){

	//aggregate Eth value by address
	var groupby = await  _.groupBy(blocks, 'to')
	var mapped = await _.map(groupby, (objs, key) => ({
        'addr': key,
        'totalValue': _.sumBy(objs, function(o) { return parseInt(o.value,10) })
        }))

	//remove transactions where no eth value is exchanged
	var filtered = _.filter(mapped, function(o) { return o.totalValue > 0 })

	//if true address is an account, if false address is a contract
   	for(tx in filtered){
		//console.log("tx: "+tx+" "+JSON.stringify(filtered[tx]))
		filtered[tx].contract = await web3.eth.getCode(filtered[tx].addr) != ('0x'||'0x0')
	}

	return filtered
}

async function getBlksTxsValueFrom(blocks,from,to){

	//aggregate Eth value by address
	var groupby = await  _.groupBy(blocks, 'from')
	var mapped = await _.map(groupby, (objs, key) => ({
        'addr': key,
        'totalValue': _.sumBy(objs, function(o) { return parseInt(o.value,10) })
        }))

	//remove transactions where no eth value is exchanged
	var filtered = _.filter(mapped, function(o) { return o.totalValue > 0 })

	//if true address is an account, if false address is a contract
   	for(tx in filtered){
		//console.log("tx: "+tx+" "+JSON.stringify(filtered[tx]))
		filtered[tx].contract = await web3.eth.getCode(filtered[tx].addr) != ('0x'||'0x0')
	}

	return filtered
}

async function mergeBlks(from,to){
	console.log("merging blocks from: "+from+" to: "+to)
	let merged;

	//concatenate merged blocks
	function customizer(objValue, srcValue) {
	  if (_.isArray(objValue)) {
	    return objValue.concat(srcValue);
	  }
	}
	
	for(var i = from; i <= to; i++){
		var txs = await web3.eth.getBlock(i,true)
		console.log("merging block: "+i)
		merged = await _.mergeWith(merged,txs,customizer)
	}

	return merged;
}

async function getLatestBlk(){

	try{
	var blknum = await web3.eth.getBlockNumber()
	return blknum
	}catch(err){
		return err
	}

}

async function checkKey(from,to){
	var blknum = await web3.eth.getBlockNumber()
	if(to>blknum || from>blknum){
		throw new Error("range {"+from+ " : "+to+"} larger than max existing block, "+blknum)
	}

	if(from > to){
		return {'from': to, 'to' : from}
	}else{
		return {'from': from, 'to' : to}
	}
}

module.exports = { 
  getBlkInfo: getBlkInfo,
  getLatestBlk: getLatestBlk
}

