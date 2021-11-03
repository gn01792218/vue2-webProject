<template>
  <div class="pdDisplay">
    <Loading
        v-if="isLoading"
      />
      <div class="productClass-h1"><h1>專案分類</h1></div>
   <div class="productClass-Bar"></div>
    <div class="pdDisplay-h1">
      <h1 v-if="keyWord='' && this.$route.params.productType!='生產力工具' && this.$route.params.productType!='教育與學習' && this.$route.params.productType!='健康與生活'
      && this.$route.params.productType!='遊戲相關'  && this.$route.params.productType!='社群相關' && this.$route.params.productType!='設計與藝術' ">搜尋的分類-{{filterType}}</h1>
      <h1 v-if="this.$route.params.productType!='生產力工具' && this.$route.params.productType!='教育與學習' && this.$route.params.productType!='健康與生活'
      && this.$route.params.productType!='遊戲相關'  && this.$route.params.productType!='社群相關' && this.$route.params.productType!='設計與藝術'" >搜尋關鍵字-{{this.$route.params.productType}}</h1>
      <div class="pdDisplay-sort">
        <div class="newBtn" @click="PDsort(1)">最熱門專案</div>
        <div class="newBtn" @click="PDsort(2)">最新專案</div>
      </div>
    </div>
    <section class="pdDisplay-container">
     <aside class="pdDisplay-aside" v-if="this.$route.params.productType.indexOf('文章標題')==-1 && this.$route.params.productType.indexOf('作者帳號')==-1">
        <div class="pdDisplay-aside-item onColickSection createdTool" @click="jumptoFilter('生產力工具')">生產力工具</div>
        <div class="pdDisplay-aside-item game" @click="jumptoFilter('遊戲相關')">遊戲相關</div>
         <div class="pdDisplay-aside-item friend" @click="jumptoFilter('社群相關')">社群相關</div>
         <div class="pdDisplay-aside-item art" @click="jumptoFilter('設計與藝術')">設計與藝術</div>
        <div class="pdDisplay-aside-item learn" @click="jumptoFilter('教育與學習')">教育與學習</div>
        <div class="pdDisplay-aside-item health" @click="jumptoFilter('健康與生活')">健康與生活</div>
    </aside>
   <section class="pdDisplay-main">
    <div v-if="FilterProducts.length<1">
      <h2>沒有符合的專案</h2>
    </div>
    <div v-else class="pdDisplay-item">
      <Product class="PDP-item"
        v-for="i,index in showFilterItem" :key="index"
        :productObject="i"
       @open="passPDObject($event.productId)"
      />
    </div>
     <ProductShow class="ps" v-if="ps"
          :showProduct="onClickproduc"
          @close="ps=false"
      />
      </section>
     </section>
  </div>
</template>

