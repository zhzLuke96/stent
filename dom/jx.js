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
            else stack.push([1, e[1]])
            inner(sx.slice(e.index + e[0].length))
        }
    }
    inner(xx)
    return stack
}

function compile(stack, data={}) {
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
            default:
                break;
        }
    }
    return [...eval(`(function*(obj){with(obj){\n${code}\n}})`)(data)].join("")
}

function Jx(jx_text, data) {
    return compile(loadJx(jx_text), data)
}

module.exports =  Jx
