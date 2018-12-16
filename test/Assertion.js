// const {getStackTrace} = require("./StackTrace.js")
const identify = x => x

class Assertion {
    constructor(actual) {
        this.dumper = identify
        this.actual = actual
        this.expect = undefined
        this.prop = undefined
    }
    addProcess(fn) {
        var last_p = (() => this.dumper)()
        this.dumper = (...args) => last_p(fn(...args, this.actual))
    }
    catch () {
        if (!this.dumper(this.actual)){
            var msg = `should (${this.expect}) but (${this.prop ? this.actual[this.prop] : this.actual}).`
            throw new Error(msg)
        }
    }
}

if (typeof module != "undefined" && module.exports) {
    module.exports = {
        Assertion
    }
}