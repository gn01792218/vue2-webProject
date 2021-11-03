<template>
    <form  class="forget-form" @submit.prevent="login">
      <p>請輸入會員帳號:</p>
      <input  type="text" v-model="userName" required>
      <br>
      <p>請輸入會員信箱</p>
      <input  type="text" v-model="password" required>
      <br>
      <div>
      <button class="forget-btnl" type="submit" @click="sendMail">寄送密碼</button>
      <button class="forget-btnl" type="submit" @click="disMiss">取消</button>
      </div>
    </form>
</template>

<script>
import {userForgetPassword} from "../Allapi"
export default {
  inject:['reload'],  //在后代组件中注入，並调用这个方法即可刷新路由啦。
  data(){
    return{
      userName:'',
      password:'',
    }
    
  },
  methods:{
    disMiss(){
      this.reload();
    },
    sendMail(){
      userForgetPassword({userAccount:this.userName,userEmail:this.password})
        .then(res=>{
          console.log(res)
          alert("密碼信已寄出，請察看信箱~若無信可以先檢查一下垃圾信唷~")
          this.reload();
        })
        .catch(re=>{
          if(re.status!=201){
            alert("無此帳號，或信箱有誤")
          }
        })
    }
     
  }

}
</script>

<style>
.forget-form{
  font-size: larger;
  padding: 10px;
  background-color: white;
}
.forget-btnl{
    width:100px;
    height:50px;
    background-color: #2AC5B3;
    border-radius: 100px;
    color:white;
}
.forget-btnl:hover{
  box-shadow: 1px 1px 5px black;
}
</style>