function readTextFile(file, callback){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                callback(allText)
            }
        }
    }
    rawFile.send(null);
}
function readText(url){
    return new Promise((reslove,reject)=>{
        try {
            readTextFile(url,res=>{
                reslove(res)
            })
        } catch (err) {
            reject(err)
        }
    })
}

function creatCustomEle(tagName, shadowHtml, option) {
    function thatEle(...args) {
        return Reflect.construct(HTMLElement, [], this.constructor);
    }

    thatEle.prototype = Object.create(HTMLElement.prototype);
    thatEle.prototype.constructor = thatEle;
    Object.setPrototypeOf(thatEle, HTMLElement);
    thatEle.prototype.connectedCallback = function () {
        option.init.call(this)
        this.shadowRoot = this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = shadowHtml
    }
    thatEle.prototype = Object.assign(thatEle.prototype, option)
    window.customElements.define(tagName, thatEle)
}

function tplLoader(text) {
    let re = /<script[\s\S]*?>([\s\S]*?)<\/script>/i
    let script = text.match(re)[1]
    let html = text.replace(re, "")
    let options = eval(`(function(){
        let options;
        ${script}
        return options
    })()`)
    creatCustomEle(options.name, html, options)
}

creatCustomEle("x-import","<style>:host{display:none;}</style>",{
    name: "x-import",
    init() {
        readText(this.getAttribute("from"))
            .then(text=>tplLoader(text))
    }
})