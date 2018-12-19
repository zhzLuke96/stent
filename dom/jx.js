const re = /{{([\s\S]+?)}}/

function loadJx(xx) {
    let stack = [],
        e;

    function inner(sx) {
        if (sx.length == 0) return void 0;
        if (!(e = re.exec(sx))) stack.push([0, sx])
        else {
            if (e.index != 1) stack.push([0, sx.slice(0, e.index)])
            if (e[0][2] == "=") stack.push([2, e[1].slice(1)])
            else if (e[0][2] == "$") stack.push([3, e[1].slice(1)])
            else stack.push([1, e[1]])
            inner(sx.slice(e.index + e[0].length))
        }
    }
    inner(xx)
    return stack
}

function compile(stack) {
    let code = ""
    for (const row of stack) {
        switch (row[0]) {
            case 0:
                code += `yield \`${row[1].trim()}\`;`
                break;
            case 1: // command
                code += `${row[1]}\n`
                break;
            case 2: // get values
                code += `yield ${row[1].trim()};`
                break;
            case 3: // tpl called
                code += `yield $${row[1].trim()};`
                break;
            default:
                break;
        }
    }
    return eval(`(function*(obj){with(obj){\n${code}\n}})`)
}

function compileJx(jx_text){
    return compile(loadJx(jx_text))
}

function tplLoader(tpl,data){
    return [...tpl(data)].join("")
}

function __Jx(jx_text, data) {
    var tpl = compileJx(jx_text)
    return tplLoader(tpl, data)
}

class Jx{
    constructor(){
        this.mods = {}
    }
    mod(name,jx_text){
        this.mods[name] = d => tplLoader(compileJx(jx_text),d)
    }
    __prx$(o){
        let that = this
        return new Proxy(o,{
            get(o,prop){
                if(prop == Symbol.unscopables)return undefined
                if(prop[0] == "$" && prop.slice(1) in that.mods)
                    return d => that.mods[prop.slice(1)](that.__prx$(d))
                return  o[prop]
            },
            has(o,prop){
                if(prop.slice(1) in that.mods || prop in o)return true
                return false
            }
        })
    }
    compile(jx_text,data){
        return __Jx(jx_text, this.__prx$(data))
    }
}

if(typeof module != "undefined")
    module.exports =  Jx