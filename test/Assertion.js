const {
    getStackTrace
} = require("./StackTrace.js")
const identify = x => x

class Assertion {
    constructor(actual) {
        this.actual = actual
        this.expect = undefined
        this.prop = undefined
        this.flow_stack = [identify]
        this.back_stack = []
        this.flag = {}
        this.msg = ""
    }
    addProcess(fn, tmsg, front = true) {
        if(tmsg)this.msg += tmsg + " "
        if(front)this.flow_stack.push(fn)
        else this.back_stack.push(fn)
    }
    dump(){
        var flow = this.actual
        while(this.flow_stack.length!=0)flow = this.flow_stack.shift()(flow)
        while(this.back_stack.length!=0)flow = this.back_stack.shift()(flow)
        return flow
    }
    __throw() {
        var msg = `expect should ${this.msg}(${this.expect}) but it's (${this.prop ? this.actual[this.prop] : this.actual}).`
        return new Error(msg)
    }
    catch () {
        if (!this.dump())throw this.__throw()
    }
}

if (typeof module != "undefined" && module.exports) {
    module.exports = {
        Assertion
    }
}