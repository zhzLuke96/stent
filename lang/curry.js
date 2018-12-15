const partial = (fn, ...args) => 
                (...inner_args) =>
                fn(...args.concat(inner_args))

const curryN = (fn,n) =>
                (...args) =>
                (n <= args.length) ?
                    fn(...args) :
                    pxy_curryN(partial(fn, ...args), n-args.length)

const pxy_length = (fn,l) => Object.defineProperty(fn,"length",{get:()=>l})

const pxy_curryN = (fn,n) => pxy_length(curryN(fn,n),n)

const curry = fn => fn.length <= 1 ? fn : pxy_curryN(fn, fn.length)

module.exports = {
    partial,
    curryN:pxy_curryN,
    curry
}