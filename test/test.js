const isBrowser = (()=>{
    let root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this;
    return ({}).toString.call(root) == "[object Window]"
})()
const print = {
    warn:(()=>{
        if(isBrowser)return console.warn;
        else return (...args)=>console.log("\x1B[33m",...args,"\x1B[39m");
    })(),
    error:(()=>{
        if(isBrowser)return console.error
        else return (...args)=>console.log("\x1B[31m",...args,"\x1B[39m");
    })(),
    info:(()=>{
        if(isBrowser)return console.info
        else return (...args)=>console.log("\x1B[36m",...args,"\x1B[39m");
    })(),
    success:(()=>{
        if(isBrowser)return console.log
        else return (...args)=>console.log("\x1B[32m",...args,"\x1B[39m");
    })()
}


const test = function (describe, target) {
    try {
        target()
        print.success("√ ", describe, ", done!")
    } catch (e) {
        if(e instanceof Error){
            print.info("× ", describe, ", error :")
            print.error("=>", e.message)
            print.error("=>", e.stack.split(/\n+/)[4].trim())
        }else{
            switch(e){
                case "0": // todo case
                    print.warn("* " , describe, ", TODO!")
                    break;
                default:
                    print.warn("? "," UNKNOWN!")
            }
        }
    }
}
const TODO = ()=>{throw "0"}

if (typeof module != "undefined" && module.exports) {
    module.exports = {
        test,
        TODO
    }
}