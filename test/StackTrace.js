const getStackTrace = (()=>{
    if(Error.captureStackTrace){
        // on V8
        return function(level=1){
            var ret = {}
            Error.captureStackTrace(ret, getStackTrace)
            return ret.stack.split(/\n+/)[level].trim()
        }
    }else{
        // other browser
        return function(level=1){
            try {
                throw new Error()
            } catch (e) {
                return e.stack.split(/\n+/)[level].trim()
            }
        }
    }
})()


module.exports = {
    getStackTrace
}