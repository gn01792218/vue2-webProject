<template>
<div class="container">
    <section class="article">
      <h1 class="res-h1">會員註冊</h1>
      <form class="form">
        <p>輸入帳號</p>
        <input class="RES-input" type="text" v-model="userName"  placeholder="最多16個字，勿包含特殊字元" required>
        <p class="error" v-if="this.userNameError">{{userErrMsg}}</p>
        <p>輸入密碼</p>
        <input class="RES-input" type="password" v-model="password" placeholder="6-15個字元，勿含特殊符號、至少含一個大小寫字母和數字" required>
        <p class="error" v-if="this.passwordError">{{passErrMsg}}</p>
        <p>輸入姓名</p>
        <input class="RES-input" type="text" v-model="userreallName" required>
        <p>輸入mail</p>
        <input class="RES-input" type="text" v-model="email" required>
        <p class="error" v-if="this.emailError">{{emailErrMsg}}</p>
        <div class="check">
            <div class="checkContainer">
           <button class="btnS" type="submit" @click="registered">註冊</button>
           </div>
           <div class="home"><router-link to="/">首頁</router-link></div>
        </div>
        </form>
    </section>
    <aside class="aside">
        <p class="res-h1">馬上登入<br>開始你的開發之旅</p>
        <p class="res-h2">開發前不知道方向?<br></p>
        <p class="res-h2">開發中遇到瓶頸，或需要即時回饋</p>
        <p class="res-h1">讓溫水煮程式<br>在開發的歷程上陪伴你!</p>
    </aside>
</div>
</template>

<script>
import {userSignUp} from '@/Allapi'
export default {
    inject:['reload'],  //在后代组件中注入，並调用这个方法即可刷新路由啦。
     data(){    //用來驗證使用者輸入是否有錯誤的暫存data
        return{
        userData:{
            userAccount:'',
            userPassword:'',
            userRealName:'',
            userEmail:'',
        },
        userName:'',
        userNameError: false,
        userreallName:'',
        userErrMsg:"",
        password:'',
        passwordError: false,
        passErrMsg:"",
        email:'',
        emailError: false,
        emailErrMsg:"",
        }
    },
    methods:{
        registered(){
            this.userData.userAccount=this.userName;
            this.userData.userPassword=this.password;
            this.userData.userEmail=this.email;
            this.userData.userRealName=this.userreallName;
            //順便登入
            if(this.userNameError==false && this.passwordError==false && this.emailError==false){ //輸入的帳密沒錯才登入 預設值是false，當三個都是false財表示沒錯可以進去
              //上面確定成功了，再post資料到資料庫，假如回傳error 400表示帳號重複，攔截器會自動打印註冊失敗
                 userSignUp(this.userData)
                .then(res=>{//資料post成功，才會執行下面的程式碼唷~ :  )
                console.log(res);//印出來會是什麼呢?
                console.log("成功註冊並登入囉~")   //但重複帳號的情況下不能讓它登入，要怎辦?
                 this.$cookies.set("token",res.data.userId,60 * 60 * 24) //把cookies的值設成userId
                 this.$cookies.set("token2",this.userData.userAccount,60 * 60 * 24)
                this.reload();
                this.$router.push('/');
                } )
                .catch(res=>{
                     if(res.status!=201){
                     alert("註冊失敗，您的'帳號'或'信箱'已經有人使用了，請重新註冊。")
                    }
                     })
                }else{
                    console.log("有資料輸入錯誤~")
                    alert("請依照提示輸入正確的資料唷~");
                    }
        },
    },
      watch: {
          //還要新增一個檢查帳號有無重複，假如API有回傳帳號出來，就擋住；
          //null，的話就給過
        userName: function () {   //監聽上面的userName變數，檢查使用者名稱，只要輸入後就會啟動這個function
            var isText = /^[a-zA-Z0-9]+$/;
            if (!isText.test(this.userName)) {
                this.userNameError = true;
                this.userErrMsg = '請勿包含特殊字元';
                console.log(this.userNameError)
            }
            else if (this.userName.length > 16) {
                this.userNameError = true;
                this.userErrMsg = '請勿超過16個字';
                console.log(this.userNameError)
            }
            else {
                this.userNameError = false;
                console.log(this.userNameError)
            }
        },
        password: function () {   //檢查密碼
            var isText = /^[a-zA-Z0-9]+$/;
            var include = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
            if (!isText.test(this.password)) {
                this.passwordError = true;
                this.passErrMsg = '請勿包含特殊字元';
                console.log(this.passwordError)
            }
            else if (this.password.length < 6) {
                this.passwordError = true;
                this.passErrMsg = '請勿少於6個字';
                console.log(this.passwordError)
            }
            else if (this.password.length > 15) {
                this.passwordError = true;
                this.passErrMsg = '請勿超過15個字';
                console.log(this.passwordError)
            }
            else if (!include.test(this.password)) {
                this.passwordError = true;
                this.passErrMsg = '至少包括一個大小寫字母和數字';
                 console.log(this.passwordError)
            }
            else {
                this.passwordError = false;
                 console.log(this.passwordError)
            }
        },
        email: function () {    //檢查email
            var isMail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
            if (!isMail.test(this.email)) {
                this.emailError = true;
                this.emailErrMsg = 'email格式錯誤';
                console.log(this.emailError)
            }
            else {
                this.emailError = false;
                 console.log(this.emailError)
            }
        }
    }
}
</script>

<style lang="scss">
.container{
    display: flex;
    margin-left: auto;
    margin-right: auto;
    height:100vh;
}
.invalid-feedback{
    border: 1px dashed yellow;
}
.res-h1{
    width:50%;
    margin-left: auto;
    margin-right: auto;
    font-size:5em;
     border-bottom: 1px solid rgba(128, 128, 128, 0.404);
}
.res-h2{
    font-size: 2em;
}
.check{
    margin-top: 40px;
    width:350px;
    margin-left: auto;
    margin-right: auto;
}
.check button{
    margin-right: 20px;
}
.article{
    width:50%;
    background-color: #F2F2F2;
   
}
.aside{
   background: linear-gradient(top,#0790C1,#024E65);
   width:50%;
   color:white;
}
.form{
    width:100%;
    margin-left: auto;
    margin-right: auto;
 
        font-size: larger;
    
}
.error{
    color: red;
    margin: 0;
}
.RES-input{
    width:350px;
    height:45px;
    border-radius: 5px;
    margin-bottom: 20px;
}
.btnS{
    cursor: pointer;
    width:350px;
    height:50px;
    margin-left: auto;
    margin-right: auto;
    background-color: #2AC5B3;
    border-radius: 5px;
    color:white;
}
.checkContainer{
    width:350px;
    margin-left: auto;
    margin-right: auto;
}
//響應式
@media screen and (max-width:1200px) {
.res-h1{
    font-size:3em;
}
.res-h2{
    font-size: 1.5em;
}
}
@media screen and (max-width:1024px) {
    .res-h1{
    font-size:3em;
    margin-top: 20px;
}
.res-h2{
    font-size: 1.5em;
    margin-top: 80px;
}
}
@media screen and (max-width:768px) {
      .res-h1{
    font-size:2em;
    margin-top: 80px;
}
.res-h2{
    font-size: 1em;
    margin-top: 80px;
}

}
</style>
