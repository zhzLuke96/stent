const has = ()=>true
const get = (target,prop,receiver)=>{
    if (prop === Symbol.unscopables)return undefined;
    return Reflect.get(target, prop, receiver);
}
const sandboxProxies = new WeakMap()
function compileCode(code) {
    code = 'with(sandbox){"use strict";' + code + '}';
    const fn = new Function('sandbox', code);
    return (sandbox={}) => {
        if(!sandboxProxies.has(sandbox)){
            const proxy = new Proxy(sandbox, {has,get});
            sandboxProxies.set(sandbox,proxy);
        }
        return fn(sandboxProxies.get(sandbox));
    }
}

module.exports = compileCode
