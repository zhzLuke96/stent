const {getStackTrace} = require("./StackTrace.js")
const isBrowser = require("../lang/isBrowser.js")
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
    })(),
    second:(()=>{
        if(isBrowser)return console.log
        else return (...args)=>console.log("\x1B[35m",...args,"\x1B[39m");
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
            switch(e.code){
                case "0",0: // todo case
                    print.info("* " ,"<TODO>",e.stack)
                    print.second("=>" , "CASE:", describe)
                    if(e.msgs.length != 0)print.warn("~ ", ...e.msgs)
                    break;
                default:
                    print.warn("? "," UNKNOWN!")
            }
        }
    }
}
const todo_caller = (...msgs)=>{throw {
    code: 0,
    stack: getStackTrace(4),
    msgs: msgs
}}

if (typeof module != "undefined" && module.exports) {
    module.exports = {
        test,
        TODO:todo_caller
    }
}