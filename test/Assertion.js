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
        this.msg = ""
    }
    addProcess(fn, front = true) {
        if(front)this.flow_stack.push(fn)
        else this.back_stack.push(fn)
    }
    dump(){
        var flow = this.actual
        while(this.flow_stack.length!=0)flow = this.flow_stack.pop()(flow)
        while(this.back_stack.length!=0)flow = this.back_stack.pop()(flow)
        return flow
    }
    __throw() {
        var msg = `should (${this.expect}) but (${this.prop ? this.actual[this.prop] : this.actual}).`
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