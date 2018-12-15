const {
    frameify
} = require("./frameify")
const isType = require("./isType")

const find = (fn, like_arr) => Array.prototype.find.bind(like_arr)(fn)
const isArr = isType("array")
const isPro = isType("promise")
const isGen = isType("Generator")
const findPro = arr => find(isPro, arr)
const findGen = arr => find(isGen, arr)

const proify_Arr = arr => {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (isGen(element)) arr[i] = frameify(arr[i])
    }
    return arr
}

const caller = (f, args) => {
    if (typeof f != "function")
        return f
    if (args.length == 0)
        return f()
    else if (args.length == 1) {
        if (isGen(args[0]))
            args[0] = frameify(args[0])
        if (isPro(args[0]))
            return args[0].then(res => caller(f, ...res))
    } else {
        if (findGen(args)) args = proify_Arr(args)
        if (findPro(args))
            return Promise.all(args).then(res => caller(f, ...res))
    }
    return f.apply(null, args)
}

const pipe = (...funcs) =>
            funcs.length == 0 ?
            (x=>x) :
            (...args) =>
            funcs.reduce((put, fn) => {
                    if (isArr(put)) return caller(fn, put)
                    return caller(fn,[put])
                }, args)

module.exports = {
    pipe
}