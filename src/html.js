let H = selector => {
    return document.querySelector(selector)
}

H.body = document.body

H.append = (parent, child) => {
    return parent.appendChild(child)
}

H.attr = (el, attrs) => {
    for(let k in attrs){
        let atrs = attrs[k]
        
        if(Array.isArray(atrs))
            atrs = atrs.join(' ')

        if(typeof atrs === 'object'){
            for(let l in atrs)
                H.setAttr(el, k+'-'+l, atrs[l])
        }else{
            H.setAttr(el, k, atrs)
        }
    }
}

H.create = (attrs, tag, text) => {
    if(typeof attrs === 'string')
        attrs = {class: attrs}
    if(!tag)
        tag = 'div'

    let el = document.createElement(tag)
    
    if(attrs)
        H.attr(el, attrs)

    if(text)
        el.innerText = text

    return el;
}

H.input = attrs => {
    let el = H.create(attrs, 'input')
    if(attrs.value)
        el.value = attrs.value

    return el
}

H.isArray = (cond, alt) => {
    return Array.isArray(cond) ? cond : alt
}

H.optgroup = label => {
    return H.create({label}, 'optgroup')
}

H.plain = text => {
    return document.createTextNode(text)
}

H.setAttr = (el, name, value) => {
    if(name === 'class'){
        value = value.split(' ')
        value.forEach(cls => el.classList.add(cls))
    }else{
        el.setAttribute(name, value)
    }
}

H.span = (text, attrs) => {
    return H.create(attrs, 'span', text)
}

H.text = (text, tag) => {
    if(!tag)
        tag = 'p'
    if(typeof tag === 'number')
        tag = 'h' + tag

    let el = H.create(0, tag)
    el.innerText = text

    return el
}

H.trigger = (target, event) => {
    const evn = new Event(event)
    target.dispatchEvent(evn)
}