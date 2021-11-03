<template>
<div class="Article-background" @click="passArticleId(article.discusstionId)">
 <div class="popDiscoust-item" >
   <!-- @click="$emit('openArticle',article)" -->
            <div class="popd-icon">
              <div>
              <img :src="`${baseURL}${article.userHeadShotPath}`" :alt="article.userAccount" width="50" height="50">
              </div>
              <div>
              <p>{{article.userAccount}}</p>
              </div>
              </div>
            <div class="Article">
              <div class="Article-title">
              <h3>{{article.discusstionTitle}}</h3>
              </div>
              <div class="Article-date">
              <p class="date-p">{{article.discusstionDateTime}}</p>
              </div>
              </div>
            <div class="popd-upvote">
               <div class="upvoteCount">
                  <div class="upvote-img"></div>
                  <p>{{article.subscribeCount}}</p>
                </div>
              <!-- <div class="arror"></div>
              <p>{{article.subscribeCount}}</p> -->
            </div>
 </div>
</div>
</template>
<script>
import ArticleShow from '@/components/ArticleShow'
import {getUserInfo} from '../Allapi'
export default {
   components:{
    ArticleShow,
  },
    props:[ "article"],  //接收外面傳進的產品物件-->要傳入ShowArticle
    data(){
      return{
        baseURL:"http://34.80.165.225/",
      }
    },
    created(){
        getUserInfo(this.article.userId)  //會在這邊為article增加userAccount和userHeadShotPath
        .then(res=>{
            this.article.userAccount=res.data.userAccount;
            // const temp="http://34.80.165.225/";
            this.article.userHeadShotPath=res.data.userHeadShotPath;
            // console.log(this.article.userId)
             this.article.discusstionDateTime=this.article.discusstionDateTime.slice(0,16)
             this.article.discusstionDateTime=this.article.discusstionDateTime.replace('-','.');
             this.article.discusstionDateTime=this.article.discusstionDateTime.replace('T',' ');
        })
    },
    methods:{
      passArticleId(ArticleId){
       this.$router.push({
          path: `/articleShow/${ArticleId}`,
        })
    },
    }
}
</script>
<style lang="scss">
.MB{
  display: block;
}
.Article-background{
  position: relative;
  border-radius: 5px;
}
 .popDiscoust-item{
      cursor: pointer;
      display: flex;
      max-width:1200px;
      margin-left: auto;
      margin-right: auto;
      background-color: white;
      border-radius: 5px;
      margin-bottom: 10px;
      color:black;
      padding:10px;
      box-sizing: border-box;
      .popd-icon{
        margin-right: 10px;
        text-align: left;
        img{
           border-radius: 100%;
        background-color: gray;
        }
      }
      .popd-upvote{
        margin-left: auto;
        .arror{
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 20px 20px 20px;
          border-color: transparent transparent #6DCF7F transparent;
        }
      }
    }
    .Article{
      width:100%;
    }
    .Article-title{
     text-align: left;
      margin-right: auto;
    }
    .Article-date{
      width:200px;
      margin-left: auto;
    }
    .date-p{
      text-align: left;
      margin-top: 25px;
      color:gray;
    }
    //工具
    .upvoteCount{
  display: flex;
  font-weight: bold;
  .upvote-img{
    width:24px;
    height:24px;
    background: url("../assets/icon.png");
     background-position: -96px 0;
  }
}
//響應式設計
@media screen and (max-width:1200px) {
    .Article-background{
      width:95%;
      padding:0 30px;
    }
}
@media screen and (max-width:1024px) {
    .Article-background{
      width:95%;
      padding:0 20px;
    }
}
@media screen and (max-width:768px) {
    .Article-background{
      width:95%;
      padding:0 20px;
    }
}
</style>