<script>
import Product from '../components/Product.vue'
import ProductShow from '../view/ProductShow.vue'
import{getAllProduct} from '../Allapi'
import{getProductFllowerCount}from '../Allapi'
import{getUserInfo}from '../Allapi'
import Loading from'../components/Loading.vue'
export default {
    props:["productType"],
    components:{
      Product,ProductShow, Loading
    },
    mounted(){
      switch(this.$route.params.productType){
        case '生產力工具':

            document.querySelector('.createdTool').classList.add("onColickSection");
            document.querySelector('.learn').classList.remove("onColickSection");
            document.querySelector('.health').classList.remove("onColickSection");
            document.querySelector('.art').classList.remove("onColickSection");
             document.querySelector('.game').classList.remove("onColickSection");
             document.querySelector('.friend').classList.remove("onColickSection");
          break
        case '教育與學習':
            document.querySelector('.createdTool').classList.remove('onColickSection');
            document.querySelector('.learn').classList.add('onColickSection');
            document.querySelector('.health').classList.remove('onColickSection');
            document.querySelector('.art').classList.remove('onColickSection');
             document.querySelector('.game').classList.remove('onColickSection');
             document.querySelector('.friend').classList.remove('onColickSection');
            break
        case '健康與生活':
          document.querySelector('.createdTool').classList.remove('onColickSection');
            document.querySelector('.learn').classList.remove('onColickSection');
          document.querySelector('.health').classList.add('onColickSection');
          document.querySelector('.art').classList.remove('onColickSection');
             document.querySelector('.game').classList.remove('onColickSection');
             document.querySelector('.friend').classList.remove('onColickSection');
          break
        case '設計與藝術':
          document.querySelector('.createdTool').classList.remove('onColickSection');
            document.querySelector('.learn').classList.remove('onColickSection');
          document.querySelector('.health').classList.remove('onColickSection');
           document.querySelector('.art').classList.add('onColickSection');
           document.querySelector('.game').classList.remove('onColickSection');
             document.querySelector('.friend').classList.remove('onColickSection');
           break
        case '遊戲相關':
          document.querySelector('.createdTool').classList.remove('onColickSection');
            document.querySelector('.learn').classList.remove('onColickSection');
          document.querySelector('.health').classList.remove('onColickSection');
           document.querySelector('.art').classList.remove('onColickSection');
           document.querySelector('.game').classList.add('onColickSection');
           document.querySelector('.friend').classList.remove('onColickSection');
           break
        case '社群相關':
          document.querySelector('.createdTool').classList.remove('onColickSection');
            document.querySelector('.learn').classList.remove('onColickSection');
          document.querySelector('.health').classList.remove('onColickSection');
           document.querySelector('.art').classList.remove('onColickSection');
           document.querySelector('.game').classList.remove('onColickSection');
           document.querySelector('.friend').classList.add('onColickSection');
           break
      }
    },
    created(){
      window.addEventListener("scroll", this.handleScroll); //監聽螢幕scroll
      if(this.$route.params.productType=='生產力工具' || this.$route.params.productType=='遊戲相關' || this.$route.params.productType=='社群相關' ||
      this.$route.params.productType=='設計與藝術' || this.$route.params.productType=='教育與學習' || this.$route.params.productType=='健康與生活'){//傳進來的假如不是分類的話
      this.filterType=this.$route.params.productType;
      getAllProduct()
        .then(async(res)=>{
             var temp = res.data; 
            const apiList=temp.map(async(item)=>await getProductFllowerCount(item.productId));
            const newList=await Promise.all(apiList);
            temp.forEach((item,index)=>{
              item.subscribeCount=newList[index].data.subscribeCount;
              })
            temp.forEach((item,index)=>{
              if(item.productCategory==this.filterType){
                this.FilterProducts.push(item);//裝到全部
                if(this.showFilterItem.length<6){ 
                    this.showFilterItem.push(item);//裝初始化的六則到show上
                }
            }
            })
        })
      }
      else{
       ; //直接裝 丟過來的陣列
        getAllProduct()
        .then(async(res)=>{
          var temp=this.$route.params.productType.split('*');
           switch(temp[0]){
             case "文章標題":
               const api=res.data.map(async(item)=>await getProductFllowerCount(item.productId));
               const newapi=await Promise.all(api);
               res.data.forEach((item,index)=>{
              item.subscribeCount=newapi[index].data.subscribeCount;
              })
               res.data.forEach((item,index)=>{
                  if(item.productTitle.indexOf(temp[1])!=-1){
                    this.FilterProducts.push(item);
                     if(this.showFilterItem.length<6){  
                    this.showFilterItem.push(item);//裝初始化的六則到show上
                    }
                  }
                })
                 this.keyWord=temp[1];
               break
             case "作者帳號":
               const apiList=res.data.map(async(item)=>await getUserInfo(item.userId));
               const newList=await Promise.all(apiList);
               res.data.forEach((item,index)=>{
                 item.userAccount=newList[index].data.userAccount;
               })
              const apiList2=res.data.map(async(item)=>await getProductFllowerCount(item.productId));
              const newList2=await Promise.all(apiList2);
              res.data.forEach((item,index)=>{
              item.subscribeCount=newList2[index].data.subscribeCount;
              })
               res.data.forEach((item,index)=>{
                  if(item.userAccount.indexOf(temp[1])!=-1){
                    this.FilterProducts.push(item);
                     if(this.showFilterItem.length<6){ 
                    this.showFilterItem.push(item);//裝初始化的六則到show上
                      }
                  }
                })
                 this.keyWord=temp[1];
               break
           }
        })
      }
    },
    data(){
    return{
      isLoading:false,
      FilterProducts:[],//所有篩選過後的東西
      showFilterItem:[],//跟著滾軸呈現的資料
      filterType:'',
      keyWord:'',
      ps:false,
      // userData:{},//用來接取得的會員資料
      onClickproduc:{},
   }
  },
   watch:{
      '$route'(to, from) {
        this.$router.go(0);
      },
   },
  methods:{
    handleScroll(){ //監聽卷軸是否到底部方法
    if(this.FilterProducts.length>=this.showFilterItem.length){ //節省效能，只有所有篩選的長度大於等於show的長度才監聽
    
    window.scrollY + window.screen.height > document.body.scrollHeight
      if(document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 300){ 
        this.showMore(); //捲到底部會呼叫載入更多
      }
    }
    },
    showMore(){
      this.isLoading=true;
        for(var i=0;i<1;i++){
          if(this.FilterProducts[this.showFilterItem.length+i]) //有東西再放
          this.showFilterItem.push(this.FilterProducts[this.showFilterItem.length+i]);
        }
        this.isLoading=false;
    },
    PDsort(num){
      switch(num){
        case 1: //熱門程度
        console.log( this.showFilterItem)
            this.showFilterItem=this.sortKey(this.showFilterItem,'subscribeCount')
            console.log( this.showFilterItem)
          break;
        case 2: //時間排序
          this.showFilterItem=this.sortKey(this.showFilterItem,'productDateTime')
          break;
      }
    },
     sortKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    passPDObject(PDOId){ //跳到產品展示的
       this.$router.push({
          path: `/productShow/${PDOId}`,
        })
    },
    passType(type){ //自轉搜尋的
       this.$router.push({
          path: `/productDisplayType/${type}`,
        })
    },
    jumptoFilter(keyWord){
      this.passType(keyWord);
    }
  }

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
.pdDisplay-container{
  min-height:100vh;
}
.PDP-item{ //產品卡的樣式
  margin-right: 30px;
}
.pdDisplay-sort{
  display: flex;
}
.pdDisplay{
  width:1200px;
  margin-left: auto;
  margin-right: auto;
}
  .pdDisplay-aside{
    display: flex;
     margin-top: 20px;
     border-top:1px solid gray;
     border-bottom:1px solid gray;
     padding-top: 10px;
     padding-bottom: 10px;
     padding-left: 70px;
    .pdDisplay-aside-item{
      margin-right: 75px;
      cursor: pointer;
      font-size: 1.5rem;
    }
  }
  .pdDisplay-h1{
    width:400px;
    // border-bottom: 2px solid #024E65;
    margin-left: auto;
    margin-right: auto;
  }
  .pdDisplay-main{
    width:100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 40px;
    
    .pdDisplay-item{
    display: flex;
    flex-wrap: wrap;
    }
  }
  //工具區
  .onColickSection{ //被點到的標籤會+顏色
  color:green !important;
  font-weight: bold;
}
  .newBtn{
  width:280px;
  height:50px;
  border-radius: 10px;
  border:0.5px solid gray;
  padding: 5px 10px;
  border:1px solid #024e66;
  color: #42B983;
  font-size: 1.2rem;
  margin-bottom: 20px;
  padding-top:10px;
  box-sizing: border-box;
  box-shadow: 1px 1px black;
}
.newBtn:hover{
  cursor: pointer;
  background: linear-gradient(left, #0793c5,#024e66 );
  color:white;
}
//響應式
@media screen and (max-width:1200px) {

  .pdDisplay{
    width:1200px;
  }
  .pdDisplay-container{
    width:1200px;
      // margin-left: 30px;
  }
    .pdDisplay-main{
   margin-left: 30px;
  }
}
@media screen and (max-width:1024px) {
    .productClass-Bar{
  width:1024px;
}
  .pdDisplay{
    width:1024px;
  }
   .pdDisplay-container{
     width:1024px;
     .pdDisplay-aside{
       .pdDisplay-aside-item{
         margin-right: 45px;
       }
     }
     .pdDisplay-main{
     margin-left: 45px;
     }
  }
}
@media screen and (max-width:768px) {
      .productClass-Bar{
  width:768px;
}
   .pdDisplay{
    width:768px;
  }
   .pdDisplay-container{
     width:768px;
     .pdDisplay-aside{
       .pdDisplay-aside-item{
         font-size: 1.2rem;
         margin-right: 20px;
       }
     }
     .pdDisplay-main{
     margin-left: 75px;
     margin-right: 75px;
     }
  }
  
}
</style>