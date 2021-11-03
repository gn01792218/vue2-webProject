<template>
<div class="recommendBar-container">
    <div class="recommendBar-container-title"><h2>為您推薦同類的專案:</h2></div>
    <div class="recommendBar-item">
    <Product class="recommendBar-PD" v-for="i,index in sortProduct" :key="index"
        :productObject="i"
        @open="passPDObject($event.productId)"
    />
    </div>
</div>
</template>

<script>
//接getProducttypeㄉAPI進來，然後依照日期排序
import Product from'../components/Product.vue'
import{getProductBycategory} from "../Allapi"
export default {
    props:['productType'],//外面傳入現在要依照什麼分類來排序
    inject: ["sortKey"], //排序方法
    components:{
        Product,
    },
    watch:{
        productType:function(){
        if(this.productType){
        getProductBycategory(this.productType)
            .then(async(res)=>{
                var temp=res.data;
                // const api="http://34.80.165.225/";
                 //在這裡進行排序
                temp=await this.sortKey(temp,'productDateTime');
                  temp.forEach((item,index)=>{
                   if(index<12){ //只要12則
                  item.productHeadShotPath=item.productHeadShotPath;
                  this.sortProduct.push(item)
                   }else{return}
                 })
            })
            }
        }
    },
    methods:{
          passPDObject(PDOId){
       this.$router.push({
          path: `/productShow/${PDOId}`,
        })
    },
    },
    data(){
        return{
            sortProduct:[],//放排序好的產品
        }
    },
}
</script>

<style lang="scss">
    .recommendBar-container{
        border-top: 2px solid black;
        width:1260px;
        margin-left: auto;
        margin-right: auto;
        overflow-x: scroll;
        margin-bottom: 20px;
        .recommendBar-container-title{
            margin-right: auto;
            width:250px;
            border-top: 5px solid black;
        }
        .recommendBar-item{
           display: flex;
           padding-top: 20px;
           box-sizing: border-box;
        }
    }
    .recommendBar-PD{
        margin-right: 20px;
    }
//響應式
@media screen and (max-width:1200px) {
     .recommendBar-container{
        width:1200px;
    }
    .recommendBar-PD{
        margin-left:10px;
        margin-right: 10px;
    }
}
@media screen and (max-width:1024px) {
      .recommendBar-container{
        width:1024px;
    }
    .recommendBar-PD{
        margin-left:10px;
        margin-right: 10px;
    }
 
}
@media screen and (max-width:768px) {
        .recommendBar-container{
        width:768px;
    }
    .recommendBar-PD{
        margin-left:10px;
        margin-right: 10px;
    }
 
}

</style>