const {
    test,
    expect
} = require("../test/index")

const sandbox = require("../lang/sandbox")


test("Code should be compiled correctly",function(){
    const fn = (a,b,c)=>{
        a *= a + b;
        b *= b + b + a;
        return a % c / b % c;
    }
    const fn_text =  `return (${fn.toString()})`

    expect(sandbox(fn_text)()(1,2,3)).to.be.eq(fn(1,2,3))
    expect(sandbox(fn_text)()(3,4,5)).to.be.eq(fn(3,4,5))
})

test("Eval should can not escape",function(){
    const code = `
        eval("eval(console.log(void 0))")
    `
    // expect(sandbox(code)).to.be.throw(ReferenceError)
    expect(sandbox(code)).to.be.throw(TypeError)
})

test("Async caller should can not escape",function(){
    const code1 = 'setTimeout(()=>{console.log("x")},1)'
    expect(sandbox(code1)).to.be.throw(TypeError)
    
    const code2 = 'process.nextTick(()=>{consoe.log("x")})'
    expect(sandbox(code2)).to.be.throw(TypeError)
    
    const code3 = `new Promise(()=>{
        console.log(global)
    })`
    expect(sandbox(code3)).to.be.throw(TypeError)

    const code4 = `return (async ()=>{
        console.log(global)
    })`
    sandbox(code4)()().then(()=>{}).catch(e=>{
        expect(e).to.be.typeOf(TypeError)
    })

})

test("Callee should can not escape", function(){
    const code = `arguments.callee(global)`
    expect(sandbox(code)).to.be.throw(TypeError)
})
