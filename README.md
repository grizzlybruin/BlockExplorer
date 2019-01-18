# Simple Block Explorer

To return Eth flow of transactions within specified block range

## Setup
```
$ git clone
$ npm install
```


*optional for command line use - specificy network, rinkeby is default*
```
$ export NETWORK=ropsten
```


## Usage
**Command Line API**
```
$ npm run getData 3697030 3697031
```

**HTTP API**
*currently available for rinkeby*

```
$ npm start
```

endpoint: localhost:3000/blocks/ethflow

application/json request:
```
{"from":"3697030", "to":"3697031"}
```

## HTTP Response
```
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
    },
    "body": 
    	"{\"status\":\"success\",
    	\"data\":{
    		\"querytime\":\"2019-01-18T01:43:01.481Z\",
    		\"sumEth\":558811200000000000,
    		\"recievingAddr\":[{
    			\"addr\":\"0x7122Fea3a32276e6057ecE3Cb8BED764189b5e95\",
    			\"totalValue\":548811200000000000,
    			\"contract\":true},
    			{\"addr\":\"0x02149d40d255fCeaC54A3ee3899807B0539bad60\",
    			\"totalValue\":10000000000000000,\"contract\":true}],
    		\"sendingAddr\":[{
    			\"addr\":\"0x78645f454D4f3BB7ec20B04404f8cfD1c07f0699\",
    			\"totalValue\":152008100000000000,\"contract\":false},
    			{\"addr\":\"0xF41a0a9Fcd1DDA313642e69e1ea0FAD2DBbd9a9B\",
    			\"totalValue\":396803100000000000,
    			\"contract\":false},
    			{\"addr\":\"0xf8aE9941B21a446E7d654c8D84168Cc8443a7Fc3\",
    			\"totalValue\":10000000000000000,
    			\"contract\":false}],
    		\"countRecieving\":2,
    		\"countSending\":3}}"
}
```


### Performance Considerations
flattening initial block data <br/>
web3.BatchRequest() <br/>
cache <br/>

