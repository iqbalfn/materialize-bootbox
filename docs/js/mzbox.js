/*!
 * Materialize Bootbox v1.0.0 (https://materialize-bootbox.js.org/)
 * Copyright 2017-2020 Iqbal Fauzi
 * MIT License (https://raw.githubusercontent.com/iqbalfn/materialize-bootbox/master/LICENSE)
 */
(function(window, $){
"use strict";
let Buttons = {
    
    alert: {
        ok: {
            label: 'OK',
            default: true
        }
    },
    
    confirm: {
        cancel: {
            label: 'CANCEL'
        },
        confirm: {
            label: 'CONFIRM',
            default: true
        }
    },
    
    prompt: {
        cancel: {
            label: 'CANCEL'
        },
        confirm: {
            label: 'CONFIRM',
            default: true
        }
    }
    
};
let Options = {
    
    /**
     * Show animation on show/hide modal.
     * @var boolean
     */
    animate: true,
    
    /**
     * Additional modal attribute.
     * @var object
     */
    attrs: null,
    
    /**
     * Modal buttons
     * @var object
     */
    buttons: null,
    
    /**
     * On close modal callback
     * @var function 
     */
    callback: null,
    
    /**
     * Allow modal to close by keyboard or clicking backdrop
     * @var boolean
     */
    dismissible: true,
    
    /**
     * Input options for prompt
     * @var object
     */
    input: null,
    
    /**
     * Language to use
     * @var string
     */
    locale: 'en',
    
    /**
     * Default modal message
     * @var string
     */
    message: '',
    
    /**
     * Default modal title
     * @var string
     */
    title: ''
};
let Translation = {
    
    en: {
        OK: 'Ok',
        CONFIRM: 'Confirm',
        CANCEL: 'Cancel'
    },
    
    id: {
        OK: 'Oke',
        CONFIRM: 'Setuju',
        CANCEL: 'Batal'
    },
    
    fa: {
        OK: 'باشه',
        CONFIRM: 'تایید',
        CANCEL: 'لغو'
    }
    
}
;
let ID = {};

ID.index = 0;

ID.get = function(prefix){
    return (prefix||'') + (ID.index++);
};
let getArgs = function(rule, args){
    if(typeof args[0] === 'object')
        return args[0];
    
    let rules = {
        alert  : [
            { type: 'string',   negation: false, param: 'message'   },
            { type: 'string',   negation: false, param: 'title'     },
            { type: 'function', negation: false, param: 'callback'  }
        ],
        confirm: [
            { type: 'string',   negation: false, param: 'message'   },
            { type: 'string',   negation: false, param: 'title'     },
            { type: 'function', negation: false, param: 'callback'  }
        ],
        prompt : [
            { type: 'string',   negation: false, param: 'message'   },
            { type: 'string',   negation: false, param: 'title'     },
            { type: 'function', negation: true , param: 'value'     },
            { type: 'function', negation: false, param: 'callback'  }
        ]
    };
    
    let urules = rules[rule];
    let result = {};
    
    args.forEach(arg => {
        if(!urules.length)
            return;
        
        let rule;
        let type = typeof arg;
        
        while(rule = urules.shift()){
            if(!rule)
                break;
            
            if(rule.negation && rule.type == type)
                continue;
            
            if(!rule.negation && rule.type != type)
                continue;
            
            result[rule.param] = arg;
            break;
        }
    });
    
    return result;
};
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
};
/**
 * The box manager
 * @param object options
 * @return this
 */
let Box = function(options){
    this.action   = null
    this.element  = null
    this.instance = null
    this.input    = null
    this.options  = options
    this.buttons  = []
    
    for(let opt in Options){
        if(!options.hasOwnProperty(opt))
            options[opt] = Options[opt]
    }
    
    let modal = this.buildHTML()
    let mopts = this.buildMOptions()
    
    this.instance = M.Modal.init(modal, mopts)
    this.instance.open()
}

Box.prototype.close = function(){
    this.instance.close()
}

Box.prototype.buildHTML = function(){
    let options = this.options
    let $this   = this
    let onDone  = null
    
    let modal = this.element = H.append(H.body, H.create('modal'))
    if(options.attrs)
        H.attr(modal, options.attrs)

    // content
    let modalContent = H.append(modal, H.create('modal-content'))
    
    if(options.title)
        H.append(modalContent, H.text(options.title, 4))
    if(options.message){
        let msg = options.message
        if(!(options.message instanceof HTMLElement))
            msg = H.text(options.message)
        H.append(modalContent, msg)
    }
    if(options.input)
        onDone = $this.buildInput(modalContent)
    
    // actions
    if(options.buttons){
        let modalFooter = H.append(modal, H.create('modal-footer'))
        for(let name in options.buttons){
            let button = options.buttons[name]
            
            let label  = button.label
            let locale = options.locale
            if(Translation[locale] && Translation[locale][label])
                label = Translation[locale][label]
            
            let abtnAtrs = {
                href  : '#!',
                class : 'modal-action modal-close waves-effect btn-flat',
                data  : {name}
            }
            let abtn = H.append(modalFooter, H.create(abtnAtrs, 'a', label))
            if(!button.attrs)
                button.attrs = {}
            if(!button.attrs.class){
                let btnCls = name != 'cancel' ? 'green' : 'red'
                button.attrs.class = 'waves-' + btnCls
            }
            abtn.classList.add(button.attrs.class)
            
            abtn.addEventListener('click', function(){
                $this.action = this
            }, false)

            if(button.default)
                abtn.dataset.default = true
            
            $this.buttons.push(abtn)
        }
    }
    
    if(onDone)
        onDone()
    
    return modal
}

Box.prototype.buildInput = function(parent){
    let $this = this
    let input = this.options.input
    if(!input)
        return
    
    let mfOpts = input.instance || {}
    
    input.id = ID.get('modal-input-')
    if(!input.type)
        input.type = 'text'
    
    let callback = null
    let iField
    let iText
    let iTexts = []
    let iTAttrs
    let iTLabel
    let iValues = []
    
    switch(input.type){
        case 'checkbox':
        case 'radio':
            iField  = H.append(parent, H.create('checkbox-field'))
            iValues = H.isArray(input.value, [input.value])

            let iTClass = input.type === 'radio' ? 'with-gap' : 'filled-in'

            input.options.forEach(e => {
                let iOCont  = H.append(iField, H.create())
                iTLabel = H.append(iOCont, H.create(0, 'label'))
                iTAttrs = {
                    type : input.type,
                    name : input.id,
                    value: e.value,
                    class: iTClass
                }

                if(input.type == 'radio' && input.value == e.value)
                    iTAttrs.checked = 'checked'
                else if(input.type == 'checkbox' && ~iValues.indexOf(e.value))
                    iTAttrs.checked = 'checked'

                iText = H.append(iTLabel, H.input(iTAttrs))
                H.append(iTLabel, H.span(e.text))

                iTexts.push(iText)
            })
            this.input = iTexts

            break
            
        case 'range':
            iTAttrs =  {
                id   : input.id,
                type : 'range',
                value: input.value || 0
            }

            iField  = H.append(parent, H.create('range-field'))
            iText   = H.append(iField, H.input(iTAttrs))

            if(input.attrs)
                H.attr(iText, input.attrs)

            callback = function(iText){
                return function(){
                    setTimeout(() => M.Range.init(iText), 100)
                }
            }(iText)

            this.input = iText

            break
        
        case 'slider':
            iText = H.append(parent, H.create({id:input.id}))
            noUiSlider.create(iText, mfOpts)
            this.input = iText

            break

        case 'switch':
            iField  = H.append(parent, H.create('switch'))
            iTLabel = H.append(iField, H.create(0, 'label'))

            if(!input.text)
                input.text = {}

            if(input.text.before)
                H.append(iTLabel, H.plain(input.text.before))

            iText = H.append(iTLabel, H.input({type:'checkbox'}))
            if(input.attrs)
                H.attr(iText, input.attrs)

            H.append(iTLabel, H.create('lever', 'span'))

            if(input.text.after)
                H.append(iTLabel, H.plain(input.text.after))

            this.input = iText

            break
        
        default:
            iField = H.append(parent, H.create('input-field'))
            
            iTAttrs = {}

            switch(input.type){
                case 'textarea':
                    iTAttrs = {
                        class: 'materialize-textarea',
                        id   : input.id
                    }
                    iText = H.append(iField, H.create(iTAttrs, 'textarea'))

                    if(input.value)
                        iText.value = input.value
                    
                    callback = function(iText){
                        return function(){
                            setTimeout(() => M.textareaAutoResize(iText), 100)
                        }
                    }(iText)
                    
                    break
                    
                case 'select':
                    iTAttrs = {}
                    if(input.attrs && input.attrs.multiple)
                        iTAttrs.multiple = 'multiple'

                    iText = H.append(iField, H.create(iTAttrs, 'select'))
                    
                    if(input.label){
                        let plAtt = {disabled:'disabled'}
                        if(!input.value)
                            plAtt.selected = 'selected'

                        H.append(iText, H.create(plAtt, 'option', input.label))
                    }
                    
                    if(input.options){
                        let iGroups = {}
                        if(!input.value)
                            input.value = []
                        iValues = H.isArray(input.value, [input.value])
                        
                        input.options.forEach(e => {
                            let iOpAtt = {value:e.value}
                            
                            if(~iValues.indexOf(e.value))
                                iOpAtt.selected = 'selected'

                            if(e.icon){
                                iText.classList.add('icons')
                                iOpAtt.data = {icon: e.icon}
                            }

                            let iOpt = H.create(iOpAtt, 'option', e.text)

                            if(!e.group)
                                H.append(iText, iOpt)
                            else{
                                if(!iGroups[e.group]){
                                    let iGr = H.optgroup(e.group)
                                    H.append(iText, iGr)
                                    iGroups[e.group] = iGr
                                }
                                H.append(iGroups[e.group], iOpt)
                            }
                        })
                    }
                    
                    callback = function(iText, mfOpts){
                        return function(){
                            setTimeout(() => {
                                M.FormSelect.init(iText, mfOpts)
                            }, 100)
                        }
                    }(iText, mfOpts)
                    
                    break
                
                default:
                    let iAttr = {type:input.type,id:input.id}
                    iText = H.append(iField, H.input(iAttr))

                    if(~['email', 'url'].indexOf(input.type)){
                        iText.classList.add('validate')
                        let spnAttr = {
                            class: 'helper-text',
                            data : {error:'Invalid value'}
                        }
                        H.append(iField, H.create(spnAttr, 'span'))
                    }
                    
                    if(input.options){
                        let iOpts = {}
                        
                        input.options.forEach(e => {
                            iOpts[e.text] = null
                        })
                        
                        mfOpts.data = iOpts
                        mfOpts.onAutocomplete = function(){
                            iText.dataset.efac = true
                            if(input.instance && input.instance.onAutocomplete)
                                input.instance.onAutocomplete()
                        }
                        
                        let mAuto = new M.Autocomplete(iText, mfOpts)
                        iText.dataset.instance =mAuto
                    }
                    
                    if(input.value)
                        iText.value = input.value
                    
                    iText.addEventListener('keyup', e => {
                        if(e.keyCode != 13)
                            return
                        
                        if(input.options){
                            if(iText.dataset.efac)
                                return (iText.dataset.efac = false)
                        }
                        
                        $this.buttons.forEach(btn => {
                            if(btn.dataset.default)
                                btn.click()
                        })
                    }, false)
            }
            
            if(input.label)
                H.append(iField, H.create({for:input.id}, 'label', input.label))
            
            if(input.attrs)
                H.attr(iText, input.attrs)

            this.input = iText
    }
    
    return callback
}

Box.prototype.buildMOptions = function(){
    let result  = {}
    let options = this.options
    let $this   = this
    
    result.dismissible = options.dismissible
    
    if(!options.animate)
        result.inDuration = result.outDuration = 0
    
    result.onOpenEnd = function(){
        if(options.init)
            options.init()
        
        if($this.input && $this.input.focus)
            $this.input.focus()
        else{
            $this.buttons.forEach(btn => {
                if(btn.dataset.default)
                    btn.focus()
            })
        }
    }
    
    result.onCloseEnd = function(){
        let param = undefined
        
        if(options.callback){
            if(!$this.action)
                options.callback()
            else{
                let btnName = $this.action.dataset.name
                let button  = options.buttons[btnName]
                
                if(button.callback)
                    button.callback()
                
                if(btnName !== 'confirm'){
                    options.callback(btnName=='cancel' ? false : undefined)
                }else{
                    if(!$this.input)
                        options.callback(true)
                    else{
                        let value = ''
                        switch(options.input.type){
                            case 'checkbox':
                                value = []
                                $this.input.forEach(e => {
                                    if(e.checked)
                                        value.push(e.value)
                                })
                                break
                                
                            case 'radio':
                                $this.input.forEach(e => {
                                    if(e.checked)
                                        value = e.value
                                })
                                break

                            case 'select':
                                if( $this.input.getAttribute('multiple') ){
                                    let instance = M.FormSelect.getInstance($this.input)
                                    value = instance.getSelectedValues()
                                }else{
                                    value = $this.input.value
                                }
                                break
                                
                            case 'slider':
                                value = $this.input.noUiSlider.get()
                                break

                            case 'switch':
                                value = $this.input.checked ? 1 : 0
                                break
                                
                            default:
                                value = $this.input.value
                                if(options.input.type == 'select'){
                                    if(Array.isArray(value) && value[0] == '')
                                        value.splice(0,1)
                                }
                        }
                        if(!value)
                            value = ''
                        options.callback(value)
                    }
                }
            }
        }
        
        $this.element.remove()
    }
    
    return result
};
let mzbox = {};

/**
 * Add new locale
 * @param string name Locale name
 * @param object translation Translation object
 * @return object mzbox
 */
mzbox.addLocale = function(name, translation){
    Translation[name] = translation;
    return mzbox;
}

/**
 * Alert box
 * @param object options
 * 
 * @param string message
 * @param string title
 * @param function callback
 * 
 * @return object Box;
 */
mzbox.alert = function(message, title, callback){
    let options = getArgs('alert', [message, title, callback]);
    options.buttons = Buttons.alert;
    options.input   = null;
    return mzbox.dialog(options);
}

/**
 * Confirm box
 * @param object options
 * 
 * @param string message
 * @param string title
 * @param function callback
 * 
 * @return object Box;
 */
mzbox.confirm = function(message, title, callback){
    let options = getArgs('confirm', [message, title, callback]);
    options.buttons = Buttons.confirm;
    options.input   = null;
    return mzbox.dialog(options);
}

/**
 * Dialog box
 * @param object options
 * @return object Box;
 */
mzbox.dialog = function(options){
    return new Box(options);
}

/**
 * Prompt box
 * @param object options
 * 
 * @param string message
 * @param string title
 * @param mixed value
 * @param function callback
 * 
 * @return object Box;
 */
mzbox.prompt = function(message, title, value, callback){
    let options = getArgs('prompt', [message, title, value, callback]);
    options.buttons = Buttons.prompt;
    
    if(!options.input)
        options.input = { type: 'text' };
    
    if(options.value && !options.input.value)
        options.input.value = options.value;
    
    return mzbox.dialog(options);
}

/**
 * Remove exists translation
 * @param string name Translation name
 * @return object mzbox
 */
mzbox.removeLocale = function(name){
    if(Translation[name])
        delete Translation[name];
    return mzbox;
}

/**
 * Set default options
 * @param object options key-value pair of the functions
 * @return object mzbox
 */
mzbox.setDefaults = function(options){
    for(let name in Options){
        if(options.hasOwnProperty(name))
            Options[name] = options[name];
    }
    
    return mzbox;
}

/**
 * Set default locale
 * @param string name The locale to use
 * @return object mzbox
 */
mzbox.setLocale = function(name){
    if(!Translation[name])
        throw new Error(`Translation named ${name} not exists.`);
    Options.locale = name;
    
    return mzbox;
}

window.mzbox = mzbox;
})(window, cash);