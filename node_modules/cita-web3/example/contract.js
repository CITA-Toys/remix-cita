var DEBUG = 0

// utility
function hereDoc(f){　
                    return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
                   }

console.log("\n1) create account")
const { randomBytes } = require('crypto')
const secp256k1 =require('secp256k1')
const sha3 = require("crypto-js/sha3");

let privKey
do {
    privKey = randomBytes(32)
} while (!secp256k1.privateKeyVerify(privKey))
const pubKey = secp256k1.publicKeyCreate(privKey).hexSlice()
privKey = privKey.hexSlice()

let addr = sha3(pubKey).toString().substr(88, 40)
console.log("privkey: ", privKey)
console.log("pubkey: ", pubKey)
console.log("addr: ", addr)


console.log("\n2) compile contract")
var source = "" +
    "pragma solidity ^0.4.6;" +
    "contract test {\n" +
    "   function multiply(uint a) constant returns(uint d) {\n" +
    "       return a * 7;\n" +
    "   }\n" +
    "}\n";
var input = {
    'test.sol': hereDoc(function(){
        /*
          pragma solidity ^0.4.6;
          import "lib.sol";
          contract Test {
          function multiply(uint a) constant returns(uint d) {
          return a * 7;
          }
          }
        */})
}

var solc = require('solc')
function findImports (path) {
    if (path === 'lib.sol')
        return { contents: 'library L { function f() returns (uint) { return 7; } }' }
    else
        return { error: 'File not found' }
}
var output = solc.compile({ sources: input }, 1, findImports)
const code = output.contracts['test.sol:Test'].bytecode
const abi  = JSON.parse(output.contracts['test.sol:Test'].interface)
console.log("code: ", code)
console.log("abi: ", abi)

console.log("\n3) deploy contract")
const Web3 = require('../index.js')
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:1337"));


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


function deployContract() {
    var gas = 100000
    web3.eth.contract(abi).new({
        gas: gas,
        privkey: '352416e1c910e413768c51390dfd791b414212b7b4fe6b1a18f58007fa894214',
        nonce: getRandomInt(),
        quota: 999999,
        data: code,
        validUntilBlock: validUntilBlock
        }, function (err, contract) {
            if(err) {
                console.error("--------------------------------------------------------------------------------")
                console.error(err);
                return;
                // callback fires twice, we only want the second call when the contract is deployed
            } else if(contract.address){
                console.error("================================================================================")
                myContract = contract;
                console.log('address: ' + myContract.address);
                callMethodContract();
            }
        });
}




function callMethodContract() {
    // call the contract
    var res = myContract.multiply(10);
    console.log("multiply method result: " + res.toString(10));
}


function getRandomInt() {
    return Math.floor(Math.random() * 100).toString(); 
}