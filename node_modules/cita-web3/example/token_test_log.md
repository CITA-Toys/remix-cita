## token测试日志分析

#### 获取区块高度，交易请求valid_unit_block需要用到当前块高度

```js
sendAsync:  {"jsonrpc":"2.0","id":1,"method":"cita_blockNumber","params":[]}
result:  {"jsonrpc":"2.0","id":1,"result":"0x9a"}
```

#### 部署合约时，交易的拼接参数

```js
transaction parameter options: {"privkey":"352416e1c910e413768c51390dfd791b414212b7b4fe6b1a18f58007fa894214","nonce":"11","quota":999999,"data":"6060604052341561000f57600080fd5b600160a060020a033316600090815260208190526040902061271090556101df8061003b6000396000f3006060604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166327e235e3811461005b578063a9059cbb1461008c578063f8b2cb4f146100c2575b600080fd5b341561006657600080fd5b61007a600160a060020a03600435166100e1565b60405190815260200160405180910390f35b341561009757600080fd5b6100ae600160a060020a03600435166024356100f3565b604051901515815260200160405180910390f35b34156100cd57600080fd5b61007a600160a060020a0360043516610198565b60006020819052908152604090205481565b600160a060020a03331660009081526020819052604081205482901080159061011c5750600082115b1561018e57600160a060020a033381166000818152602081905260408082208054879003905592861680825290839020805486019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a3506001610192565b5060005b92915050565b600160a060020a0316600090815260208190526040902054905600a165627a7a723058202797b391df241588cc1b8bed1f7a19c80999f99348acd33453d76f3055cf9f8c0029","validUntilBlock":242}
```

#### 交易的签名结果

```js
sign:  7b77d56e438a112977c7470c1236a2ef55d8ef78f0b92637e17aca67615c3e7313e9e444eb5b9634f15f6ffbff2613c0ddfa3c192194830392390b6c0d2adad301

```

#### 发送合约部署交易请求

```js
sendAsync:  {"jsonrpc":"2.0","id":2,"method":"cita_sendTransaction","params":["0aa8041202313118bf843d20f2012a9a046060604052341561000f57600080fd5b600160a060020a033316600090815260208190526040902061271090556101df8061003b6000396000f3006060604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166327e235e3811461005b578063a9059cbb1461008c578063f8b2cb4f146100c2575b600080fd5b341561006657600080fd5b61007a600160a060020a03600435166100e1565b60405190815260200160405180910390f35b341561009757600080fd5b6100ae600160a060020a03600435166024356100f3565b604051901515815260200160405180910390f35b34156100cd57600080fd5b61007a600160a060020a0360043516610198565b60006020819052908152604090205481565b600160a060020a03331660009081526020819052604081205482901080159061011c5750600082115b1561018e57600160a060020a033381166000818152602081905260408082208054879003905592861680825290839020805486019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a3506001610192565b5060005b92915050565b600160a060020a0316600090815260208190526040902054905600a165627a7a723058202797b391df241588cc1b8bed1f7a19c80999f99348acd33453d76f3055cf9f8c002912417b77d56e438a112977c7470c1236a2ef55d8ef78f0b92637e17aca67615c3e7313e9e444eb5b9634f15f6ffbff2613c0ddfa3c192194830392390b6c0d2adad301"]}
```

#### 交易验证结果正常，返回交易哈希值，并且入交易池，准备入块

```js
result:  {"jsonrpc":"2.0","id":2,"result":{"hash":"0xce403cffdb92f39a1af711a794859eb8948f55645eda151f7d68aefc5db9b539","status":"OK"}}
-----hash:  { hash: '0xce403cffdb92f39a1af711a794859eb8948f55645eda151f7d68aefc5db9b539',
  status: 'OK' }
```

#### 创建监听新区快变动的filter

```js
sendAsync:  {"jsonrpc":"2.0","id":3,"method":"eth_newBlockFilter","params":[]}
result:  {"jsonrpc":"2.0","id":3,"result":"0x3"}
```

#### 持续监听区块变动情况，直到出新块

