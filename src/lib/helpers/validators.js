import { isVariable, getVariableString } from "./values";

export function getValidation(validation,value,values = {}){
    let valid = true;
    let msg = "";
    for (let element of validation.validators) {
        if(!Validators[element.type])
            continue;
        if(element.params){
            var params = element.params.map(val => isVariable(val) ? values[getVariableString(val)] : val);
            if(element.type === 'custom'){
                if(!Validators[element.type](element, [value,...params])){
                    valid = false;
                    msg = element.msg;
                }
            }else{
                if(!Validators[element.type](value,...params)){
                    valid = false;
                    msg = element.msg;
                }
            }
        }else{
            if(!Validators[element.type](value)){
                valid = false;
                msg = element.msg;
            }
        }
        if(!valid)
            break;
    }
    return [valid,msg];
}

export class Validators{ 
    static required(value){
        if(!value){
            return false;
        }
        return true;
    }

    static nullValidator(value){
        if(value == null){
            return false;
        }
        return true;
    }

    static min(value,arg){
        var val = Number(value);
        if(val < arg){
            return false;
        }
        return true;
    }

    static max(value,arg){
        var val = Number(value);
        if(val > arg){
            return false;
        }
        return true;
    }

    static minLength(value,arg){
        var val = `${value}`;
        if(val.length < arg){
            return false;
        }
        return true;
    }

    static maxLength(value,arg){
        var val = `${value}`;
        if(val.length > arg){
            return false;
        }
        return true;
    }

    static email(value){
        return Validators.pattern(value,"^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$");
    }

    static pattern(value,arg){
        var val = `${value}`;
        var re = new RegExp(arg);
        return re.test(String(val));
    }

    static custom(rule, args){
        // eslint-disable-next-line
        var jsonFunc = new Function(["value",...rule.args], rule.body);
        return jsonFunc(...args)
    }
}