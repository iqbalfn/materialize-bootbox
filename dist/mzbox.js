(function(window, $){
"use strict";
let Buttons = {
    
    alert: {
        ok: {
            label: 'OK'
        }
    },
    
    confirm: {
        cancel: {
            label: 'CANCEL'
        },
        confirm: {
            label: 'CONFIRM'
        }
    },
    
    prompt: {
        cancel: {
            label: 'CANCEL'
        },
        confirm: {
            label: 'CONFIRM'
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
    }
    
};
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
/**
 * The box manager
 * @param object options
 * @return this
 */
let Box = function(options){
    this.action   = null;
    this.element  = null;
    this.instance = null;
    this.input    = null;
    this.options  = options;
    
    for(let opt in Options){
        if(!options.hasOwnProperty(opt))
            options[opt] = Options[opt];
    }
    
    let modal = this.buildHTML();
    let mopts = this.buildMOptions();
    
    this.instance = new M.Modal(modal, mopts);
    this.instance.open();
}

Box.prototype.close = function(){
    this.instance.close();
}

Box.prototype.buildHTML = function(){
    let options = this.options;
    let $this   = this;
    let onDone  = null;
    
    let modal = this.element = $('<div class="modal"></div>').appendTo(document.body);
    if(options.attrs){
        for(let attr in options.attrs){
            if(attr === 'class')
                modal.addClass(options.attrs[attr]);
            else
                modal.attr(attr, options.attrs[attr]);
        }
    }
    
    // content
    let modalContent = $('<div class="modal-content"></div>').appendTo(modal);
    
    if(options.title)
        $(`<h4>${options.title}</h4>`).appendTo(modalContent);
    if(options.message)
        $(`<p>${options.message}</p>`).appendTo(modalContent);
    if(options.input)
        onDone = $this.buildInput(modalContent);
    
    // actions
    if(options.buttons){
        let modalFooter = $('<div class="modal-footer"></div>').appendTo(modal);
        for(let name in options.buttons){
            let button = options.buttons[name];
            
            let label  = button.label;
            if(Translation[options.locale] && Translation[options.locale][label])
                label = Translation[options.locale][label];
            
            let abtn = $(`<a href="#!" data-name="${name}" class="modal-action modal-close waves-effect btn-flat">${label}</a>`).appendTo(modalFooter);
            if(!button.attrs)
                button.attrs = {};
            if(!button.attrs.class)
                button.attrs.class = name != 'cancel' ? 'waves-green' : 'waves-red';
            abtn.addClass(button.attrs.class);
            
            abtn.one('click', function(){ $this.action = $(this); });
        }
    }
    
    if(onDone)
        onDone();
    
    return modal.get(0);
}

Box.prototype.buildInput = function(parent){
    let $this = this;
    let input = this.options.input;
    if(!input)
        return;
    
    let mfOpts = input.instance || {};
    
    input.id = ID.get('modal-input-');
    if(!input.type)
        input.type = 'text';
    
    let callback = null;
    let iField;
    let iText;
    let iTexts = [];
    let iValues = [];
    
    switch(input.type){
        case 'checkbox':
        case 'radio':
            iField  = $('<div class="checkbox-field"></div>').appendTo(parent);
            iValues = $.isArray(input.value) ? input.value : [input.value];
            input.options.forEach(e => {
                let iOCont  = $('<div></div>').appendTo(iField);
                let iTLabel = $('<label></label>').appendTo(iOCont);
                iText = $(`<input type="${input.type}" name="${input.id}" value="${e.value}">`).appendTo(iTLabel);
                $(`<span>${e.text}</span>`).appendTo(iTLabel);
                
                if(input.type == 'radio' && input.value == e.value)
                    iText.prop('checked', true);
                else if(input.type == 'checkbox' && ~iValues.indexOf(e.value))
                    iText.prop('checked', true);
                
                iTexts.push(iText);
            });
            this.input = iTexts;
            break;
        
        case 'slider':
            iText = $(`<div id="${input.id}"></div>`).appendTo(parent);
            noUiSlider.create(iText.get(0), mfOpts);
            this.input = iText;
            break;
            
        // TODO
        // - Materialize don't handle this new created element.
        case 'range':
            iField = $('<div class="range-field"></div>').appendTo(parent);
            iText  = $(`<input type="range" id="${input.id}">`).appendTo(iField);
            
            if(input.attrs){
                for(let name in input.attrs){
                    let value = input.attrs[name];
                    
                    if(name == 'class')
                        iText.addClass(value);
                    else
                        iText.attr(name, value);
                }
            }
            this.input = iText;
            break;
        
        default:
            iField = $('<div class="input-field"></div>').appendTo(parent);
            
            switch(input.type){
                case 'textarea':
                    iText = $(`<textarea class="materialize-textarea" id="${input.id}"></textarea>`).appendTo(iField);
                    
                    if(input.value)
                        iText.val(input.value);
                    
                    callback = function(iText){
                        return function(){
                            setTimeout(() => {
                                iText.trigger('autoresize');
                            }, 100);
                        }
                    }(iText);
                    
                    break;
                    
                case 'select':
                    iText = $('<select></select>').appendTo(iField);
                    
                    if(input.attrs && input.attrs.multiple)
                        iText.prop('multiple', true);
                    
                    if(input.label){
                        let iAttr = 'disabled';
                        if(!input.value)
                            iAttr+= ' selected';
                        iText.append(`<option value="" ${iAttr}>${input.label}</option>`);
                    }
                    
                    if(input.options){
                        let iGroups = {};
                        iValues = $.isArray(input.value) ? input.value : [input.value];
                        
                        input.options.forEach(e => {
                            let iOpt = $(`<option value="${e.value}">${e.text}</option>`);
                            if(~iValues.indexOf(e.value))
                                iOpt.attr('selected', 'selected');
                            
                            if(e.icon){
                                iText.addClass('icons');
                                iOpt.attr('data-icon', e.icon);
                            }
                            
                            if(!e.group)
                                iText.append(iOpt);
                            else{
                                if(!iGroups[e.group])
                                    iGroups[e.group] = $(`<optgroup label="${e.group}"></optgroup>`).appendTo(iText);
                                iGroups[e.group].append(iOpt);
                            }
                        });
                    }
                    
                    callback = function(iText, mfOpts){
                        return function(){
                            setTimeout(() => {
                                iText.data('instance', new M.Select(iText.get(0), mfOpts));
                            }, 100);
                        }
                    }(iText, mfOpts);
                    
                    break;
                
                default:
                    iText = $(`<input type="${input.type}" id="${input.id}">`).appendTo(iField);
                    
                    if(~['email', 'url'].indexOf(input.type)){
                        iText.addClass('validate');
                        iField.append('<span class="helper-text" data-error="Invalid value"></span>');
                    }
                    
                    if(input.options){
                        let iOpts = {};
                        
                        input.options.forEach(e => {
                            iOpts[e.text] = null;
                        });
                        
                        mfOpts.data = iOpts;
                        
                        iText.data('instance', new M.Autocomplete(iText.get(0), mfOpts));
                    }
                    
                    if(input.value)
                        iText.val(input.value);
            }
            
            if(input.label)
                iField.append(`<label for="${input.id}">${input.label}</label>`);
            
            if(input.attrs){
                for(let name in input.attrs){
                    let value = input.attrs[name];
                    
                    if(name == 'class')
                        iText.addClass(value);
                    else
                        iText.attr(name, value);
                }
            }
            
            this.input = iText;
    }
    
    return callback;
}

Box.prototype.buildMOptions = function(){
    let result  = {};
    let options = this.options;
    let $this   = this;
    
    result.dismissible = options.dismissible;
    
    if(!options.animate)
        result.inDuration = result.outDuration = 0;
    
    result.ready = function(){
        if(options.init)
            options.init();
        if($this.input && $this.input.get)
            $this.input.get(0).focus();
    };
    
    result.complete = function(){
        let param = undefined;
        
        if(options.callback){
            if(!$this.action)
                options.callback();
            else{
                let btnName = $this.action.data('name');
                let buttons = options.buttons[btnName];
                
                if(buttons.callback)
                    buttons.callback();
                
                if(btnName !== 'confirm'){
                    options.callback(btnName=='cancel'?false:undefined);
                }else{
                    if(!$this.input)
                        options.callback(true);
                    else{
                        let value = '';
                        switch(options.input.type){
                            case 'checkbox':
                                value = [];
                                $this.input.forEach(e => {
                                    if(e.prop('checked'))
                                        value.push(e.val());
                                });
                                break;
                                
                            case 'radio':
                                $this.input.forEach(e => {
                                    if(e.prop('checked'))
                                        value = e.val();
                                });
                                break;
                                
                            case 'slider':
                                value = $this.input.get(0).noUiSlider.get();
                                break;
                                
                            default:
                                value = $this.input.val();
                                if(options.input.type == 'select'){
                                    if($.isArray(value) && value[0] == '')
                                        value.splice(0,1);
                                }
                        }
                        if(!value)
                            value = '';
                        options.callback(value);
                    }
                }
            }
        }
        
        $this.element.remove();
    };
    
    return result;
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