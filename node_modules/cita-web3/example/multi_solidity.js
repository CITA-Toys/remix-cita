const fs = require('fs');
const solc = require('solc');
const Web3 = require('../lib/web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:1337"));

var input = {};
var files = ['CalculateStorage.sol', 'SafeMath.sol'];
var i;
for (i in files) {
    var file = files[i];
    input[file] = fs.readFileSync('contracts/' + file, 'utf8');
}

var output = solc.compile({sources: input}, 1);
// console.log("compile output: " + JSON.stringify(output));
const contractData = output.contracts['CalculateStorage.sol:CalculateStorage']; 
var bytecode = contractData.bytecode;
// console.log("compile bytecode: " + JSON.stringify(bytecode));

const abi = JSON.parse(contractData.interface);
const contract = web3.eth.contract(abi);


var validUntilBlock = 0;
const privkey = '352416e1c910e413768c51390dfd791b414212b7b4fe6b1a18f58007fa894214';
const quota = 999999;
const from = '0dbd369a741319fa5107733e2c9db9929093e3c7';

/*************************************初始化完成***************************************/ 
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
            }
        }
    });
}


function getRandomInt() {
    return Math.floor(Math.random() * 100).toString(); 
}
