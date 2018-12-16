const {
    test,
    expect,
    TODO
} = require("../test/index")

const {
    pipe
} = require("../lang/pipe")

test("Empty pipes should also be callable and return to themselves",function(){
    expect(pipe()).to.be.type("function")
    expect(pipe()()).to.be.undefined()
    expect(pipe()(null)).to.be.null()
    expect(pipe()('x')).to.eq("x")
})

test("Pipe will accept any function that accepts any parameter", function(){
    const addfor = base => (...nums) => nums.map((v, i, a) => v + base)
    const multfor = base => (...nums) => nums.map((v, i, a) => v * base)
    
    var a3m5 = pipe(addfor(3), multfor(5), addfor(1))
    
    expect(a3m5).to.type("function")
    expect(a3m5(1)).to.eq([21])
    expect(a3m5(2)).to.eq([26])
    expect(a3m5(1, 2, 3, 4, 5, 6)).to.keys.has(0,5)
    expect(a3m5(1, 2, 3, 4, 5, 6)).to.be.type("array")
    expect(a3m5(1, 2, 3, 4, 5, 6)).to.values.has(31,36,41)
})

test("Should can wrap promise objects asynchronously",function(){
    // TODO
    TODO("As long as there is a promise object in the parameter list, the final result will also be a promise object.")
})

test("If generator is in pipeline, it will be called asynchronously as a partial function that accepts many parameters",function(){
    // TODO
    TODO("Generator will be wrapped as a promise before processing, so the last thing returned is also a promise object.")
})