const {
    test,
    expect
} = require("../test/index")

const {
    range
} = require("../lang/range")


test("Should be able to be used For-of syntax", function(){
    let count = 0
    for (const i of range(10)) {
        expect(i).to.be.eq(count)
        count += 1
    }
})

test("Should be able to be used For-in syntax", function(){
    let count = 0
    for (const i in range(10)) {
        expect(i).to.be.eq(count)
        count += 1
    }
})

test("Build array, Should be range func can be expanded into an array.", function(){
    let length = 10
    expect([...range(length)]).to.be.lengthOf(length)
    expect([...range(length)]).to.be.eq([0,1,2,3,4,5,6,7,8,9])
})

test("After setting the step, it will add more each time.", function(){
    let count = 0
    let length = 10
    let step = 11
    let r = range(count,length,step)
    for (const i of r) {
        expect(i).to.be.eq(count)
        count += step
    }

    expect([...range(0,5,10)]).be.eq([0,10,20,30,40])
})

test("should be return empty object when a call with no arguments.", function(){
    expect([...range()]).be.eq([])
})

test("Ranges with a length of zero should not trigger a for statement.", function(){
    let length = 0
    for (const iterator of range(length)) {
        expect(iterator).not.be.called()
    }
})
