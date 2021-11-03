<template>
  <div class="header">
    <nav class="header-container">
      <div class="app-img">
        <img src="../assets/logo.png" width="300" height="200" alt="溫水煮程式">
     </div>
     <section class="header-nav">
      <div>
         <router-link to="/">首頁</router-link>
      </div>
      <div>
        <router-link to="/discuss">討論區</router-link>
      </div>
      <div>
        <router-link to="/Productclassification">專案分類</router-link>
      </div>
      <div>
        <a @click="passUserId">會員專區</a>
      </div>
      <div>
        <router-link to="/login" v-if="isLogin">登出</router-link>
        <router-link to="/login" v-else>登入</router-link>
      </div>
      </section>
      <section class="userInfo" v-if="isLogin" @click="passUserId">
       <img :src="`${baseURL}${userData.userHeadShotPath}`" alt="" width="40" height="40">
        <p>HI~{{userData.userRealName}}({{userData.userAccount}})</p>
      </section>
    </nav>
  </div>
</template>
<script>
import {getUserInfo} from '../Allapi'
  export default {
    data(){
      return{
        isLogin:this.$cookies.get('token')!=null, //有token，代表現在是登入狀態
        userData:{},
        browse:this.$cookies.get('token'),
        baseURL:"http://34.80.165.225/",
        rweselectShow:false,
      }
    },
    created(){
      if(this.$cookies.get('token')){
      getUserInfo(this.$cookies.get('token'))
        .then(res=>{
        this.userData=res.data;
        })
        }
    },
    watch:{
      '$route'(to, from) {
        this.$router.go(0);
        rweselectShow=false;
      },
    },
    methods: { 
       passUserId(){
         if(this.$cookies.get("token") != null){
                this.$router.push({
          path:`/userInfo/${this.browse}`,
        })
        }else{
          alert("會員專區，需要先登入唷~")
           this.$router.push('/login');
        }
        },
    }
  }
</script>

<style lang="scss">
.header{
  box-sizing:border-box;
  position: relative;
    .header-container{
     display: flex;
     max-width:1200px;
     margin-right: auto;
     margin-left: auto;
     .app-img{
       width:300px;
     }
     .header-nav{
        max-width:538px;
        display: flex;
        position: absolute;
        left:50%;
        bottom:20%;
        div{
        margin-right: 50px;
        box-sizing: border-box;
        }
        }
     .userInfo{
       padding: 20px;
       position: absolute;
       right:13%;
       display: flex;
       cursor: pointer;
         img{
          background-color: gray;
         border-radius: 100%;
         }
     }
    }
    a{
      font-size: 1.2em;
      cursor: pointer;
    }
}
.header-Rwd{
  display: none;
}
.rwdselect{
  text-align: left;
  position: absolute;
  right:0%;
  bottom:-90%;
  z-index: 9999;
  background: gray;
  a{
    color:black;
  }
  a:hover{
    background: gray;
  }
}
//響應式
//選擇器有幾層就要做幾層
@media screen and (max-width:1200px) {
.header{
    .header-container{
      .app-img{
        margin-left: 60px;
      }
     .header-nav{
         width:100%;
        }
        }
  }
}
@media screen and (max-width:1024px) {
   .header{
    .header-container{
     .header-nav{
       width:100%;
        }
        .userInfo{
      right:10%;
    }
        }
        }
}
@media screen and (max-width:768px) {
  .header{
    .header-container{
      .app-img{
        margin-left: 30px;
      }
     .header-nav{
       width:80%;
       left:40%;
        div{
        margin-right: 30px;
        box-sizing: border-box;
        }
    }
    .userInfo{
      right:10%;
    }
        }
        }
}
</style>