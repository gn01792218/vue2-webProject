<template>
<div class="ProductHistoryShow">
    <h1>{{productName}}的專案歷程</h1>
     <div class='backgroundBar'></div>
       <ProductHistoryItemShow class="PHS"
        v-if="isShowItem"
        :hisItem="onClickHis"
        @close="isShowItem=false"
    />
    <section class="ProductHistoryShow-container" v-if="allPdHis.length>0">
        <div class="ProductHistoryShow-item" v-for="i,index in allPdHis" :key="index" @click="ShowItem(i.productHistoryId)">
            <div class="item-Icon">
                <img :src="`${baseURL}${i.productHistoryHeadShot}`" :alt="i.productName" width="100" height="100">
            </div>
            <div class="item-article">
                <p>版本號:{{i.productHistoryVersion}}</p>
                <p>{{i.productHistorytDateTime}}</p>
            </div>
        </div>
    </section>
    <p v-if="allPdHis.length==0">此產品目前尚無歷程記錄</p>
</div>
  
</template>

<script>
import ProductHistoryItemShow from'../view/ProductHistoryItemShow.vue';
import {getProduct} from '../Allapi';
import{getProductAllHis}from '../Allapi';
export default {
    components:{
        ProductHistoryItemShow,
    },
    created(){
        getProduct(this.productId)
            .then(res=>{
                this.productName=res.data.productTitle;
            })
        getProductAllHis(this.productId)
            .then(res=>{
                this.allPdHis=res.data;
               
                this.allPdHis.forEach(item=>{
                    item.productHistoryHeadShot=item.productHistoryHeadShot;
                })
            })
    },
    data(){
        return{
            productId:this.$route.params.productId,//產品id
            productName:'',//產品名稱
            allPdHis:[],//裝所有產品歷程
            isShowItem:false,//是否show歷程
            onClickHis:{},//當前被點到的是哪一個產品歷程
            baseURL:'http://34.80.165.225/',
        }
    },
    methods:{
        ShowItem(hisId){
            this.isShowItem=true;
            for(var i=0;i<this.allPdHis.length;i++){
                if(this.allPdHis[i].productHistoryId==hisId){
                    this.onClickHis=this.allPdHis[i];
                    return
                }
            }
        },
    }

}
</script>

<style lang="scss">
.ProductHistoryShow-container{
    margin: 20px;
    width:1200px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    .ProductHistoryShow-item{
        margin-left: 5px;
        margin-right: 5px;
        .item-Icon{
            filter: grayscale(100%);
            background-color: antiquewhite;
            border-radius: 5px;
        }
        .item-Icon:hover{
            transform: scale(1.2);
            filter: grayscale(0%);
            transition: filter 0.5s ease,transform 1s ease;
        }
    }
}
.PHS{
    
    // position: absolute;
    // top:35%;
    // left:18%;
}
//工具
.backgroundBar{
  width:1200px;
  height:20px;
  background: linear-gradient(left, #024e66, #0793c5);
  margin-left: auto;
  margin-right: auto;
}
//響應式
@media screen and (max-width:1200px) {

}
@media screen and (max-width:1024px) {
    //工具
.backgroundBar{
  width:1024px;
}
.ProductHistoryShow-container{
    width:1024px;
}

}
@media screen and (max-width:768px) {
    .backgroundBar{
  width:768px;
}
.ProductHistoryShow-container{
    width:768px;
    .ProductHistoryShow-item{
        margin-left: 25px;
        margin-right: 15px;
    }
}
}

</style>