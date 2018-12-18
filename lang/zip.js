module.exports = function zip(items,clear){
    if(!clear)clear = o => String.prototype.trim.bind(o)()
    return Array.prototype.reduce.call(items,(o,v)=>{
        o[clear(v[0])] = clear(v[1])
        return o;
    })
}