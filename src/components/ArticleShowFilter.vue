<template>
   <section class="articleShow-filter">
       <div class="articleF-title">  <h2>依照{{filterType}}[{{title}}]搜尋結果</h2></div>
       <header class="Diss-header">
       </header>
       <div class="article-filter-container">
         <Article class="AF"
            v-for="i,index in showFilterItem" :key="index"
            :article="i"
          />
          </div>
     </section>
</template>
<script>
import Article from'@/view/Article'
import {getAllDis} from '../Allapi'
import{getDisBycategory} from '../Allapi'
import{getDisByKeyword}from '../Allapi'
import{getUserInfo} from '../Allapi'
import{getDisFFllowerNum}from '../Allapi'
export default {
    components:{
        Article,
    },
    created(){
        window.addEventListener("scroll", this.handleScroll); //監聽螢幕scroll
        if(this.$route.params.tag=="所有文章"){
            getAllDis()
                .then(async(res)=>{
                     const apiList=res.data.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
                    const newList=await Promise.all(apiList);
                    res.data.forEach((item,index)=>{
                        item.subscribeCount=newList[index].data.subscribeCount;
                    })
                    this.filterArticle=res.data;
                    this.title="#"+this.$route.params.tag;
                    this.filterArticle=await this.sortKey(this.filterArticle,'discusstionDateTime');
                    this.filterArticle.forEach((item,index)=>{ //先裝6則到show中
                        if(index<6){
                            this.showFilterItem.push(item);
                        }
                    })
                })
        }else if(this.$route.params.tag.indexOf("文章標題")!=-1){
                //先切字串
                var temp=this.$route.params.tag.split('*');
                this.title=temp[1];
                this.filterType="文章標題搜尋關鍵字"
                getDisByKeyword(temp[1])
                    .then(async(res)=>{
                         const apiList=res.data.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
                    const newList=await Promise.all(apiList);
                    res.data.forEach((item,index)=>{
                        item.subscribeCount=newList[index].data.subscribeCount;
                    })
                        this.filterArticle=res.data;
                         this.filterArticle=await this.sortKey(this.filterArticle,'discusstionDateTime');
                        this.filterArticle.forEach((item,index)=>{ //先裝6則到show中
                        if(index<6){
                            this.showFilterItem.push(item);
                        }
                    })
                    })
        }else if(this.$route.params.tag.indexOf("作者名稱")!=-1){
                var temp=this.$route.params.tag.split('*');
                this.title=temp[1];
                this.filterType="作者帳號"
                 getAllDis()
                .then(async(res)=>{
                   const apiList=res.data.map(async(item)=>await getUserInfo(item.userId));
                   const newList=await Promise.all(apiList);
                    res.data.forEach((item,index)=>{
                        item.userAccount=newList[index].data.userAccount;
                    })
                        const apiList2=res.data.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
                    const newList2=await Promise.all(apiList2);
                    res.data.forEach((item,index)=>{
                        item.subscribeCount=newList2[index].data.subscribeCount;
                    })
                    res.data.forEach(item=>{
                            if(item.userAccount.indexOf(temp[1])!=-1){
                              this.filterArticle.push(item);
                            }
                    })
                    this.filterArticle=await this.sortKey(this.filterArticle,'discusstionDateTime');
                    this.filterArticle.forEach((item,index)=>{ //先裝6則到show中
                        if(index<6){
                            this.showFilterItem.push(item);
                        }
                    })
                })
        }else if(this.$route.params.tag.indexOf("pop")!=-1){
                this.title="所有文章";
                this.filterType="熱門程度"
             getAllDis()
                .then(async(res)=>{
                    var temp = res.data;//取得所有文章
                    const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
                    const newList=await Promise.all(apiList);
                    temp.forEach((item,index)=>{
                        item.subscribeCount=newList[index].data.subscribeCount;
                    })
                    //依照人氣排序的文章
                    temp=await this.sortKey(temp,'subscribeCount');
                    this.filterArticle=temp;
                    this.filterArticle.forEach((item,index)=>{ //先裝6則到show中
                        if(index<6){
                            this.showFilterItem.push(item);
                        }
                    })
                     })
        }else if(this.$route.params.tag.indexOf("new")!=-1){
            this.title="所有文章";
            this.filterType="最新的"
            getAllDis()
                .then(async(res)=>{
                    var temp = res.data;//取得所有文章
                      const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
                    const newList=await Promise.all(apiList);
                    temp.forEach((item,index)=>{
                        item.subscribeCount=newList[index].data.subscribeCount;
                    })
                    //依照最新排序的文章
                    temp=await this.sortKey(temp,'discusstionDateTime');
                    this.filterArticle=temp;
                    this.filterArticle.forEach((item,index)=>{ //先裝6則到show中
                        if(index<6){
                            this.showFilterItem.push(item);
                        }
                    })
                     })
        }
        else{
                this.title="#"+this.$route.params.tag;
                this.filterType="標籤"
            getDisBycategory(this.$route.params.tag)
                .then(async(res)=>{
                      const apiList=res.data.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
                    const newList=await Promise.all(apiList);
                    res.data.forEach((item,index)=>{
                        item.subscribeCount=newList[index].data.subscribeCount;
                    })
                    this.filterArticle=res.data;
                    this.filterArticle=await this.sortKey(this.filterArticle,'discusstionDateTime');
                    this.filterArticle.forEach((item,index)=>{ //先裝6則到show中
                        if(index<6){
                            this.showFilterItem.push(item);
                        }
                    })
                })
        }
    },
    data(){
        return{
            filterArticle:[],//裝篩選的所有文章
            showFilterItem:[],//慢慢呈現一則一則文章
            title:'',
            filterType:'',
        }
    },
    methods:{
        handleScroll(){ //監聽卷軸是否到底部方法
    if(this.filterArticle.length>=this.showFilterItem.length){ //節省效能，只有所有篩選的長度大於等於show的長度才監聽
    //document.document.body.scrollHeight
    // window.scrollY + window.screen.height > document.querySelector('.articleF-title').scrollHeight
   
      if( document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 200){ 
        this.showMore(); //捲到底部會呼叫載入更多
      }
    }
    },
    showMore(){
      this.isLoading=true;
        for(var i=0;i<1;i++){
          if(this.filterArticle[this.showFilterItem.length+i]) //有東西再放
          this.showFilterItem.push(this.filterArticle[this.showFilterItem.length+i]);
        }
        this.isLoading=false;
    },
         sortKey(array,key){
    return array.sort(function(a,b){
     var x = a[key];
     var y = b[key];
     return ((x>y)?-1:(x<y)?1:0)
    })
   },
    }

}
</script>

<style lang="scss">
.Diss-header{
  width:1200px;
  margin-left: auto;
  margin-right: auto;
   background: linear-gradient(left, #024e66, #0793c5);
   height: 25px;
}
.AF:hover{
    transform: scale(0.95);
}
    .articleF-title{
        width:1200px;
       margin-left: auto;
       margin-right: auto;
    }
    .article-filter-container{
        min-height:100vh;
    }
//響應式
@media screen and (max-width:1200px) {
.Diss-header{
  width:1200px;
}
.articleF-title{
        width:1200px;
    }
}
@media screen and (max-width:1024px) {
    .Diss-header{
  width:1024px;
}
.articleF-title{
        width:1024px;
    }
   
}
@media screen and (max-width:768px) {
        .Diss-header{
  width:768px;
}
.articleF-title{
        width:768px;
    }
 
}

</style>