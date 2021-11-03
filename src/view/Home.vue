<template>
  <div class="hello">
    <header class="home-header">
      <div class="home-header-container">
         <div class="home-header-img">
          <img src="../assets/homeImg.png"  alt="溫水煮程式照片"  width="500"  height="500" />
        </div>
         <article class="home-header-article">
          <div>
            <h1 class="home-header-h1">溫水煮程式</h1>
            <h2 class='home-header-article-Deloper'>DEVELOPER GIVE BACK</h2>
            <h1 class="home-header-Point-font-size home-header-h1">讓開發者獲得即時回饋的中文交流平台</h1>
          </div>
          <div class="home-header-h2Style">
            <h2>尋找開發點子</h2>
            <h2>突破開發瓶頸</h2>
            <h2>展示產品歷程</h2>
             <div v-if="this.$cookies.get('token')" class="Home-newBtn" @click="toUserInfo">歡迎回來</div>
             <router-link v-else to="/login"><div class="Home-newBtn">立即體驗</div></router-link>
          </div>
        </article>
          <section class="hotProductPlayer">
            <div class="hotProductPlayer-left player-container">
              <div class="playItem" v-for="i,index in products" :key="index">
               <img :src="`${baseURL}${i.productHeadShotPath}`" :alt="i.productTitle" width="300" height="200">
             </div>
          </div>
            <div class="hotProductPlayer-right player-container">
            <div class="playItem" v-for="i,index in products" :key="index">
              <img :src="`${baseURL}${i.productHeadShotPath}`" :alt="i.productTitle" width="300" height="200">
            </div>
          </div>
        </section>
      </div>
      <div class="arrorwUp"></div>
    </header>
    <div class="home-popProduct">
      <h2 class="home-popProduct-h2">熱門產品區</h2>
      <section class="home-popProduct-container">
        <Product class="pditem"
          v-for="(i, index) in products"
          :key="index"
          :productObject="i"
           @open="passPDObject($event.productId)"
        />
        <ProductShow
          class="ps"
          v-if="ps"
          :showProduct="onClickproduc"
          @close="ps = false"
        />
        <div class="seemore">
          <router-link to="/Productclassification"
            ><p>看更多產品</p></router-link
          >
        </div>
        <div class="arrorwDown"></div>
      </section>
    </div>
    <div class="popDiscoust">
      <div class="popDiscoust-h2">
        <h2>熱門討論主題</h2>
      </div>
      <section class="popDiscoust-container">
        <Article
          v-for="(i, index) in allDis"
          :key="index"
          :article="i"
          @openArticle="(showArticle = true), (onClickarticle = $event)"
        />
        <ArticleShow
          v-if="showArticle"
          :onClickArticle="onClickarticle"
          @closeArticle="showArticle = false"
        />
      </section>
      <div class="seemore-dis">
        <router-link to="/discuss"> <p>看更多熱門討論主題</p></router-link>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../components/Header";
import Product from "../components/Product";
import Article from "../view/Article.vue";
import ArticleShow from "@/components/ArticleShow";
import ProductShow from "../view/ProductShow.vue";
// import Loading from"@/components/Loading"
import { getAllProduct } from "../Allapi";
import { getAllDis } from "../Allapi";
import{getProductFllowerCount}from"../Allapi";
import{getDisFFllowerNum} from"../Allapi";

export default {
  name: "Home",
  components: {
    Header,
    Product,
    ProductShow,
    Article,
    ArticleShow,
    // Loading
  },
  created() {
    getAllProduct().then(async(res) =>{ //呼叫取得所有產品的API
     this.isLoading=true;
      var temp = res.data; 
      const apiList=temp.map(async(item)=>await getProductFllowerCount(item.productId));
      const newList=await Promise.all(apiList);
      temp.forEach((item,index)=>{
        item.subscribeCount=newList[index].data.subscribeCount;
      })
       temp=await this.sortKey(temp,'subscribeCount')
       //但是只能要六則
       temp.forEach((item,index)=>{
         if(index<6){
         this.products.push(item)
         }
       })
       this.isLoading=false;
    });
    getAllDis().then(async(res) => {
      this.isLoading=true;
      var temp = res.data;//取得所有文章
      const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
      const newList=await Promise.all(apiList);
      temp.forEach((item,index)=>{
        item.subscribeCount=newList[index].data.subscribeCount;
      })
      temp=await this.sortKey(temp,'subscribeCount');
      temp.forEach((item,index)=>{
        if(index<5){
          this.allDis.push(item);
        }
      })
      this.isLoading=false;
    });
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      products: [],
      allDis: [],
      showArticle: false,
      onClickarticle: {},
      ps: false,
      baseURL:"http://34.80.165.225/",
      // isLoading:false,
    };
  },
  methods: {
        passPDObject(PDOId){
       this.$router.push({
          path: `/productShow/${PDOId}`,
        })
    },
    passUserId(userId){
       this.$router.push({
          path: `/userInfo/${userId}`,
        })
    },
    toUserInfo(){
      this.passUserId(this.$cookies.get('token'));
    },
    sortKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
  },
};
</script>
<style lang="scss">
//首頁產品播放器
.home-header-container{
  max-width:1800px;
}
.player-container{
    border-radius: 100px;
  }
