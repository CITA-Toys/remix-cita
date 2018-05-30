pragma solidity ^0.4.14;

import "./SafeMath.sol";

contract CalculateStorage {

    using SafeMath for *;

    uint storedData;

    function set(uint x) public {
        var result = SafeMath.mul(x, 2);
        storedData = result;
    }

    function get() public constant returns (uint) {
        return storedData;
    }
}
