<template>
  <div class="subShow">
     <div class="subShowBody">
         <h4>{{title}}</h4>
         <p v-if="data.length==0">{{subtitle}}</p>
         <MeberBar v-for="i,index in data" :key="index"
            :userHeadShot="i.userHeadShotPath"
            :userAccount="i.userAccount"
            :userId="i.userId"
         />
          <button class="newBtnS display-Block suB-btn" type="button"  @click="$emit('close')">關閉</button>
     </div>
  </div>
</template>

<script>
import MeberBar from "../components/MeberBar.vue"
import {getAfllow} from '../Allapi'
import{getAfllowed} from'../Allapi'
import{getProductFllower} from '../Allapi'

export default {
    props:['subType','id'],
    components: {
         MeberBar,
         },
    created(){
        switch(this.subType){
            case 1:
                this.title="我訂閱的會員"
                this.subtitle="目前沒有訂閱別的會員"
                getAfllow(Number(this.id))
                .then(res=>{
                    this.data=res.data;
                    this.data.forEach(item=>{item.userHeadShotPath=item.userHeadShotPath;})
                })
                break
            case 2:
                this.title="訂閱我的會員"
                this.subtitle="目前還沒有人訂閱我"
                getAfllowed(Number(this.id))
                 .then(res=>{
                    this.data=res.data;
                    this.data.forEach(item=>{item.userHeadShotPath=api+item.userHeadShotPath;})
                    close.log(res)
                })
                break
            case 3:
                getProductFllower(Number(this.id))
                 .then(res=>{
                    this.data=res.data;
                    this.data.forEach(item=>{item.userHeadShotPath=api+item.userHeadShotPath;})
                    close.log(res)
                })
                this.title="收藏此專案的會員"
                this.subtitle="目前還沒有人收藏此專案"
                break
        }
    },
    data(){
        return{
             title:'',//本頁title
             subtitle:'',//沒有訂閱時顯示的資料
             data:[],//拿來裝資料的
        }
       
    },

}
</script>

<style lang="scss">

.subShowBody{
    width:200px;
    max-height:200px;
    margin-left: auto;
    margin-right:auto;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: #EFEFEF;
    padding: 10px;
    // display: flex;
    // flex-wrap: wrap;
}
//工具
.display-Block{
    display: block;
}
.newBtnS{
  width:150px;
  border-radius: 100px;
  border:0.5px solid gray;
  padding: 5px 10px;
}
.newBtnS:hover{
  transform: scale(0.9);
  cursor: pointer;
}
.suB-btn{
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
}

</style>