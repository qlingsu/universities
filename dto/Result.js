class Result{
    constructor(){
        this.result = "";
        this.msg = "";
        this.code = "";
    }
    setResult(result){
        this.result = result;
    }
    getResult(){
        return this.result;
    }
    setMsg(msg){
        this.msg = msg;
    }
    getMsg(){
        return this.msg;
    }
    setCode(code){
        this.code = code;
    }
    getCode(){
        return this.code;
    }
}
module.exports = Result
