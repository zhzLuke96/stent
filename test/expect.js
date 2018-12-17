const {
    Assertion
} = require("./Assertion")
const flatten = require("../lang/flatten")

const getType = o => Object.prototype.toString.call(o).slice(8).slice(0, -1).toLowerCase()

class chained {
    constructor() {
        this.__pxy = new Proxy(this, {
            get(obj, prop) {
                if (prop in obj.__router)
                    return obj.__router[prop](obj.__pxy)
                return obj[prop]
            }
        })
        this.__router = {};
    }
    addRouter(prop, target) {
        this.__router[prop] = target
    }
}

class expect extends chained {
    constructor(actual) {
        super()
        this.assert = new Assertion(actual)
        this.initRouter()
    }
    initRouter() {
        this.addRouter("to", o => o)
        this.addRouter("be", o => o)
        this.addRouter("is", o => o)
        this.addRouter("should", o => o)
        this.addRouter("not", o => {
            o.assert.addProcess(c =>{
                return !c
            }, false)
            return o
        })
        this.addRouter("keys", o => {
            o.assert.addProcess(c => Object.keys(c))
            return o
        })
        this.addRouter("values", o => {
            o.assert.addProcess(c => Object.values(c))
            return o
        })
        this.addRouter("deep", o => {
            o.assert.addProcess(c => flatten(c))
            return o
        })
        this.addRouter("promise", o => o)
    }
    tail(__expect, process,prop) {
        this.assert.expect = __expect
        this.assert.prop = prop
        this.assert.addProcess(process)
        this.assert.catch()
    }
    eq(__expect) {
        this.tail(__expect, actual => {
            if (getType(actual) != getType(__expect)) return false
            if (getType(actual) == "array" || getType(actual) == "object") {
                if (actual.length && actual.length != __expect.length) return false
                for (const key in actual) {
                    if (!__expect.hasOwnProperty(key)) return false
                    if (actual[key] != __expect[key]) return false
                }
                return true
            }
            return actual == __expect;
        })
    }
    has(...props) {
        this.tail(props, actual => {
            for (const p of props) {
                if (getType(actual) == "object" && p in props)continue
                if (actual.indexOf(p) != -1 || actual.indexOf(String(p)) != -1) continue
                return false
            }
            return true
        })
    }
    throw (type) {
        this.tail(type, actual => {
            try {
                actual()
            } catch (error) {
                return error instanceof type;
            }
        })
    }
    ok() {
        this.tail("ok", actual => actual == true)
    }
    true() {
        this.tail(true, actual => actual === true)
    }
    false() {
        this.tail(false, actual => actual === false)
    }
    null() {
        this.tail(null, actual => actual === null)
    }
    undefined() {
        this.tail(undefined, actual => actual === undefined)
    }
    NaN() {
        this.tail("NaN", actual => isNaN(actual))
    }
    exist() {
        this.tail("exist", actual => actual !== null && actual !== undefined)
    }
    empty() {
        this.tail("empty", actual => actual.length && actual.length === 0)
    }
    within(min, max) {
        this.tail(`within [${min}~${max}]`, actual => actual >= min && actual <= max)
    }
    type(t) {
        this.tail(`type ${t}`, actual => getType(actual) == t.toLowerCase())
    }
    lengthOf(l) {
        this.tail(`lengthOf ${l}`, actual => actual.length === l, "length")
    }
    match(re) {
        this.tail(`match ${re}`, actual => re.test(actual))
    }
    oneOf(arr) {
        this.tail(`match ${re}`, actual => actual in arr)
    }
}

function outer_expect(actual) {
    return new expect(actual).__pxy
}

if (typeof module != "undefined" && module.exports) {
    module.exports = {
        expect: outer_expect
    }
}
