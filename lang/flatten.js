const isType = require("./isType")
const isObj = isType("object")
const isArr = isType("Array")
const push = o => Array.prototype.push.bind(o)
// 因为test里用到，这个库就没有flatten.test.js

// {x:1} =>
function flatten(obj,isOwn=true){
    var ret = Object.create(null)
    function inner(o){
        for (const key in o) {
            if (!isOwn || o.hasOwnProperty(key)) {
                const ele = o[key];
                if(isObj(ele))inner(ele)
                else if(isArr(ele))inner(ele)
                else {
                    if(key in ret)push(ret)(ele)
                    else ret[key] = ele
                }
            }
        }
    }
    inner(obj)
    if(isArr(obj) && isOwn)delete ret.length
    return ret
}

module.exports = flatten