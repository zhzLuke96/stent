const {
    test,
    expect,
    TODO
} = require("../test/index")

test("test",function(){
    expect([1,3]).to.has(1,8)
    expect(1).to.oneOf(1,8)
    expect([1,3]).to.all.has(1)
    // expect([1,3]).to.all.has(1,8)
})

test("test path msg",function(){
    expect(undefined).to.to.to.to.is.be.not.not.not.not.not.not.a.an.null()
})

test("deep path", function(){
    expect({x:1,y:5,g:{deep:["root"]}}).to.be.eq({x:1,y:5,g:{deep:["root"]}})
    expect({x:1,y:5,g:{deep:["root"]}}).should.to.deep.not.eq({x:1,y:5,g:{deep:["????"]}})
    expect({x:1,y:5,g:{deep:["root"]}}).should.to.deep.eq({x:1,y:5,g:{deep:["root"]}})
})

Promise.resolve([1,2,3]).then(r=>{
    test("promise",function(){
        expect(r).to.eq([1,2,3])
    })
})