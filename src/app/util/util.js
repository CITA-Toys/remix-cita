
var parseHexString = function(str) { 
    var result = [];
    while (str.length >= 2) { 
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }
    return result;
};

var createHexString = function(arr) {
    var result = "";
    for (var i in arr) {
        var str = arr[i].toString(16);
        str = str.length == 0 ? "00" :
              str.length == 1 ? "0" + str : 
              str.length == 2 ? str :
              str.substring(str.length-2, str.length);
        result += str;
    }
    return result;
};

module.exports = {
    parseHexString: parseHexString,
    createHexString: createHexString
}