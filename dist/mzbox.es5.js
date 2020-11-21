"use strict";function _typeof(obj){"@babel/helpers - typeof";if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj}}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj}}return _typeof(obj)}(function(window,$){"use strict";var Buttons={alert:{ok:{label:"OK","default":true}},confirm:{cancel:{label:"CANCEL"},confirm:{label:"CONFIRM","default":true}},prompt:{cancel:{label:"CANCEL"},confirm:{label:"CONFIRM","default":true}}};var Options={/**
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
     */locale:"en",/**
     * Default modal message
     * @var string
     */message:"",/**
     * Default modal title
     * @var string
     */title:""};var Translation={en:{OK:"Ok",CONFIRM:"Confirm",CANCEL:"Cancel"},id:{OK:"Oke",CONFIRM:"Setuju",CANCEL:"Batal"},fa:{OK:"\u0628\u0627\u0634\u0647",CONFIRM:"\u062A\u0627\u06CC\u06CC\u062F",CANCEL:"\u0644\u063A\u0648"}};var ID={};ID.index=0;ID.get=function(prefix){return(prefix||"")+ID.index++};var getArgs=function getArgs(rule,args){if(_typeof(args[0])==="object")return args[0];var rules={alert:[{type:"string",negation:false,param:"message"},{type:"string",negation:false,param:"title"},{type:"function",negation:false,param:"callback"}],confirm:[{type:"string",negation:false,param:"message"},{type:"string",negation:false,param:"title"},{type:"function",negation:false,param:"callback"}],prompt:[{type:"string",negation:false,param:"message"},{type:"string",negation:false,param:"title"},{type:"function",negation:true,param:"value"},{type:"function",negation:false,param:"callback"}]};var urules=rules[rule];var result={};args.forEach(function(arg){if(!urules.length)return;var rule;var type=_typeof(arg);while(rule=urules.shift()){if(!rule)break;if(rule.negation&&rule.type==type)continue;if(!rule.negation&&rule.type!=type)continue;result[rule.param]=arg;break}});return result};var H=function H(selector){return document.querySelector(selector)};H.body=document.body;H.append=function(parent,child){return parent.appendChild(child)};H.attr=function(el,attrs){for(var k in attrs){var atrs=attrs[k];if(Array.isArray(atrs))atrs=atrs.join(" ");if(_typeof(atrs)==="object"){for(var l in atrs){H.setAttr(el,k+"-"+l,atrs[l])}}else{H.setAttr(el,k,atrs)}}};H.create=function(attrs,tag,text){if(typeof attrs==="string")attrs={"class":attrs};if(!tag)tag="div";var el=document.createElement(tag);if(attrs)H.attr(el,attrs);if(text)el.innerText=text;return el};H.input=function(attrs){var el=H.create(attrs,"input");if(attrs.value)el.value=attrs.value;return el};H.isArray=function(cond,alt){return Array.isArray(cond)?cond:alt};H.optgroup=function(label){return H.create({label:label},"optgroup")};H.plain=function(text){return document.createTextNode(text)};H.setAttr=function(el,name,value){if(name==="class"){value=value.split(" ");value.forEach(function(cls){return el.classList.add(cls)})}else{el.setAttribute(name,value)}};H.span=function(text,attrs){return H.create(attrs,"span",text)};H.text=function(text,tag){if(!tag)tag="p";if(typeof tag==="number")tag="h"+tag;var el=H.create(0,tag);el.innerText=text;return el};H.trigger=function(target,event){var evn=new Event(event);target.dispatchEvent(evn)};/**
 * The box manager
 * @param object options
 * @return this
 */var Box=function Box(options){this.action=null;this.element=null;this.instance=null;this.input=null;this.options=options;this.buttons=[];for(var opt in Options){if(!options.hasOwnProperty(opt))options[opt]=Options[opt]}var modal=this.buildHTML();var mopts=this.buildMOptions();this.instance=M.Modal.init(modal,mopts);this.instance.open()};Box.prototype.close=function(){this.instance.close()};Box.prototype.buildHTML=function(){var options=this.options;var $this=this;var onDone=null;var modal=this.element=H.append(H.body,H.create("modal"));if(options.attrs)H.attr(modal,options.attrs);// content
var modalContent=H.append(modal,H.create("modal-content"));if(options.title)H.append(modalContent,H.text(options.title,4));if(options.message){var msg=options.message;if(!(options.message instanceof HTMLElement))msg=H.text(options.message);H.append(modalContent,msg)}if(options.input)onDone=$this.buildInput(modalContent);// actions
if(options.buttons){var modalFooter=H.append(modal,H.create("modal-footer"));for(var name in options.buttons){var button=options.buttons[name];var label=button.label;var locale=options.locale;if(Translation[locale]&&Translation[locale][label])label=Translation[locale][label];var abtnAtrs={href:"#!","class":"modal-action modal-close waves-effect btn-flat",data:{name:name}};var abtn=H.append(modalFooter,H.create(abtnAtrs,"a",label));if(!button.attrs)button.attrs={};if(!button.attrs["class"]){var btnCls=name!="cancel"?"green":"red";button.attrs["class"]="waves-"+btnCls}abtn.classList.add(button.attrs["class"]);abtn.addEventListener("click",function(){$this.action=this},false);if(button["default"])abtn.dataset["default"]=true;$this.buttons.push(abtn)}}if(onDone)onDone();return modal};Box.prototype.buildInput=function(parent){var $this=this;var input=this.options.input;if(!input)return;var mfOpts=input.instance||{};input.id=ID.get("modal-input-");if(!input.type)input.type="text";var callback=null;var iField;var iText;var iTexts=[];var iTAttrs;var iTLabel;var iValues=[];switch(input.type){case"checkbox":case"radio":iField=H.append(parent,H.create("checkbox-field"));iValues=H.isArray(input.value,[input.value]);var iTClass=input.type==="radio"?"with-gap":"filled-in";input.options.forEach(function(e){var iOCont=H.append(iField,H.create());iTLabel=H.append(iOCont,H.create(0,"label"));iTAttrs={type:input.type,name:input.id,value:e.value,"class":iTClass};if(input.type=="radio"&&input.value==e.value)iTAttrs.checked="checked";else if(input.type=="checkbox"&&~iValues.indexOf(e.value))iTAttrs.checked="checked";iText=H.append(iTLabel,H.input(iTAttrs));H.append(iTLabel,H.span(e.text));iTexts.push(iText)});this.input=iTexts;break;case"range":iTAttrs={id:input.id,type:"range",value:input.value||0};iField=H.append(parent,H.create("range-field"));iText=H.append(iField,H.input(iTAttrs));if(input.attrs)H.attr(iText,input.attrs);callback=function(iText){return function(){setTimeout(function(){return M.Range.init(iText)},100)}}(iText);this.input=iText;break;case"slider":iText=H.append(parent,H.create({id:input.id}));noUiSlider.create(iText,mfOpts);this.input=iText;break;case"switch":iField=H.append(parent,H.create("switch"));iTLabel=H.append(iField,H.create(0,"label"));if(!input.text)input.text={};if(input.text.before)H.append(iTLabel,H.plain(input.text.before));iText=H.append(iTLabel,H.input({type:"checkbox"}));if(input.attrs)H.attr(iText,input.attrs);H.append(iTLabel,H.create("lever","span"));if(input.text.after)H.append(iTLabel,H.plain(input.text.after));this.input=iText;break;default:iField=H.append(parent,H.create("input-field"));iTAttrs={};switch(input.type){case"textarea":iTAttrs={"class":"materialize-textarea",id:input.id};iText=H.append(iField,H.create(iTAttrs,"textarea"));if(input.value)iText.value=input.value;callback=function(iText){return function(){setTimeout(function(){return M.textareaAutoResize(iText)},100)}}(iText);break;case"select":iTAttrs={};if(input.attrs&&input.attrs.multiple)iTAttrs.multiple="multiple";iText=H.append(iField,H.create(iTAttrs,"select"));if(input.label){var plAtt={disabled:"disabled"};if(!input.value)plAtt.selected="selected";H.append(iText,H.create(plAtt,"option",input.label))}if(input.options){var iGroups={};if(!input.value)input.value=[];iValues=H.isArray(input.value,[input.value]);input.options.forEach(function(e){var iOpAtt={value:e.value};if(~iValues.indexOf(e.value))iOpAtt.selected="selected";if(e.icon){iText.classList.add("icons");iOpAtt.data={icon:e.icon}}var iOpt=H.create(iOpAtt,"option",e.text);if(!e.group)H.append(iText,iOpt);else{if(!iGroups[e.group]){var iGr=H.optgroup(e.group);H.append(iText,iGr);iGroups[e.group]=iGr}H.append(iGroups[e.group],iOpt)}})}callback=function(iText,mfOpts){return function(){setTimeout(function(){M.FormSelect.init(iText,mfOpts)},100)}}(iText,mfOpts);break;default:var iAttr={type:input.type,id:input.id};iText=H.append(iField,H.input(iAttr));if(~["email","url"].indexOf(input.type)){iText.classList.add("validate");var spnAttr={"class":"helper-text",data:{error:"Invalid value"}};H.append(iField,H.create(spnAttr,"span"))}if(input.options){var iOpts={};input.options.forEach(function(e){iOpts[e.text]=null});mfOpts.data=iOpts;mfOpts.onAutocomplete=function(){iText.dataset.efac=true;if(input.instance&&input.instance.onAutocomplete)input.instance.onAutocomplete()};var mAuto=new M.Autocomplete(iText,mfOpts);iText.dataset.instance=mAuto}if(input.value)iText.value=input.value;iText.addEventListener("keyup",function(e){if(e.keyCode!=13)return;if(input.options){if(iText.dataset.efac)return iText.dataset.efac=false}$this.buttons.forEach(function(btn){if(btn.dataset["default"])btn.click()})},false);}if(input.label)H.append(iField,H.create({"for":input.id},"label",input.label));if(input.attrs)H.attr(iText,input.attrs);this.input=iText;}return callback};Box.prototype.buildMOptions=function(){var result={};var options=this.options;var $this=this;result.dismissible=options.dismissible;if(!options.animate)result.inDuration=result.outDuration=0;result.onOpenEnd=function(){if(options.init)options.init();if($this.input&&$this.input.focus)$this.input.focus();else{$this.buttons.forEach(function(btn){if(btn.dataset["default"])btn.focus()})}};result.onCloseEnd=function(){var param=undefined;if(options.callback){if(!$this.action)options.callback();else{var btnName=$this.action.dataset.name;var button=options.buttons[btnName];if(button.callback)button.callback();if(btnName!=="confirm"){options.callback(btnName=="cancel"?false:undefined)}else{if(!$this.input)options.callback(true);else{var value="";switch(options.input.type){case"checkbox":value=[];$this.input.forEach(function(e){if(e.checked)value.push(e.value)});break;case"radio":$this.input.forEach(function(e){if(e.checked)value=e.value});break;case"select":if($this.input.getAttribute("multiple")){var instance=M.FormSelect.getInstance($this.input);value=instance.getSelectedValues()}else{value=$this.input.value}break;case"slider":value=$this.input.noUiSlider.get();break;case"switch":value=$this.input.checked?1:0;break;default:value=$this.input.value;if(options.input.type=="select"){if(Array.isArray(value)&&value[0]=="")value.splice(0,1)}}if(!value)value="";options.callback(value)}}}}$this.element.remove()};return result};var mzbox={};/**
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
 */mzbox.alert=function(message,title,callback){var options=getArgs("alert",[message,title,callback]);options.buttons=Buttons.alert;options.input=null;return mzbox.dialog(options)};/**
 * Confirm box
 * @param object options
 * 
 * @param string message
 * @param string title
 * @param function callback
 * 
 * @return object Box;
 */mzbox.confirm=function(message,title,callback){var options=getArgs("confirm",[message,title,callback]);options.buttons=Buttons.confirm;options.input=null;return mzbox.dialog(options)};/**
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
 */mzbox.prompt=function(message,title,value,callback){var options=getArgs("prompt",[message,title,value,callback]);options.buttons=Buttons.prompt;if(!options.input)options.input={type:"text"};if(options.value&&!options.input.value)options.input.value=options.value;return mzbox.dialog(options)};/**
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
 */mzbox.setLocale=function(name){if(!Translation[name])throw new Error("Translation named ".concat(name," not exists."));Options.locale=name;return mzbox};window.mzbox=mzbox})(window,cash);