```js
sendAsync:  [{"jsonrpc":"2.0","id":4,"method":"eth_getFilterChanges","params":["0x3"]}]
received:  [ { jsonrpc: '2.0',
    id: 4,
    result: 
     [ '0xd770829c9337024d2c57ca8703d34dd182f78cc01c4c54ad3175af6ff6f52225' ] } ]

sendAsync:  {"jsonrpc":"2.0","id":5,"method":"eth_getTransactionReceipt","params":["0xce403cffdb92f39a1af711a794859eb8948f55645eda151f7d68aefc5db9b539"]}
result:  {"jsonrpc":"2.0","id":5,"result":null}
sendAsync:  [{"jsonrpc":"2.0","id":6,"method":"eth_getFilterChanges","params":["0x3"]}]
received:  [ { jsonrpc: '2.0',
    id: 6,
    result: 
     [ '0x0253905f93812f9f913036989c660b4bbbe33569611c12920eb65f0188760598' ] } ]
```

#### 监听到出新块后，获取部署交易请求的receipt，如果合约部署成功，会返回合约信息，否则返回Null

```js
sendAsync:  {"jsonrpc":"2.0","id":7,"method":"eth_getTransactionReceipt","params":["0xce403cffdb92f39a1af711a794859eb8948f55645eda151f7d68aefc5db9b539"]}
result:  {"jsonrpc":"2.0","id":7,"result":null}
sendAsync:  [{"jsonrpc":"2.0","id":8,"method":"eth_getFilterChanges","params":["0x3"]}]
received:  [ { jsonrpc: '2.0',
    id: 8,
    result: 
     [ '0x1c6232cb7176369f9fdb340bc84d81309c2dca52808777d3d6167923c693c0e2' ] } ]
```

#### 获取部署交易请求的receipt，合约部署成功

```js
sendAsync:  {"jsonrpc":"2.0","id":9,"method":"eth_getTransactionReceipt","params":["0xce403cffdb92f39a1af711a794859eb8948f55645eda151f7d68aefc5db9b539"]}
result:  {"jsonrpc":"2.0","id":9,"result":{"transactionHash":"0xce403cffdb92f39a1af711a794859eb8948f55645eda151f7d68aefc5db9b539","transactionIndex":"0x0","blockHash":"0x1c6232cb7176369f9fdb340bc84d81309c2dca52808777d3d6167923c693c0e2","blockNumber":"0x9c","cumulativeGasUsed":"0x1c5b7","gasUsed":"0x1c5b7","contractAddress":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","logs":[],"root":null,"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","errorMessage":null}}
address:  0xbd51c4669a21df5afd1fb661d5aab67171fbec35
```

#### 根据合约地址获取合约的code值

```js
sendAsync:  {"jsonrpc":"2.0","id":10,"method":"eth_getCode","params":["0xbd51c4669a21df5afd1fb661d5aab67171fbec35","latest"]}
result:  {"jsonrpc":"2.0","id":10,"result":"0x6060604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166327e235e3811461005b578063a9059cbb1461008c578063f8b2cb4f146100c2575b600080fd5b341561006657600080fd5b61007a600160a060020a03600435166100e1565b60405190815260200160405180910390f35b341561009757600080fd5b6100ae600160a060020a03600435166024356100f3565b604051901515815260200160405180910390f35b34156100cd57600080fd5b61007a600160a060020a0360043516610198565b60006020819052908152604090205481565b600160a060020a03331660009081526020819052604081205482901080159061011c5750600082115b1561018e57600160a060020a033381166000818152602081905260408082208054879003905592861680825290839020805486019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a3506001610192565b5060005b92915050565b600160a060020a0316600090815260208190526040902054905600a165627a7a723058202797b391df241588cc1b8bed1f7a19c80999f99348acd33453d76f3055cf9f8c0029"}
```

#### 卸载filter，停止监听

```js
sendAsync:  {"jsonrpc":"2.0","id":11,"method":"eth_uninstallFilter","params":["0x3"]}
address: 0xbd51c4669a21df5afd1fb661d5aab67171fbec35
```

#### 创建新的filter，对应于solidity中的Event，也就是我们常说的log

```js
sendAsync:  {"jsonrpc":"2.0","id":12,"method":"eth_newFilter","params":[{"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",null,null],"address":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35"}]}
address:  0xbd51c4669a21df5afd1fb661d5aab67171fbec35
```