.hotProductPlayer{
  width:620px;
  height:520px;
  overflow: hidden;
  display:flex;
  position: relative;
  margin-top: 40px;
  margin-right: 200px;
  border-radius: 10px;
  .hotProductPlayer-left{
  width:300px;
  overflow: hidden;
  animation-name: productPlayer-L;
  animation-duration: 60s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-delay: 0s;
  position: absolute;
  top:0px;
  border-radius: 10px;
  .playItem{
    width:300px;
      height:200px;
     img{
      border-radius: 10px;
      margin-bottom: 10px;
    }
  }
  }
  .hotProductPlayer-right{
  width:300px;
  border-radius: 10px;
  animation-name: productPlayer-R;
  animation-duration: 60s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
   animation-timing-function: linear;
  animation-delay: 0s;
  position: absolute;
  right: 0;
  bottom:0;
  .playItem{
     width:300px;
      height:200px;
  img{
    border-radius: 10px;
     margin-bottom: 10px;
  }
  }
  }
}
@keyframes productPlayer-L {
  0%{
   top:0px;
  }
  50%{
    top:-650px;
  }
  100%{
    top:0px;
  }
}
 @keyframes productPlayer-R {
   0%{
   bottom:0px;
  }
  50%{
    bottom:-650px;
  }
  100%{
    bottom:0px;
  }
  }
