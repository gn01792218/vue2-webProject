<template>
        <article class="myProduct">
        <header class="myProduct-header"><h2>我的產品</h2></header>
         <p v-if="this.mypropducts.length<1">目前還沒有個人專案</p>
        <div class="myProduct-main">
          <product class="pd"
            v-for="i in mypropducts" :key="i"
            :productObject="i"
            @open="$emit('openProduct',i)"
          />
        </div>
      </article>
</template>
<script>
import Product from '../components/Product'
import {getProductByuserId} from'../Allapi'
// import Product from './Product.vue'
export default {
   components:{
   Product,
  },
  created(){
    getProductByuserId(this.$cookies.get('token'))
      .then(res=>{
        this.mypropducts=res.data;
      })
  },
    props:[ "mypropducts"],  //接收外面傳進的產品物件
    methods:{
    }
}
</script>
<style lang="scss">
%mlr-center{
  margin-left: auto;
  margin-right: auto;
}
.myProduct{
  max-width:1300px;
  height:600px;
  @extend %mlr-center;
  overflow:auto;
  overflow-x:auto;
  overflow-y:500px;
  background-color: #F2F2F2;
  .myProduct-header{
    display:block;
  }
  .myProduct-main{
    width:100%;
    padding: 20px;
    z-index: -1;
    display: flex;
    flex-wrap:wrap;
  }
}

</style>