#### 调用合约中获取账户余额的方法，查询数据方法可以从返回值中直接获取结果，账户余额为1000，和合约代码一致

```js
send:  {"jsonrpc":"2.0","id":13,"method":"eth_call","params":[{"to":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","data":"0xf8b2cb4f0000000000000000000000000dbd369a741319fa5107733e2c9db9929093e3c7"},"latest"]}
recv:  { jsonrpc: '2.0',
  id: 13,
  result: '0x0000000000000000000000000000000000000000000000000000000000002710' }
get balance: 10000
```

#### 调用合约中的转账方法，修改合约数据需要消耗资源，需要重新组装交易请求参数

```js
transaction parameter options: {"privkey":"352416e1c910e413768c51390dfd791b414212b7b4fe6b1a18f58007fa894214","nonce":"44","quota":999999,"validUntilBlock":242,"from":"0x0dbd369a741319fa5107733e2c9db9929093e3c7","to":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","data":"0xa9059cbb000000000000000000000000546226ed566d0abb215c9db075fc36476888b3100000000000000000000000000000000000000000000000000000000000000064"}
sign:  f9dd2e90d27c34a864061a9bb1421d45d735ecf69caf6fee9af33966d39fe9ac07c8db9a7125c6b9964ed39ed23462439fc7d2ee7fc1602202270076a07c273001
```

#### 发送调用转账合约方法的交易请求

```js
send:  {"jsonrpc":"2.0","id":14,"method":"cita_sendTransaction","params":["0a7d0a2a3078626435316334363639613231646635616664316662363631643561616236373137316662656333351202343418bf843d20f2012a44a9059cbb000000000000000000000000546226ed566d0abb215c9db075fc36476888b31000000000000000000000000000000000000000000000000000000000000000641241f9dd2e90d27c34a864061a9bb1421d45d735ecf69caf6fee9af33966d39fe9ac07c8db9a7125c6b9964ed39ed23462439fc7d2ee7fc1602202270076a07c273001"]}
```

#### 交易验证正常，返回交易哈希值，并且入交易池，准备入块

```js
recv:  { jsonrpc: '2.0',
  id: 14,
  result: 
   { hash: '0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe',
     status: 'OK' } }
transfer receipt: {"hash":"0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe","status":"OK"}
```

#### 创建监听出新块的filter

```js
sendAsync:  {"jsonrpc":"2.0","id":15,"method":"eth_newBlockFilter","params":[]}
result:  {"jsonrpc":"2.0","id":15,"result":"0x4"}
```

#### 轮询请求是否出新块，如果出新块，获取调用合约方法交易的receipt，如果为Null，则继续监听

```js
sendAsync:  [{"jsonrpc":"2.0","id":16,"method":"eth_getFilterChanges","params":["0x4"]}]
result:  {"jsonrpc":"2.0","id":11,"result":true}
result:  {"jsonrpc":"2.0","id":12,"result":"0x5"}
sendAsync:  {"jsonrpc":"2.0","id":17,"method":"eth_getFilterLogs","params":["0x5"]}
received:  [ { jsonrpc: '2.0',
    id: 16,
    result: 
     [ '0x1c6232cb7176369f9fdb340bc84d81309c2dca52808777d3d6167923c693c0e2' ] } ]

sendAsync:  {"jsonrpc":"2.0","id":18,"method":"eth_getTransactionReceipt","params":["0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe"]}
result:  {"jsonrpc":"2.0","id":17,"result":[]}
result:  {"jsonrpc":"2.0","id":18,"result":null}
sendAsync:  [{"jsonrpc":"2.0","id":19,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":20,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 19, result: [] },
  { jsonrpc: '2.0', id: 20, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":21,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":22,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 21, result: [] },
  { jsonrpc: '2.0', id: 22, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":23,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":24,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 23, result: [] },
  { jsonrpc: '2.0', id: 24, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":25,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":26,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 25, result: [] },
  { jsonrpc: '2.0', id: 26, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":27,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":28,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0',
    id: 27,
    result: 
     [ '0xd5abb4a9cdd20356128657b4c98211224f6f184b2cf6227ce259bc4e96ca5ceb' ] },
  { jsonrpc: '2.0', id: 28, result: [] } ]

sendAsync:  {"jsonrpc":"2.0","id":29,"method":"eth_getTransactionReceipt","params":["0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe"]}

result:  {"jsonrpc":"2.0","id":29,"result":null}
sendAsync:  [{"jsonrpc":"2.0","id":30,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":31,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 30, result: [] },
  { jsonrpc: '2.0', id: 31, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":32,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":33,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 32, result: [] },
  { jsonrpc: '2.0', id: 33, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":34,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":35,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 34, result: [] },
  { jsonrpc: '2.0', id: 35, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":36,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":37,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 36, result: [] },
  { jsonrpc: '2.0', id: 37, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":38,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":39,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 38, result: [] },
  { jsonrpc: '2.0', id: 39, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":40,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":41,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 40, result: [] },
  { jsonrpc: '2.0', id: 41, result: [ [Object] ] } ]
```

