const {
    test,
    expect,
    TODO
} = require("../test/index")

test("test",function(){
    expect([1,3]).to.not.has(1)
})

// Promise.resolve([1,2,3]).then(r=>{
//     test("promise",function(){
//         expect(r).to.eq([1,2,3])
//     })
// })