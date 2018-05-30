var Blockchain = require('cita-web3/lib/cita/blockchain_pb.js')
var util = require('../util/util.js')

var content = '0x0a7c0a283030303030303030303030303030303030303030303030303030303030303030303133323431623212013718fface20420cc8d232a440f5aa9f30000000000000000000000004b5ae4567ad5d9fb92bc9afd6a657e6fa13a252300000000000000000000000000000000000000000000000000000000000000011241ce830c85ee38aa2e04f4f8d403e2db474d0816304e3d99839f05826f1a8dac440b80b5ebb76be16447199c48d5b3a156da23500ec1beba8a2a3c704b1531cc9800'
var str = content.replace('0x', '')
var result = util.parseHexString(str)
var unverifiedTransaction = Blockchain.UnverifiedTransaction.deserializeBinary(result);
var transaction = unverifiedTransaction.getTransaction();
var data = transaction.getData()
var to = transaction.getTo();
console.log("data: " + util.createHexString(data))
console.log("to: " + util.createHexString(to))