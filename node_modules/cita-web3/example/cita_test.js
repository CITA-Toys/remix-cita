const fs = require('fs');
const solc = require('solc');
const Web3 = require('../lib/web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:1337"));

const input = fs.readFileSync('SimpleStorage.sol');
const output = solc.compile(input.toString(), 1);
// console.log("compile output: " + JSON.stringify(output));
const contractData = output.contracts[':SimpleStorage'];   // 规则：冒号+contract名称，并非文件名
const bytecode = contractData.bytecode;   
const abi = JSON.parse(contractData.interface);
const contract = web3.eth.contract(abi);

var validUntilBlock = 0;
const privkey = '352416e1c910e413768c51390dfd791b414212b7b4fe6b1a18f58007fa894214';
const quota = 999999;
const from = '0dbd369a741319fa5107733e2c9db9929093e3c7';

/*************************************初始化完成***************************************/ 
citaTest();
startDeploy();

// get current block number
async function startDeploy() {
    web3.eth.getBlockNumber(function(err, res){
        if (!err) {
            validUntilBlock = res + 88;
            deployContract();
        }
    });
}

// 部署合约
async function deployContract() {
    contract.new({
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        data: bytecode,
        validUntilBlock: validUntilBlock,
        from: from
    }, (err, contract) => {
        if(err) {
            throw new error("contract deploy error: " + err);
            return;
            // callback fires twice, we only want the second call when the contract is deployed
        } else if(contract.address){
            myContract = contract;
            console.log('address: ' + myContract.address);
            callMethodContract();
        }
    })
}


/**
 * 智能合约单元测试
 */
function callMethodContract() {
    var result =  myContract.set(5, {
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        validUntilBlock: validUntilBlock,
        from: from
    });
    console.log("set method result: " + JSON.stringify(result));

    // wait for receipt
    var count = 0;
    var filter = web3.eth.filter('latest', function(err){
        if (!err) {
            count++;
            if (count > 20) {
                filter.stopWatching(function() {});
            } else {
                web3.eth.getTransactionReceipt(result.hash, function(e, receipt){
                    if(receipt) {
                        filter.stopWatching(function() {});
                        const result = myContract.get.call();
                        console.log("get method result: " + JSON.stringify(result));
                    }
                });

                web3.eth.getTransaction(result.hash, function(err, res) {
                    if (res) {
                        console.log("get transaction by hash: " + JSON.stringify(res))
                    }
                })

            }
        }
    });
}


function getRandomInt() {
    return Math.floor(Math.random() * 100).toString(); 
}


async function citaTest() {

    console.log("web3.isConnected: " + web3.isConnected());

    // * net_peerCount
    // * cita_blockNumber
    // * cita_sendTransaction
    // * cita_getBlockByHash
    // * cita_getBlockByNumber
    // * cita_getTransaction
    // * eth_getTransactionCount
    // * eth_getCode
    // * eth_getTransactionReceipt
    // * eth_call

    console.log("--------begin test base case of cita -------");

    //1. get cita block height
    web3.eth.getBlockNumber(function (err, result) {
        if (err) {
            console.log("get current block height error: " + err);
        } else {
            console.log("current block height:" + result);
        }
    });

    //2. get cita peer node count
    web3.net.getPeerCount(function (err, result) {
        if (err) {
            throw new error("get cita peer node count error: " + err);
        } else {
            console.log("cita peer node count:" + result);
        }
    });


    //3. cita_getBlockByHeight
    web3.eth.getBlockByNumber(0x10, false, function (err, result) {
        if (err) {
            throw new error("get block by height error: " + err);
        } else {
            console.log("get hash by height: " + result.hash);

            //4 cita_getBlockByHash
            web3.eth.getBlockByHash(result.hash, function (err, result) {
                if(err) {
                    throw new error("get block by hash error: " + err);
                } else {
                    console.log("get block by hash : " + JSON.stringify(result));
                }
            });

        }
    });


    
}