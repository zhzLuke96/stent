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
        this.addRouter("to", o => {
            this.assert.msg += "to "
            return o
        })
        this.addRouter("a", o => {
            this.assert.msg += "a "
            return o
        })
        this.addRouter("an", o => {
            this.assert.msg += "an "
            return o
        })
        this.addRouter("be", o => {
            this.assert.msg += "be "
            return o
        })
        this.addRouter("is", o => {
            this.assert.msg += "is "
            return o
        })
        this.addRouter("should", o => {
            // this.assert.msg += "should "
            return o
        })
        this.addRouter("not", o => {
            o.assert.addProcess(c =>{
                return !c
            }, "not", false)
            return o
        })
        this.addRouter("keys", o => {
            o.assert.addProcess(c => Object.keys(c),"keys")
            return o
        })
        this.addRouter("values", o => {
            o.assert.addProcess(c => Object.values(c),"values")
            return o
        })
        this.addRouter("deep", o => {
            o.assert.flag["deep"] = true
            o.assert.addProcess(c => flatten(c),"deep")
            return o
        })
        this.addRouter("all", o => {
            o.assert.flag["all"] = true
            return o
        })
    }
    tail(__expect, process, msg ,prop) {
        msg = msg || __expect
        this.assert.expect = __expect
        this.assert.prop = prop
        this.assert.addProcess(process, msg)
        this.assert.catch()
    }
    eq(__expect) {
        this.tail(__expect, actual => {
            if (this.assert.flag["deep"])__expect = flatten(__expect,{})
            if (getType(actual) != getType(__expect)) return false
            if (getType(actual) == "array" || getType(actual) == "object") {
                if (actual.length && actual.length != __expect.length) return false
                for (const key in actual) {
                    if (!__expect.hasOwnProperty(key)) return false
                    var a= actual[key],
                        e = __expect[key]
                    if ( getType(a) != "array" && getType(a) != "object" && a != e)return false
                } 
                return true
            }
            return actual == __expect;
        }, "equal")
    }
    has(...props) {
        this.tail(props, actual => {
            for (const p of props) {
                if (getType(actual) == "object" && p in props)
                    if(this.assert.flag["all"])continue
                    else return true
                if (actual.indexOf(p) != -1 || actual.indexOf(String(p)) != -1)
                    if(this.assert.flag["all"])continue
                    else return true
                return false
            }
            return true
        }, "has")
    }
    throw (type) {
        this.tail(type, actual => {
            try {
                actual()
            } catch (error) {
                return error instanceof type;
            }
        },"Throw Error")
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
        this.tail(`[${min}~${max}]`, actual => actual >= min && actual <= max, "within")
    }
    type(t) {
        this.tail(`${t}`, actual => getType(actual) == t.toLowerCase(),"typeOf")
    }
    lengthOf(l) {
        this.tail(`${l}`, actual => actual.length === l,"lengthOf" , "length")
    } 
    match(re) {
        this.tail(`${re}`, actual => re.test(actual), "match")
    }
    oneOf(...args) {
        this.tail(`${args}`, actual => {
            return actual in args}, "oneOf")
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
