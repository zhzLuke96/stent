
function seletorify($ele){
    let selector = $ele.localName
    if($ele.id)selector += "#"+$ele.id
    if($ele.className)$ele.className.split(" ").join(".")
    return selector
}

if(typeof module != "undefined")
    module.exports =  seletorify