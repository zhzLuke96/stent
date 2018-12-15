const reqFrame = (()=>{
    if(process)return process.nextTick
    if(window)return window.requestAnimationFrame
    return cb => setTimeout(cb,0)
})
function frameify(gen,args) {
    return new Promise((resolve, reject) => {
        var res = []
        function inner() {
            reqFrame(() => {
                while (true) {
                    var n = gen.next(args.shift());
                    res.push(n.value);
                    if (n.done) {
                        resolve(res);
                        return void 0;
                    }
                }
                inner();
            })
        }
        try {
            inner()
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    frameify
}