#### solidity中对应的Event事件，返回相应的log

```js
Transfer event result: {"address":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","blockHash":"0x74fff0272d2aa3a9c541c0ccf3af5460c73540b731c9f34b75f70cb7412a5d9a","blockNumber":158,"transactionHash":"0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe","transactionIndex":0,"logIndex":0,"transactionLogIndex":"0x0","event":"Transfer","args":{"_from":"0x0dbd369a741319fa5107733e2c9db9929093e3c7","_to":"0x546226ed566d0abb215c9db075fc36476888b310","_value":"100"}}
```

#### 卸载solidity中对应Event事件的filter

```js
send:  {"jsonrpc":"2.0","id":42,"method":"eth_uninstallFilter","params":["0x5"]}
recv:  { jsonrpc: '2.0', id: 42, result: true }
sendAsync:  [{"jsonrpc":"2.0","id":43,"method":"eth_getFilterChanges","params":["0x4"]}]
received:  [ { jsonrpc: '2.0',
    id: 43,
    result: 
     [ '0x74fff0272d2aa3a9c541c0ccf3af5460c73540b731c9f34b75f70cb7412a5d9a' ] } ]
```

#### 发送getTransactionReceipt，获取合约转账方法的执行结果

```js
sendAsync:  {"jsonrpc":"2.0","id":44,"method":"eth_getTransactionReceipt","params":["0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe"]}
result:  {"jsonrpc":"2.0","id":44,"result":{"transactionHash":"0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe","transactionIndex":"0x0","blockHash":"0x74fff0272d2aa3a9c541c0ccf3af5460c73540b731c9f34b75f70cb7412a5d9a","blockNumber":"0x9e","cumulativeGasUsed":"0x6c39","gasUsed":"0x6c39","contractAddress":null,"logs":[{"address":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000000dbd369a741319fa5107733e2c9db9929093e3c7","0x000000000000000000000000546226ed566d0abb215c9db075fc36476888b310"],"data":"0x0000000000000000000000000000000000000000000000000000000000000064","blockHash":"0x74fff0272d2aa3a9c541c0ccf3af5460c73540b731c9f34b75f70cb7412a5d9a","blockNumber":"0x9e","transactionHash":"0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe","transactionIndex":"0x0","logIndex":"0x0","transactionLogIndex":"0x0"}],"root":null,"logsBloom":"0x00000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000001000800000000008000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000002000010000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000080000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000","errorMessage":null}}
```

#### 卸载监听出新块的filter，该请求通常在合约方法调用成功后执行

```js
sendAsync:  {"jsonrpc":"2.0","id":45,"method":"eth_uninstallFilter","params":["0x4"]}
address:  0xbd51c4669a21df5afd1fb661d5aab67171fbec35
```

#### 调用转账后查询账户余额方法，返回值为100，和合约代码中的转账金额一致，说明合约部署成功，合约方法可以正常调用

```js

send:  {"jsonrpc":"2.0","id":46,"method":"eth_call","params":[{"to":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","data":"0xf8b2cb4f000000000000000000000000546226ed566d0abb215c9db075fc36476888b310"},"latest"]}
recv:  { jsonrpc: '2.0',
  id: 46,
  result: '0x0000000000000000000000000000000000000000000000000000000000000064' }
transfer balance: 100
result:  {"jsonrpc":"2.0","id":45,"result":true}

```

