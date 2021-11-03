<template>
<div class="productClass">
  <div class="productClass-h1"><h1>專案分類</h1></div>
   <div class="productClass-Bar"></div>
    <header class="productClass-header">
      <div class="seachBar">
         <div class="wroper">
          <input class="searchBar-input" type="text" placeholder="關鍵字搜尋" v-model="keyWord" @keyup.enter="search">
          <select class="searchBar-select" v-model="filterValue">
            <option value="作者帳號">依作者帳號搜尋</option>
            <option value="文章標題" selected>依文章標題搜尋</option>
          </select>
         </div>
      </div>
       <!-- <input type="text" v-model="keyWord" placeholder="關鍵字搜尋" @keyup.enter="search"> -->
    </header>
    <div class="productClass-main">
      <div class="productClass-main-container">
         <div class="productClass-main-div cloth" @click="passType(productive)">
         </div>
         <div class="productClass-main-div food" @click="passType(game)">
         </div>
         <div class="productClass-main-div house" @click="passType(Community)">
         </div>
         <div class="productClass-main-div traffic" @click="passType(design)">
         </div>
         <div class="productClass-main-div education" @click="passType(education)">
         </div>
         <div class="productClass-main-div entertainment" @click="passType(health)"></div>
      </div>
    </div>
  </div>
  
</template>

<script>
import ProductDisplayType from './ProductDisplayType.vue'
import{getProductByKeyword } from'../Allapi'
import{getAllProduct} from '../Allapi'

export default {
  components:{
    ProductDisplayType,
  },
  created(){
   
  },
  data(){
    return{
      productive:'生產力工具',game:'遊戲相關',Community:'社群相關',design:'設計與藝術',education:'教育與學習',health:'健康與生活',
      // allProducts:[],
      keyWord:'',
      keyWordProduct:[],//關鍵字搜尋的產品
      filterValue:'',
   }
  },
  methods:{
    passType(type){
       this.$router.push({
          path: `/productDisplayType/${type}`,
        })
    },
    search(){
      if(this.filterValue!="文章標題" &&this.filterValue!="作者帳號"){
        this.filterValue="文章標題"
      }
      this.keyWord=this.filterValue+"*"+this.keyWord;
      this.passType(this.keyWord);  //帶過去了
    }
  },
}
</script>
<style lang="scss">
.productClass-Bar{
  width:1200px;
  height: 25px;
  margin-left: auto;
  margin-right: auto;
   background: linear-gradient(left, #024e66, #0793c5);
   margin-bottom: 20px;
}
.productClass-main{
    box-sizing: border-box;
    .productClass-main-container{
        max-width:1200px;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-wrap: wrap;
        .productClass-main-div{
        box-sizing: border-box;
        width:340px;
        height:440px;
        box-shadow: 5px 5px 5px black;
        margin-right: 30px;
        margin-left: 30px;
        margin-bottom: 15px;
        margin-top: 10px;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
      }
      .productClass-main-div:hover{
        transform: scale(0.95);
      }
    }
}
 .seachBar{
    width:1200px;
    margin-left: auto;
    margin-right: auto;
     .wroper{
       background-color: #f2f2f2;
       border:2px solid black;
       width:50%;
       margin-left: auto;
       padding: 0;
    .searchBar-input{
      background-color: #f2f2f2;
      width:370px;
      height:25px;
      font-size: 1.2rem;
      border-radius: 10px;
      border: 0px;
      }
      .searchBar-input:focus{
        border: none;
        outline: none;//清除聚焦時候的邊框
      }
    .searchBar-select{
      text-align: right;
      margin-left: auto;
      background-color: #f2f2f2;
      width:190px;
      height:25px;
      font-size: 1rem;
      border:0px;
    }
    .searchBar-select:focus{
      appearance: none;//隱藏下拉圖示
      border:none;
      outline: none;
    }
  }
  }
.food:hover,.cloth:hover,.traffic:hover,.house:hover,.education:hover,.entertainment:hover,.other:hover{
  filter: grayscale(50%);
  transition: filter 0.5s ease;
}
.cloth{
   filter: grayscale(0%);
  background-image: url("../assets/icon2.png");
  background-position: -0px 0;
}
.food{
  filter: grayscale(0%);
  background-image: url("../assets/icon2.png");
  background-position: -340px 0;
}
.house{
   filter: grayscale(0%);
  background-image: url("../assets/icon2.png");
  background-position: -680px 0;
}
.traffic{
   filter: grayscale(0%);
   background-image: url("../assets/icon2.png");
  background-position: -1020px 0;
}
.education{
   filter: grayscale(0%);
   background-image: url("../assets/icon2.png");
  background-position: -1360px 0;
}
.entertainment{
   filter: grayscale(0%);
background-image: url("../assets/icon2.png");
  background-position: -1700px 0;
}
//響應式
@media screen and (max-width:1024px) {
  .productClass-Bar{
  width:1024px;
   margin-bottom: 20px;
}
.productClass-main{
    .productClass-main-container{
        .productClass-main-div{
        width:340px;
        height:440px;
        margin-right: 60px;
        margin-left: 100px;
        margin-top: 20px;
      }
    }
}
  .seachBar{
    width:1024px;
     .wroper{
    margin-left: auto;
    margin-right: auto;
       width:80%;
    .searchBar-input{
      width:570px;
      height:25px;
      font-size: 1.2rem;
      border-radius: 10px;
      border: 0px;
      }
    .searchBar-select{
      width:190px;
    }
  }
  }

}
@media screen and (max-width:768px) {
   .productClass-Bar{
  width:768px;
   margin-bottom: 20px;
}
.productClass-main{
    .productClass-main-container{
        .productClass-main-div{
        width:340px;
        height:440px;
        margin-right: 20px;
        margin-left: 20px;
      }
    }
}
  .seachBar{
    width:768px;
     .wroper{
         margin-left: auto;
    margin-right: auto;
       width:90%;
    .searchBar-input{
      width:500px;
      height:25px;
      font-size: 1.2rem;
      border-radius: 10px;
      border: 0px;
      }
    .searchBar-select{
      width:150px;
    }
  }
  }


}
</style>