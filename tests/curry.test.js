const {
    test,
    expect
} = require("../test/index")

const {
    partial,
    curryN,
    curry
} = require("../lang/curry")

test("Partial function should accept parameters but do not process them", function () {
    const add = (a, b) => a + b
    var add2 = partial(add,2)
    expect(add2(2)).to.eq(4)
    expect(add2(0)).to.eq(2)
    expect(add2(0,0,0)).to.eq(2)
    expect(add2(0,1,2)).to.eq(2)
})

test("CurryN function should independent of the number of parameters of the original function", function(){
    const sum = (...args) => args.reduce((s,v)=>s+v,0)
    var sum4 = curryN(sum,4)
    expect(sum4(1,1,1,1)).to.eq(4)
    expect(sum4(1,1)(1,1)).to.eq(4)
    expect(sum4(1,1,1,1,1)).to.eq(5)
    expect(sum4(1)).to.be.type("function")
    expect(sum4(1)(1)).to.be.type("function")
})

test("Curry function should can splice different functions at will", function(){
    const add = curry((a,b) => a+b)
    const map = curry((fn,arr) => Array.prototype.map.bind(arr)(fn))
    const mapadd10 = map(add(10))
    expect(mapadd10).to.be.type("function")
    expect(mapadd10([1,2,3])).to.eq([11,12,13])
    expect(mapadd10([0])).to.eq([10])

    const mapVaddI = map(add)
    expect(mapVaddI([1,2,3])).to.eq([1,3,5])
    expect(mapVaddI([1])).to.eq([1])
    expect(mapVaddI([1,2])).to.eq([1,3])
    expect(mapVaddI([3,2,5])).to.eq([3,3,7])
})

test("Number of curryed function parameters is should not changed", function(){
    expect(curry(()=>{})).to.lengthOf(0)
    expect(curry((a)=>{})).to.lengthOf(1)
    expect(curry((a,b)=>{})).to.lengthOf(2)
    expect(curry((a,b,c)=>{})).to.lengthOf(3)
    expect(curry((a,b,c,d)=>{})).to.lengthOf(4)
})

test("If a function is called, number of parameters should change accordingly",function(){
    expect(curry((a,b)=>{})()).to.lengthOf(2)
    expect(curry((a,b)=>{})(1)).to.lengthOf(1)
    expect(curry((a,b)=>{})(1)(1)).to.be.undefined()
    
    expect(curry((a,b,c,d)=>{})()).to.lengthOf(4)
    expect(curry((a,b,c,d)=>{})(1)).to.lengthOf(3)
    expect(curry((a,b,c,d)=>{})(1)(1)).to.be.lengthOf(2)
    expect(curry((a,b,c,d)=>{})(1)(1)(1)).to.be.lengthOf(1)
})

test("Decorated function of behavior should not be changed", function(){
    var match = (what,str)=>str.match(what)
    var cmatch = curry(match)

    var tRE = /hello/ig
    var mHello = cmatch(tRE)
    expect(mHello("hello")).to.be.has("0")
    expect(mHello("hello")).should.to.be.eq(match(tRE,"hello"))
    expect(mHello("hEllo")).to.lengthOf(1)
    expect(mHello("hEllo")).should.to.be.eq(match(tRE,"hEllo"))
    expect(mHello("hllo")).to.be.null()
    expect(mHello("hllo")).should.to.be.eq(match(tRE,"hllo"))
 
    var replace = (what, replacement, str)=> str.replace(what, replacement)
    var cReplace = curry(replace)

    var clearCommit = cReplace("//","")
    expect(clearCommit("// commit")).to.eq(replace("//","","// commit"))
    expect(clearCommit("//commit")).to.eq(replace("//","","//commit"))

    var filter = (f, ary)=>ary.filter(f)
    var cfilter = curry(filter)

    var isEven = n=>n%2!=0
    var feven = cfilter(isEven)
    var someArr = [1,2,3,4,5,6,7,8,9]

    expect(feven(someArr)).should.to.eq(filter(isEven, someArr))
    expect(feven(someArr)).to.has(2,4)
    expect(feven(someArr)).not.has(5,9)
})