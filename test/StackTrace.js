const getStackTrace = (()=>{
    if(Error.captureStackTrace){
        // on V8
        return function(level=1){
            var ret = {}
            Error.captureStackTrace(ret, getStackTrace)
            if(level>=0)return ret.stack.split(/\n+/)[level].trim()
            return ret.stack
        }
    }else{
        // other browser
        return function(level=1){
            try {
                throw new Error()
            } catch (e) {
                if(level>=0)return e.stack.split(/\n+/)[level].trim()
                return e.stack
            }
        }
    }
})()


module.exports = {
    getStackTrace
}