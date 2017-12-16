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
}