.ps {
  z-index: 10;
}
.arrorwUp {
  position: absolute;
  border-radius: 5px;
  bottom: -20px;
  left: 45% ;
  width: 200px;
  height: 200px;
  background: linear-gradient(left, #056f93, #047298);
  transform: rotate(45deg);
  z-index: -1;
}
.arrorwDown {
  position: absolute;
  bottom: -960px;
  left: 47%;
  z-index: 8;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 50px 50px 0 50px;
  border-color: white transparent transparent transparent;
}
.home-header {
  background: linear-gradient(left, #024e66, #0793c5);
  position: relative;
  height:70vh;
  .home-header-container {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    .home-header-img {
      width: 500px;
      margin-left: auto;
    }
    .home-header-article{
      width: 650px;
      margin-left: -300px;
      margin-right: 100px;
      margin-top: 60px;
      .home-header-article-Deloper{
        font-size: 1.2rem;
        margin: 0;
        color: rgba(155, 155, 155, 1);
      }
      .home-header-h1 {
         font-size: 2rem;
         color: white;
         margin-bottom: 0;
        .home-header-h2 {
          color: rgba(252, 88, 88, 0.5);
        }
      }
    }
  }
}
.home-header-Point-font-size {
        font-size: 2rem;
      }
.home-header-h2Style {
        font-size: 1.5rem;
        letter-spacing:5px;
        color: rgba(200, 200, 200, 1);
      }
.home-popProduct {
  max-width:1200px;
  margin-left: auto;
  margin-right: auto;
  // height: 100vh;
  .home-popProduct-h2 {
    margin-top: 80px;
  }
  .home-popProduct-container {
    display: flex;
    flex-wrap: wrap;
  }
}
.pditem{
  margin-right: 20px;
  margin-left: 20px;
}
.popDiscoust {
  // height: 100vh;
  background-color: #024e66;
  color: white;
  padding-bottom: 20px;
  .popDiscoust-h2 {
    margin: 0px;
    margin-top: 40px;
    padding-top: 30px;
  }
  .popDiscoust-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
}
//工具區
.seemore {
  border-radius: 5px;
  background-color: brown;
  color: white;
  width: 200px;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  a {
    color: white;
  }
}
.seemore:hover {
  background-color: gray;
}
.seemore-dis {
  border-radius: 5px;
  background-color: brown;
  color: white;
  width: 200px;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  a {
    color: white;
  }
  p {
    margin: 0;
    padding-top: 15px;
  }
}
.seemore-dis:hover {
  background-color: gray;
}
.Home-newBtn{
  width:150px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 100px;
  border:0.5px solid gray;
  padding: 5px 10px;
  background-color: brown;
  // background: linear-gradient(left, #024e66, #0793c5);
  color: white;
  margin-bottom: 20px;
  box-shadow: 1px 1px 5px black;
}
.Home-newBtn:hover{
  transform: scale(0.9);
  cursor: pointer;
  background: linear-gradient(left, #0793c5,#024e66 );
}
//響應式設計
@media screen and (max-width:1875px) {
 .hotProductPlayer{
   height:460px;
   margin-right: 0;
  .hotProductPlayer-left{
    width:60%;
    margin-right: auto;
    .playItem{
      width:60%;
      height:auto;
      img{
        max-width:100%;
        height:100%;
      }
    }
  }
  .hotProductPlayer-right{
    width:60%;
    margin-left: auto;
  .playItem{
      width:60%;
      height:auto;
  img{
     max-width:100%;
        height:100%;
      }
     }
    }
  }
  .home-header {
  .home-header-container {
    .home-header-img {
      width: 500px;
    }
    .home-header-article{
      width: 650px;
      margin-left: -300px;
      margin-right: 100px;
      margin-top: 60px;
      .home-header-article-Deloper{
        font-size: 1rem;
        margin: 0;
        color: rgba(155, 155, 155, 1);
      }
      .home-header-h1 {
         font-size: 1.8rem;
         color: white;
         margin-bottom: 0;
        .home-header-h2 {
          color: rgba(252, 88, 88, 0.5);
        }
      }
    }
  }
}
.home-header-h2Style {
        font-size: 1rem;
      }
      .arrorwUp {
  left: 44.5%;
}
.arrorwDown {
  bottom: -1000px;
  left: 47%;
}
}
@media screen and (max-width:1200px) {
 .hotProductPlayer{
   width: 100%;
   height:450px;
   margin-right: 0;
  .hotProductPlayer-left{
    width:60%;
    margin-right: auto;
    .playItem{
      width:60%;
      height:auto;
      img{
        max-width:100%;
        height:100%;
      }
    }
  }
  .hotProductPlayer-right{
    width:60%;
    margin-left: auto;
  .playItem{
      width:60%;
      height:auto;
  img{
     max-width:100%;
        height:100%;
      }
     }
    }
  }
  .home-header {
  .home-header-container {
    .home-header-img {
      width: 500px;
    }
    .home-header-article{
      width: 650px;
      margin-left: -300px;
      margin-right: 100px;
      margin-top: 60px;
      .home-header-article-Deloper{
        font-size: 1rem;
        margin: 0;
        color: rgba(155, 155, 155, 1);
      }
      .home-header-h1 {
         font-size: 1.8rem;
         color: white;
         margin-bottom: 0;
        .home-header-h2 {
          color: rgba(252, 88, 88, 0.5);
        }
      }
    }
  }
}
.home-header-h2Style {
        font-size: 1rem;
      }
      .arrorwUp {
  left: 42%;
}
.arrorwDown {
  bottom: -1000px;
  left: 46%;
}
}

@media screen and (max-width:1024px) {
  .hotProductPlayer{
   width: 100%;
   height:450px;
   margin-right: 0;
  .hotProductPlayer-left{
    width:60%;
    margin-right: auto;
    .playItem{
      width:60%;
      height:auto;
      img{
        max-width:100%;
        height:100%;
      }
    }
  }
  .hotProductPlayer-right{
    width:60%;
    margin-left: auto;
  .playItem{
      width:60%;
      height:auto;
  img{
     max-width:100%;
        height:100%;
      }
     }
    }
  }
  .home-header {
     height:70vh;
  .home-header-container {
    .home-header-img {
    }
    .home-header-article{
      .home-header-article-Deloper{
      }
      .home-header-h1 {
         font-size: 1.8rem;
        .home-header-h2 {
        }
      }
    }
  }
}
  .home-header-h2Style {
        font-size: 1rem;
      }
.pditem{
  margin-right: 10px;

  margin-left: auto;
}
.arrorwUp {
  left: 40%;
}
.arrorwDown {
  bottom: -1130px;
  left: 45%;
}
}
@media screen and (max-width:768px) {
  .hotProductPlayer{
   width: 100%;
   height:330px;
   margin-right: 0;
  .hotProductPlayer-left{
    width:60%;
    margin-right: auto;
    .playItem{
      width:60%;
      height:auto;
      img{
        max-width:100%;
        height:100%;
      }
    }
  }
  .hotProductPlayer-right{
    width:60%;
    margin-left: auto;
  .playItem{
      width:60%;
      height:auto;
  img{
     max-width:100%;
        height:100%;
      }
     }
    }
  }
   .home-header {
     height:53vh;
  .home-header-container {
    .home-header-img {
      margin-left: 100px;
      img{
        width:400px;
        height:auto;
      }
    }
    .home-header-article{
      margin-left: -300px;
      .home-header-article-Deloper{
      }
      .home-header-h1 {
         font-size: 1.4rem;
        .home-header-h2 {
        }
      }
    }
  }
}
  .home-header-h2Style {
        font-size: 0.8rem;
      }
      .arrorwUp {
  left: 37%;
}
      .arrorwDown {
  bottom: -1450px;
  left: 43%;
}
}
</style>