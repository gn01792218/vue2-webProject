<template>
  <div>
    <div class="item" @click="$emit('open', productObject)">
      <div class="popImg">
        <img
          :src="`${baseURL}${productObject.productHeadShotPath}`"
          width="360"
          height="260"
        />
      </div>
      <div class="popArticle">
        <h3>{{ productObject.productTitle }}</h3>
      </div>
      <div class="popfoot">
        <div class="popfoot-container">
          <div class="popfoot-container-article">
            <p>{{ author }}</p>
            <p>|</p>
            <p class="popfoot-date">{{ productObject.productDateTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo } from "../Allapi";
export default {
  props: ["productObject"], //外面跑vor時會給你
  created(){
    getUserInfo(this.productObject.userId)
      .then((res)=>{
        this.author=res.data.userAccount;
      })
  },
  data() {
    return {
      author: "",
      productMedia: "",
      baseURL: "http://34.80.165.225/",
    };
  },
  watch:{
    productObject:function(){
      getUserInfo(this.productObject.userId)
      .then((res)=>{
        this.author=res.data.userAccount;
      })
    }
  }
};
</script>

<style lang="scss">
.item {
  cursor: pointer;
  width: 360px;
  margin-bottom: 40px;
  .popImg {
    filter: grayscale(0%);
    border-radius: 3px 3px 0 3px;
    background-color: gray;
  }
  .popArticle {
    width: 360px;
    height: 45px;
    background-color: #025068;
    border-bottom: 1px solid #7a7a7a;
    color: white;
    h3 {
      margin: 0;
      padding-top: 10px;
    }
  }
  .popfoot {
    height: 35px;
    background-color: #191919;
    border-radius: 0px 3px 3px 3px;
    color: white;
    text-align: center;
    .popfoot-container {
      text-align: center;
      display: table;
      .popfoot-container-article {
        display: flex;
      }
      margin-left: auto;
      margin-right: auto;
    }
    p {
      margin: 0 10px 0 0;
      padding-top: 10px;
      font-size: small;
      color: gray;
    }
  }
}
.popImg:hover {
  filter: grayscale(50%);
  transition: filter 0.5s ease;
}
//響應式
@media screen and (max-width:1024px) {
  .item {
  cursor: pointer;
  width: 300px;
  margin-bottom: 40px;
  .popImg {
    width:300px;
    img{
      width:100%;
    }
  }
  .popArticle {
    width: 300px;
    height: 45px;
    h3 {
      padding-top: 10px;
    }
  }
  .popfoot {
    height: 100px;
    .popfoot-container {
      .popfoot-container-article {
        display: block;
      }
    }
    p {
      margin: 0 10px 0 0;
      padding-top: 10px;
      font-size: small;
      color: gray;
    }
  }
}

   
}
@media screen and (max-width:768px) {
   
}
</style>