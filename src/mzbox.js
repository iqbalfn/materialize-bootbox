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