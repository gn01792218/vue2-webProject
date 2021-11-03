<template>
    <div class="login">
      <div class="h1">
       <h1 class="login-h1" v-if="isin">會員登出</h1>
       <h1 class="login-h1" v-else>會員登入</h1>
       </div>
     <section class="loginContainer">
      <form v-if="isin" class="form" >  <!--@submit.prevent="loginOut"-->
      <p>HI~{{this.$cookies.get('token2')}}，歡迎回來</p>
      <button class="btnl" type="submit" @click="loginOut">登出</button>
      </form>
      <form v-if="!isin" class="form" > <!--@submit.prevent="login"-->
      <input class="Login-input" type="text" v-model="logInData.userAccount" required placeholder="帳號">
      <br>
      <input class="Login-input" type="password" v-model="logInData.userPassword" required placeholder="密碼">
      <br>
      <div>
      <button class="btnl" type="submit" @click="login">登入</button>
      </div>
     <div class="registered">
      <router-link class="reg" to="/registered">註冊</router-link>
      <p class="noMTB gray">|</p>
      <div class="forgetPass gray" type="button" @click=" forget">忘記密碼</div>
      </div>
      </form>
    <ForgetPassWord
     class="fg"
     @sendEMail="sendEmail"
     v-if="isForget"
    />
    </section>
  </div>
</template>
<script>
import ForgetPassWord from './ForgetPassWord'
import {userLogIn} from '../Allapi'
export default {
  components:{
    ForgetPassWord,
  },
  inject:['reload'],  //在后代组件中注入，並调用这个方法即可刷新路由啦。
    data () {
      return {
        //測試資料:帳號gn01792218 密碼Ab12345
        logInData:{ //丟給api的資料
          userAccount: '',
          userPassword: '',
        },
        userData:{
        },
        isShowRouter:true,//路由重整ㄉ判斷
        userRealName:'測試員',
        isin:this.$cookies.get('token')!==null,  //一開始沒有cookies是false才對，會持續監控cookies
        isForget:false,
      }
    },
    methods: {
      login(){  //登入時post帳密到資料庫，若資料庫內有就會回傳成功，若失敗，400
      //if內即使用會員登入的api
       userLogIn(this.logInData)
        .then(res=>{//假如成功，就會執行下列動作，那失敗的話如何輸出登入失敗呢?
              this.userData=res.data;//直接接住他回傳的資料
              this.$cookies.set("token",this.userData.userId,60 * 60 * 24) //把cookies的值設成userId
              this.$cookies.set("token2",this.userData.userAccount,60 * 60 * 24)
              this.reload();
              this.$router.push('/');
        })
         .catch(re=>{
          if(re.status!=201){
           alert("帳號或密碼輸入錯誤")
          }
        })
      },
      loginOut(){
        this.$cookies.remove('token');
        this.$cookies.remove('token2');
        this.isin=false;
        this.reload();
      },
      forget(){
        this.isForget=true;
      },
      sendEmail(){
        this.isForget=false;
      }
}
}
</script>

<style lang="scss">
.login{
 width:100%;
 height:100vh;

  .loginContainer{
     max-width:400px;
     margin-left: auto;
     margin-right: auto;
  }
}
.h1{
  width:400px;
  margin-left: auto;
  margin-right: auto;

}
.login-h1{
  font-size: 5em;
    border-bottom: 1px solid rgba(128, 128, 128, 0.404);
}
.Login-input{
    width:350px;
    height:45px;
    border-radius: 5px;
    margin-bottom: 20px !important;
    font-size:1em;
    color: gray;
}
.form{
  font-size: larger;
  position: relative;
}
.btnl{
  cursor: pointer;
    width:360px;
    height:50px;
    background-color: #2AC5B3;
    border-radius: 10px;
    font-size:1em;
    color:white;
    margin-bottom: 10px;
}
.btnl:hover{
   box-shadow: 1px 1px 5px black;
}
.fg{
  position: absolute;
  top:27%;
  right:40%;
  border:1px solid black;
}
.reg{
  margin-right: 10px;
}
.registered{
  display: flex;
  width:150px;
  margin-left: auto;
  margin-right: auto;
  .forgetPass{
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}
.gray{
  color: gray;
}
//工具
.noMTB{
  margin: 0;
}
</style>