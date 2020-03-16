export default{
  //生成id
  createId(){
    let id = Math.random().toString(36).substr(2);
    return id;
  },
}