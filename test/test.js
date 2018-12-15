const test = function (describe, target) {
    try {
        target()
        console.log("√", describe, ", done!")
    } catch (e) {
        if(e instanceof Error){
            console.log("×", describe, ", error :")
            console.log(e)
        }else{
            switch(e){
                case "0": // todo case
                    console.log("*" , describe, ", TODO!")
                    break;
                default:
                    console.log("?"," UNKNOWN!")
            }
        }
    }
}
const TODO = ()=>{throw "0"}

if (typeof module != "undefined" && module.exports) {
    module.exports = {
        test,
        TODO
    }
}