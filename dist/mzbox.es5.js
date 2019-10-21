'use strict';var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};(function(window,$){'use strict';var Buttons={alert:{ok:{label:'OK',default:true}},confirm:{cancel:{label:'CANCEL'},confirm:{label:'CONFIRM',default:true}},prompt:{cancel:{label:'CANCEL'},confirm:{label:'CONFIRM',default:true}}};var Options={/**
     * Show animation on show/hide modal.
     * @var boolean
     */animate:true,/**
     * Additional modal attribute.
     * @var object
     */attrs:null,/**
     * Modal buttons
     * @var object
     */buttons:null,/**
     * On close modal callback
     * @var function 
     */callback:null,/**
     * Allow modal to close by keyboard or clicking backdrop
     * @var boolean
     */dismissible:true,/**
     * Input options for prompt
     * @var object
     */input:null,/**
     * Language to use
     * @var string
     */locale:'en',/**
     * Default modal message
     * @var string
     */message:'',/**
     * Default modal title
     * @var string
     */title:''};var Translation={en:{OK:'Ok',CONFIRM:'Confirm',CANCEL:'Cancel'},id:{OK:'Oke',CONFIRM:'Setuju',CANCEL:'Batal'},fa:{OK:"باشه",CONFIRM:"تایید",CANCEL:"لغو"}};var ID={};ID.index=0;ID.get=function(prefix){return(prefix||'')+ID.index++};var getArgs=function getArgs(rule,args){if(_typeof(args[0])==='object')return args[0];var rules={alert:[{type:'string',negation:false,param:'message'},{type:'string',negation:false,param:'title'},{type:'function',negation:false,param:'callback'}],confirm:[{type:'string',negation:false,param:'message'},{type:'string',negation:false,param:'title'},{type:'function',negation:false,param:'callback'}],prompt:[{type:'string',negation:false,param:'message'},{type:'string',negation:false,param:'title'},{type:'function',negation:true,param:'value'},{type:'function',negation:false,param:'callback'}]};var urules=rules[rule];var result={};args.forEach(function(arg){if(!urules.length)return;var rule=void 0;var type=typeof arg==='undefined'?'undefined':_typeof(arg);while(rule=urules.shift()){if(!rule)break;if(rule.negation&&rule.type==type)continue;if(!rule.negation&&rule.type!=type)continue;result[rule.param]=arg;break}});return result};/**
 * The box manager
 * @param object options
 * @return this
 */var Box=function Box(options){this.action=null;this.element=null;this.instance=null;this.input=null;this.options=options;this.buttons=[];for(var opt in Options){if(!options.hasOwnProperty(opt))options[opt]=Options[opt]}var modal=this.buildHTML();var mopts=this.buildMOptions();this.instance=new M.Modal(modal,mopts);this.instance.open()};Box.prototype.close=function(){this.instance.close()};Box.prototype.buildHTML=function(){var options=this.options;var $this=this;var onDone=null;var modal=this.element=$('<div class="modal"></div>').appendTo(document.body);if(options.attrs){for(var attr in options.attrs){if(attr==='class')modal.addClass(options.attrs[attr]);else modal.attr(attr,options.attrs[attr])}}// content
var modalContent=$('<div class="modal-content"></div>').appendTo(modal);if(options.title)$('<h4>'+options.title+'</h4>').appendTo(modalContent);if(options.message)$('<p>'+options.message+'</p>').appendTo(modalContent);if(options.input)onDone=$this.buildInput(modalContent);// actions
if(options.buttons){var modalFooter=$('<div class="modal-footer"></div>').appendTo(modal);for(var name in options.buttons){var button=options.buttons[name];var label=button.label;if(Translation[options.locale]&&Translation[options.locale][label])label=Translation[options.locale][label];var abtn=$('<a href="#!" data-name="'+name+'" class="modal-action modal-close waves-effect btn-flat">'+label+'</a>').appendTo(modalFooter);if(!button.attrs)button.attrs={};if(!button.attrs.class)button.attrs.class=name!='cancel'?'waves-green':'waves-red';abtn.addClass(button.attrs.class);abtn.one('click',function(){$this.action=$(this)});if(button.default)abtn.data('default',true);$this.buttons.push(abtn)}}if(onDone)onDone();return modal.get(0)};Box.prototype.buildInput=function(parent){var $this=this;var input=this.options.input;if(!input)return;var mfOpts=input.instance||{};input.id=ID.get('modal-input-');if(!input.type)input.type='text';var callback=null;var iField=void 0;var iText=void 0;var iTexts=[];var iValues=[];switch(input.type){case'checkbox':case'radio':iField=$('<div class="checkbox-field"></div>').appendTo(parent);iValues=$.isArray(input.value)?input.value:[input.value];input.options.forEach(function(e){var iOCont=$('<div></div>').appendTo(iField);var iTLabel=$('<label></label>').appendTo(iOCont);iText=$('<input type="'+input.type+'" name="'+input.id+'" value="'+e.value+'">').appendTo(iTLabel);$('<span>'+e.text+'</span>').appendTo(iTLabel);if(input.type=='radio'&&input.value==e.value)iText.prop('checked',true);else if(input.type=='checkbox'&&~iValues.indexOf(e.value))iText.prop('checked',true);iTexts.push(iText)});this.input=iTexts;break;case'slider':iText=$('<div id="'+input.id+'"></div>').appendTo(parent);noUiSlider.create(iText.get(0),mfOpts);this.input=iText;break;// TODO
// - Materialize don't handle this new created element.
case'range':iField=$('<div class="range-field"></div>').appendTo(parent);iText=$('<input type="range" id="'+input.id+'">').appendTo(iField);if(input.attrs){for(var name in input.attrs){var value=input.attrs[name];if(name=='class')iText.addClass(value);else iText.attr(name,value)}}this.input=iText;break;default:iField=$('<div class="input-field"></div>').appendTo(parent);switch(input.type){case'textarea':iText=$('<textarea class="materialize-textarea" id="'+input.id+'"></textarea>').appendTo(iField);if(input.value)iText.val(input.value);callback=function(iText){return function(){setTimeout(function(){iText.trigger('autoresize')},100)}}(iText);break;case'select':iText=$('<select></select>').appendTo(iField);if(input.attrs&&input.attrs.multiple)iText.prop('multiple',true);if(input.label){var iAttr='disabled';if(!input.value)iAttr+=' selected';iText.append('<option value="" '+iAttr+'>'+input.label+'</option>')}if(input.options){var iGroups={};iValues=$.isArray(input.value)?input.value:[input.value];input.options.forEach(function(e){var iOpt=$('<option value="'+e.value+'">'+e.text+'</option>');if(~iValues.indexOf(e.value))iOpt.attr('selected','selected');if(e.icon){iText.addClass('icons');iOpt.attr('data-icon',e.icon)}if(!e.group)iText.append(iOpt);else{if(!iGroups[e.group])iGroups[e.group]=$('<optgroup label="'+e.group+'"></optgroup>').appendTo(iText);iGroups[e.group].append(iOpt)}})}callback=function(iText,mfOpts){return function(){setTimeout(function(){iText.data('instance',new M.Select(iText.get(0),mfOpts))},100)}}(iText,mfOpts);break;default:iText=$('<input type="'+input.type+'" id="'+input.id+'">').appendTo(iField);if(~['email','url'].indexOf(input.type)){iText.addClass('validate');iField.append('<span class="helper-text" data-error="Invalid value"></span>')}if(input.options){var iOpts={};input.options.forEach(function(e){iOpts[e.text]=null});mfOpts.data=iOpts;mfOpts.onAutocomplete=function(){iText.data('efac',true);if(input.instance&&input.instance.onAutocomplete)input.instance.onAutocomplete()};iText.data('instance',new M.Autocomplete(iText.get(0),mfOpts))}if(input.value)iText.val(input.value);iText.on('keyup',function(e){if(e.keyCode!=13)return;if(input.options){if(iText.data('efac'))return iText.data('efac',false)}$this.buttons.forEach(function(btn){if(btn.data('default'))btn.get(0).click()})});}if(input.label)iField.append('<label for="'+input.id+'">'+input.label+'</label>');if(input.attrs){for(var _name in input.attrs){var _value=input.attrs[_name];if(_name=='class')iText.addClass(_value);else iText.attr(_name,_value)}}this.input=iText;}return callback};Box.prototype.buildMOptions=function(){var result={};var options=this.options;var $this=this;result.dismissible=options.dismissible;if(!options.animate)result.inDuration=result.outDuration=0;result.ready=function(){if(options.init)options.init();if($this.input&&$this.input.get)$this.input.get(0).focus();else{$this.buttons.forEach(function(btn){if(btn.data('default'))btn.get(0).focus()})}};result.complete=function(){var param=undefined;if(options.callback){if(!$this.action)options.callback();else{var btnName=$this.action.data('name');var buttons=options.buttons[btnName];if(buttons.callback)buttons.callback();if(btnName!=='confirm'){options.callback(btnName=='cancel'?false:undefined)}else{if(!$this.input)options.callback(true);else{var value='';switch(options.input.type){case'checkbox':value=[];$this.input.forEach(function(e){if(e.prop('checked'))value.push(e.val())});break;case'radio':$this.input.forEach(function(e){if(e.prop('checked'))value=e.val()});break;case'slider':value=$this.input.get(0).noUiSlider.get();break;default:value=$this.input.val();if(options.input.type=='select'){if($.isArray(value)&&value[0]=='')value.splice(0,1)}}if(!value)value='';options.callback(value)}}}}$this.element.remove()};return result};var mzbox={};/**
 * Add new locale
 * @param string name Locale name
 * @param object translation Translation object
 * @return object mzbox
 */mzbox.addLocale=function(name,translation){Translation[name]=translation;return mzbox};/**
 * Alert box
 * @param object options
 * 
 * @param string message
 * @param string title
 * @param function callback
 * 
 * @return object Box;
 */mzbox.alert=function(message,title,callback){var options=getArgs('alert',[message,title,callback]);options.buttons=Buttons.alert;options.input=null;return mzbox.dialog(options)};/**
 * Confirm box
 * @param object options
 * 
 * @param string message
 * @param string title
 * @param function callback
 * 
 * @return object Box;
 */mzbox.confirm=function(message,title,callback){var options=getArgs('confirm',[message,title,callback]);options.buttons=Buttons.confirm;options.input=null;return mzbox.dialog(options)};/**
 * Dialog box
 * @param object options
 * @return object Box;
 */mzbox.dialog=function(options){return new Box(options)};/**
 * Prompt box
 * @param object options
 * 
 * @param string message
 * @param string title
 * @param mixed value
 * @param function callback
 * 
 * @return object Box;
 */mzbox.prompt=function(message,title,value,callback){var options=getArgs('prompt',[message,title,value,callback]);options.buttons=Buttons.prompt;if(!options.input)options.input={type:'text'};if(options.value&&!options.input.value)options.input.value=options.value;return mzbox.dialog(options)};/**
 * Remove exists translation
 * @param string name Translation name
 * @return object mzbox
 */mzbox.removeLocale=function(name){if(Translation[name])delete Translation[name];return mzbox};/**
 * Set default options
 * @param object options key-value pair of the functions
 * @return object mzbox
 */mzbox.setDefaults=function(options){for(var name in Options){if(options.hasOwnProperty(name))Options[name]=options[name]}return mzbox};/**
 * Set default locale
 * @param string name The locale to use
 * @return object mzbox
 */mzbox.setLocale=function(name){if(!Translation[name])throw new Error('Translation named '+name+' not exists.');Options.locale=name;return mzbox};window.mzbox=mzbox})(window,cash);
