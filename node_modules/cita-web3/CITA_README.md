# Web3.js

`Web3.js`原是支持[以太坊RPC接口](https://github.com/ethereum/wiki/wiki/JavaScript-API)的`JavaScript`库，方便第三方开发者使用`JavaScript`完成与以太坊的交互，由于`CITA`与以太坊保持高度兼容性，因此我们将`Web3.js`稍加改造，同时支持以太坊和CITA，使用习惯也和以太坊保持高度一致。

目前改造后的`web3.js`提供了在`node.js`环境下可以正常运行和测试的示例，其中包括获取`CITA`基本信息、发送交易、获取块信息、部署智能合约以及测试合约方法等功能，涵盖了区块链应用的绝大部分使用场景。

### 准备工作和工程目录介绍

`web3.js`需要本地有`node`环境，建议安装最新版本，正式开始前还需要通过`npm install`下载工程需要依赖的所有第三方库。

在使用`Web3`之前，必须要先启动`CITA`，具体启动方法可以参见[CITA安装和启动说明](http://cita.readthedocs.io/zh_CN/latest/getting_started.html#)

改造后的`web3.js`基本上沿用了原来的目录结构，在`example`目录下增加了两个合约文件：`SimpleStorage.sol`和`Token.sol`，以及三个测试文件`storage_test.js`、`token_test.js`和`cita_test.js`，直接执行`node storage_test.js`，即可完成合约从编译、部署、执行的全过程。

下面以`Token.sol`和`token_test.js`为例，介绍详细的使用过程。

### 初始化web3

要想使用`web3`，必须先对其进行初始化，配置`HttpProvider`，初始化`Http`请求的`host`和`port`。方法和以太坊类似：

```js
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:1337"));
```

### 测试CITA常用的接口

`CITA`中很多常用的接口命名规范都和以太坊保持一致，当然有些接口的名称前缀更换成了`cita_`，使用者无需关心接口名称之间的差异，只需要调用暴露出来的api方法即可。以下是`CITA`常用的

```js
/*
** net_peerCount          获取CITA网络中的节点数量
** cita_blockNumber       获取CITA网络中当前的区块高度
** cita_getBlockByHash    根据hash值获取区块信息
** cita_getBlockByNumber  根据区块链高度获取区块信息
*/
async function citaTest() {

    console.log("--------begin test base case of cita -------");

    //1. get cita current block height
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

    //3. get cita block information by height number
    web3.eth.getBlock(0, function (err, result) {
        if (err) {
            throw new error("get block by height error: " + err);
        } else {
            blockHash = result.hash;
            console.log("get hash by height: " + block);
        }
    });

    //4. get cita block information by block hash
    web3.eth.getBlock(blockHash, function (err, result) {
        if(err) {
            throw new error("get block by hash error: " + err);
        } else {
            console.log("get block by hash : " + JSON.stringify(result));
        }
    });
}
```
### 编译智能合约，并生成合约对象

```js
const input = fs.readFileSync('Token.sol');				// 读取合约文件信息
const output = solc.compile(input.toString(), 1);		// 编译合约文件
const contractData = output.contracts[':Token'];        // 规则：冒号+contract名称，并非文件名
const bytecode = contractData.bytecode;					// 获取合约的字节码   
const abi = JSON.parse(contractData.interface);			// 获取合约的abi值
const Contract = web3.eth.contract(abi);				// 生成合约对象
```

`Token.sol`是一个非常简单的代币合约文件，只包含了两个方法，查询某一地址的余额以及向某一地址转账，代码如下：

```solidity
pragma solidity ^0.4.18;

contract Token {
    mapping (address => uint) public balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function Token() {
        balances[msg.sender] = 10000;
    }

    function getBalance(address account) public returns (uint balance) {
        return balances[account];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { 
            return false; 
        }
    }
}
```

### 部署智能合约

部署智能合约本质上就是往`CITA`网络中发送交易，请求参数中需要包含智能合约编译后的字节码，目前`CITA`只支持签名加密并序列化后的交易请求方式，对应于以太坊中的`sendRawTransaction`，所以需要在`web3.js`中完成交易请求参数的签名加密和序列化，这部分代码在`web3.js`库的`formatters.js`文件中。

对于`CITA`来说，需要一些特定的参数，其中就用到了当前块高度，因此在部署合约之前，必须先调用方法获取当前块高度，下面详细介绍一下发送交易需要用到的参数。

* `privkey`: `CITA`私钥
* `nonce`: 可以随机生成，或者根据具体业务生成
* `quota`: 类似于`ethereum`中的`gas`资源,
* `data`: 合约编译后的字节码，如果是普通交易，则不需要填写该参数
* `validUntilBlock`: 超时机制，假定当前链高度为h, 则`validUntilBlock`取值应该为(h, h+100]之间的任意数值

具体的部署合约代码如下：

```js
function deployContract() {
    Contract.new({
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        data: bytecode,
        validUntilBlock: validUntilBlock
    }, (err, contract) => {
        if(err) {
            console.error(err);
            return;
        } else if(contract.address){
            myContract = contract;
            console.log('address: ' + myContract.address);
            callMethodContract();           // 调用合约方法
        }
    });
}
```
部署合约的过程的大致如下：先将合约编译后的字节码添加到交易请求参数列表中，向`CITA`发送部署合约的交易请求，并获取请求返回的`hash`值。然后`web3.js`会通过`eth_newBlockFilter`请求创建监听最新区块状态改变的`filter`，根据获取到的`filter_id`在一定的次数范围内，以固定时间间隔发送`eth_getFilterChanges`请求，直到出新块，此时说明合约已经部署到链上。至于是否部署成功，可以通过`getTransactionReceipt`请求判断，如果合约部署成功，那么返回值中会包含`contractAddress`，如果合约部署有问题，那么错误信息会体现在`errMessage`字段中。

以下是执行过程中的日志记录，我们可以从日志中更加直观地看到部署合约的整个流程。

```js
// 部署合约，发送带有合约code的交易请求
sendAsync:  {"jsonrpc":"2.0","id":2,"method":"cita_sendTransaction","params":["0aa60412013618bf843d207f2a9a046060604052341561000f57600080fd5b600160a060020a033316600090815260208190526040902061271090556101df8061003b6000396000f3006060604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166327e235e3811461005b578063a9059cbb1461008c578063f8b2cb4f146100c2575b600080fd5b341561006657600080fd5b61007a600160a060020a03600435166100e1565b60405190815260200160405180910390f35b341561009757600080fd5b6100ae600160a060020a03600435166024356100f3565b604051901515815260200160405180910390f35b34156100cd57600080fd5b61007a600160a060020a0360043516610198565b60006020819052908152604090205481565b600160a060020a03331660009081526020819052604081205482901080159061011c5750600082115b1561018e57600160a060020a033381166000818152602081905260408082208054879003905592861680825290839020805486019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a3506001610192565b5060005b92915050565b600160a060020a0316600090815260208190526040902054905600a165627a7a723058202797b391df241588cc1b8bed1f7a19c80999f99348acd33453d76f3055cf9f8c00291241be299d4ed6b5d1e1c6613b9cddbe875a41dec4bb6ea73e288e59c77d4a8080fe020a9713c1ba3c1aa23e1604bc8dce7ab7579fd4a84a0f9199c5c0346f06d25300"]}

// 交易hash返回正常
result:  {"jsonrpc":"2.0","id":2,"result":{"hash":"0x7bf3c448de4689551a56c9986ed0bc5c52a0af1ce14419d7743566718460d3a1","status":"Ok"}}

// 创建监听新块的filter
sendAsync:  {"jsonrpc":"2.0","id":3,"method":"eth_newBlockFilter","params":[]}
result:  {"jsonrpc":"2.0","id":3,"result":"0x2"}

// 轮询eth_getFilterChanges，直到出块成功
sendAsync:  [{"jsonrpc":"2.0","id":4,"method":"eth_getFilterChanges","params":["0x2"]}]
received:  [ { jsonrpc: '2.0',
    id: 4,
    result: 
     [ '0x4094f293231a3e05ff1f092cc79ef935124ea59896ead7b2b4ec33fff6159278' ] } ]

sendAsync:  {"jsonrpc":"2.0","id":5,"method":"eth_getTransactionReceipt","params":["0x7bf3c448de4689551a56c9986ed0bc5c52a0af1ce14419d7743566718460d3a1"]}

result:  {"jsonrpc":"2.0","id":5,"result":null}

sendAsync:  [{"jsonrpc":"2.0","id":6,"method":"eth_getFilterChanges","params":["0x2"]}]
received:  [ { jsonrpc: '2.0', id: 6, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":7,"method":"eth_getFilterChanges","params":["0x2"]}]
received:  [ { jsonrpc: '2.0',
    id: 7,
    result: 
     [ '0xfd433d5d28120843829e4608f52465695f00257c3e2a2386af3df468aa33511b' ] } ]

sendAsync:  {"jsonrpc":"2.0","id":8,"method":"eth_getTransactionReceipt","params":["0x7bf3c448de4689551a56c9986ed0bc5c52a0af1ce14419d7743566718460d3a1"]}

result:  {"jsonrpc":"2.0","id":8,"result":null}

sendAsync:  [{"jsonrpc":"2.0","id":9,"method":"eth_getFilterChanges","params":["0x2"]}]
received:  [ { jsonrpc: '2.0', id: 9, result: [] } ]

sendAsync:  [{"jsonrpc":"2.0","id":10,"method":"eth_getFilterChanges","params":["0x2"]}]
received:  [ { jsonrpc: '2.0', id: 10, result: [] } ]

// 出块成功
sendAsync:  [{"jsonrpc":"2.0","id":14,"method":"eth_getFilterChanges","params":["0x2"]}]
received:  [ { jsonrpc: '2.0',
    id: 14,
    result: 
     [ '0xa4845c7cafddbc947909f13067ebd6bded678bac0914ea6f6d9b785c8b20ef1c' ] } ]

// 发送eth_getTransactionReceipt获取合约部署情况
sendAsync:  {"jsonrpc":"2.0","id":15,"method":"eth_getTransactionReceipt","params":["0x7bf3c448de4689551a56c9986ed0bc5c52a0af1ce14419d7743566718460d3a1"]}

result:  {"jsonrpc":"2.0","id":15,"result":{"transactionHash":"0x7bf3c448de4689551a56c9986ed0bc5c52a0af1ce14419d7743566718460d3a1","transactionIndex":"0x0","blockHash":"0xa4845c7cafddbc947909f13067ebd6bded678bac0914ea6f6d9b785c8b20ef1c","blockNumber":"0x29","cumulativeGasUsed":"0x1c5b7","gasUsed":"0x1c5b7","contractAddress":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","logs":[],"root":null,"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","errorMessage":null}}

```

### 获取合约文件中的Event事件

在`solidity`合约文件中，通常会在某些方法中添加`Event`事件，目的是通过日志的方式，获取合约执行过程中的关键节点，例如方法执行是否正常，转账是否成功等，在不调用新的合约方法的前提下，可以通过该`fliter`返回的日志数据判断合约的执行情况。相关的js代码如下：

```js
// 获取事件对象
var myEvent = myContract.Transfer();
// 监听事件，监听到事件后会执行回调函数，并且停止继续监听
myEvent.watch(function(err, result) {
    if (!err) {
        console.log("Transfer event result: " + JSON.stringify(result));
    } else {
        console.log("Transfer event error: " + JSON.stringify(err));
    }
    myEvent.stopWatching();
});
```

这段js代码背后是调用了两个方法，一个是创建`filter`的请求`eth_newFilter`，一个是持续监听`filter`变化的请求`eth_getFilterChanges`，如果合约执行正常，`eth_getFilterChanges`会返回`Event`事件中包含的数据。

```js
sendAsync:  [{"jsonrpc":"2.0","id":40,"method":"eth_getFilterChanges","params":["0x4"]},{"jsonrpc":"2.0","id":41,"method":"eth_getFilterChanges","params":["0x5"]}]
received:  [ { jsonrpc: '2.0', id: 40, result: [] },
  { jsonrpc: '2.0', id: 41, result: [ [Object] ] } ]
  
// solidity中对应的Transfer Event事件，返回相应的log数据
Transfer event result: {"address":"0xbd51c4669a21df5afd1fb661d5aab67171fbec35","blockHash":"0x74fff0272d2aa3a9c541c0ccf3af5460c73540b731c9f34b75f70cb7412a5d9a","blockNumber":158,"transactionHash":"0x439bde17517b6970480ee5ecb96f1b0e8e477f09e30f736786b3286b829733fe","transactionIndex":0,"logIndex":0,"transactionLogIndex":"0x0","event":"Transfer","args":{"_from":"0x0dbd369a741319fa5107733e2c9db9929093e3c7","_to":"0x546226ed566d0abb215c9db075fc36476888b310","_value":"100"}}
```

### 调用合约方法

合约部署成功后，就可以调用合约方法，以验证合约部署和执行情况是否正常。调用合约方法本质上也是在发送交易，`web3.js`库会将合约文件中的所有方法映射成`js`方法，使用者完全可以像调用普通`js`方法，完成对合约方法的调用。

代用合约方法代码如下：

```js
const balance = myContract.getBalance.call(from);		// 调用查询余额方法
console.log("get balance: " + balance); 

var result = myContract.transfer(to, 100, {				// 向特定地址转账100个代币
    privkey: privkey,
    nonce: getRandomInt(),
    quota: quota,
    validUntilBlock: validUntilBlock,
    from: from
});

console.log("transfer receipt: " + JSON.stringify(result))

// wait for receipt, 
var count = 0;
var filter = web3.eth.filter('latest', function(err){		// 调用flter方法，持续监听当前最新块的出块状态
    if (!err) {
        count++;
        if (count > 20) {									// 如果连续20次监听请求，都没有出新块，则停止监听
            filter.stopWatching(function() {});
        } else {
        	// 当filter监听到有新区块产生后，发起getTransactionReceipt请求，如果返回结果成功，那就可以通过调用查询余额方法验证转账结果了
            web3.eth.getTransactionReceipt(result.hash, function(e, receipt){
                if(receipt) {
                    filter.stopWatching(function() {});
                    const balance2 = myContract.getBalance.call(to);
                    console.log("transfer balance: " + balance2); 
                }
            });
        }
    }
});
```
如果合约方法执行返回的结果符合预期，那么就说明合约部署和验证成功。

