<template>
  <div class="pdHshow">
      <div class="pdHshow-container">
          <div class="pdHshow-header">
            <div class="pdHshow-header-icon"><img :src="`${baseURL}${hisItem.productHistoryHeadShot}`" :alt="hisItem.productHistoryTitle" width="300" height="200"></div>
               <div class="pdHshow-article">
                <div><h2 class="pdHshow-article-h2">{{hisItem.productHistoryTitle}}</h2></div>
                <div><p>版本號:{{hisItem.productHistoryVersion}}</p></div>
                </div>
                <div class="pdHshow-hisData">
                  <div class="PDHBtn">
                      <div class="newBtnS" @click="isedPDH=true" v-if="browseUserId==pHauthor" >修改此紀錄</div>
                      <CreatProductHis class="CPDH"
                        :createBtn="false"
                        :edPDHBase="hisItem"
                        :edPDHImg="hisImgs"
                        :edVideo="hisVideo"
                        v-if='isedPDH'
                        @close="reloadProduct"
                        />
                      <div class="newBtnS" @click=" delectPDH" v-if="browseUserId==pHauthor" >刪除此紀錄</div>
                      <div class="newBtnS" @click="$emit('close')" >關閉</div>
            </div>
                    <p>紀錄時間:{{hisItem.productHistorytDateTime}}</p>
                </div>
          </div>
          <div class='backgroundBar-main backgroundBar'> <h2>紀錄內容</h2></div>
          <div class="pdHshow-content">
              <vue-markdown :source="hisItem.productHistoryContent"></vue-markdown>
          </div>
           <div class='backgroundBar backgroundBar-main' v-if="hisVideo!='' || showpdHisImgs.length>0 "><h2>歷程媒體</h2></div>
          <div class="pdHsjow-media-container"  v-if="hisVideo!='' || showpdHisImgs.length>0 ">
            <div class="pdHshow-media" v-if="hisVideo!='' || hisImgs.length>0">
            <slider class="mediaSlider" v-if="hisVideo!='' || showpdHisImgs.length>0 " :autoPlay="!autoPlay"  :interval="8000"
            :stopOnHover="stopHover"  animation="fade"  width="800px"   height="500px"  indicators="center"  >
              <slider-item
              v-if="hisVideo !== ''"  :style="hisVideo" >
              <iframe  width="800"   height="500"  :src="hisVideo"  title="YouTube video player"  frameborder="1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"  allowfullscreen></iframe>
            </slider-item>
           <slider-item
              v-for="i,index in showpdHisImgs" :key="index"
              :style="i"
            >
              <img :src="`${baseURL}${i}`" width="800" height="500"/>
            </slider-item>
          </slider>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import CreatProductHis from "./CreatProductHis.vue"
import { Slider, SliderItem } from "vue-easy-slider";
import{getProductHisMedia} from"../Allapi"
import{getProduct}from"../Allapi"
import{deletePdHis}from"../Allapi"
export default {
    inject: ["reload"], //在后代组件中注入，並调用这个方法即可刷新路由啦。
    components:{
        VueMarkdown,Slider,SliderItem,CreatProductHis
    },
    created(){
       getProduct(this.hisItem.productId) //為了取得本歷程的作者
            .then(res=>{
                    this.pHauthor=res.data.userId;
                     this.hisItem.productHistorytDateTime=this.hisItem.productHistorytDateTime.slice(0,16)
            })
       getProductHisMedia(this.hisItem.productHistoryMediaId)
            .then(res=>{
                if(res.data[0]!=undefined){
                this.hisItemMedia=res.data;
                if(res.data[0].productHistoryMediaVideoPath!=null){this.hisVideo=res.data[0].productHistoryMediaVideoPath;}
                this.hisImgs[0]={productHistoryMediaPathOne:res.data[0].productHistoryMediaPathOne};
                this.hisImgs[1]={productHistoryMediaPathTwo:res.data[0].productHistoryMediaPathTwo};
                this.hisImgs[2]={productHistoryMediaPathThree:res.data[0].productHistoryMediaPathThree};
                this.hisImgs[3]={productHistoryMediaPathFour:res.data[0].productHistoryMediaPathFour};
                this.hisImgs[4]={productHistoryMediaPathFive:res.data[0].productHistoryMediaPathFive};
                //裝照片給Slider，因為他很難用
                if(this.hisImgs[0].productHistoryMediaPathOne!=null){this.showpdHisImgs.push(this.hisImgs[0].productHistoryMediaPathOne)};
                if(this.hisImgs[1].productHistoryMediaPathTwo!=null){this.showpdHisImgs.push(this.hisImgs[1].productHistoryMediaPathTwo)};
                if(this.hisImgs[2].productHistoryMediaPathThree!=null){this.showpdHisImgs.push(this.hisImgs[2].productHistoryMediaPathThree)};
                if(this.hisImgs[3].productHistoryMediaPathFour!=null){this.showpdHisImgs.push(this.hisImgs[3].productHistoryMediaPathFour)};
                if(this.hisImgs[4].productHistoryMediaPathFive!=null){this.showpdHisImgs.push(this.hisImgs[4].productHistoryMediaPathFive)};
                }
            })
    },
    props:['hisItem'],
    data(){
        return{
            pHauthor:'',//這個產品歷程的作者
            showpdHisImgs:[],//用來裝Slider照片的
            browseUserId:this.$cookies.get('token'),
            hisItemMedia:[],//歷程媒體櫃
            hisVideo:'',//影片
            hisImgs:[],//圖片
            autoPlay: false, //Slider的自動倫波功能
            interval: 12000, //輪播的delay
            stopHover: true, //璇停時暫停輪播
            isedPDH:false,//是否編輯產品歷程
            baseURL:'http://34.80.165.225/',
        }
    },
    methods:{
      reloadProduct(){
        // this.isedPDH=false;
        this.reload();
      },
        delectPDH(){
            var c=confirm("刪除後無法回復，確定要刪除紀錄?");
            if(c){
            deletePdHis(this.hisItem.productHistoryId)
                .then(res=>{
                    console.log(res);
                    this.reload();
                })
            }else{return}
        },
        editPDH(){

        }
    }
}
</script>

<style lang="scss">
.pdHshow-content{
  text-align: left;
}
.pdHshow-article-h2{
  font-size: 2rem;
     }
    .pdHshow{
        width:1260px;
        margin-left: auto;
        margin-right: auto;
        background-color: rgba(55,55,55,0.5);
        box-sizing: border-box;
        .pdHshow-container{
            width:1260px;
            margin-left: auto;
            margin-right: auto;
            background-color: white;
            // padding:20px;
            box-sizing: border-box;
            .pdHshow-header{
              margin-top: 20px;
              margin-bottom: 20px;
              display: flex;
              background-color: #f2f2f2;
            }
            .pdHshow-header-icon{
                width:300px;
                height:200px;
                margin-right:20%;
                // margin-left: auto;
            }
            .pdHshow-article{
                // display: flex;
                border-bottom:1px solid black;
                // border-top-right-radius: 100%;
                // border-bottom-right-radius: 100%;
                height:70px;
            }
            .pdHshow-content{
               margin-top:20px;
                 background-color: #f2f2f2;
            }
            .pdHshow-hisData{
                margin-top: auto;
                margin-left: auto;
            }
            .pdHsjow-media-container{
              margin-top: 20px;
              margin-bottom: 20px;
               background-color: #f2f2f2;
                 .pdHshow-media{
                width:800px;
                height:500px;
                margin-left: auto;
                margin-right: auto;
            }
            }
            
        }
    }
    .CPDH{
      position: absolute;
      left:14.5%;
      top:20%;
      box-sizing: border-box;
      z-index: 9999;
    }
    .PDHBtn{
      margin-right: auto;
      width:170px;
    }
//控制Slider
.backgroundBar{
  width:1260px;
}
.backgroundBar-main{
  height:33px;
  color: white;
}
.mediaSlider{
  margin-left: auto;
  margin-right: auto;
}
.slider-indicators[data-v-f56384ae] {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px;
  .slider-indicator-icon[data-v-f56384ae] {
    background-color: rgba(0, 0, 255, 0.2);
  }
  .slider-indicator-icon:hover {
    background-color: blue;
  }
}
.slider-item[data-v-31f46842] {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  img {
    height: auto;
  }
}
.slider-btn[data-v-f56384ae] {
  height: 100px !important;
  top: 40% !important;
}
.newBtnS{
  width:150px;
  border-radius: 100px;
  border:0.5px solid gray;
  padding: 5px 10px;
}
.newBtnS:hover{
    color: white;
  cursor: pointer;
  background: linear-gradient(left, #0793c5,#024e66 );
}
//響應式
@media screen and (max-width:1200px) {
  .backgroundBar{
  width:1200px;
  }
   .CPDH{
      left:0%;
    }
      .pdHshow{
        width:1200px;
  
        .pdHshow-container{
            width:1200px;
            .pdHshow-header-icon{
                padding-left: 20px;
            }

            .pdHshow-content{
                padding-left: 20px;
            }
        }
    }

}
@media screen and (max-width:1024px) {
    .backgroundBar{
  width:1024px;
  }
   .CPDH{
      left:0%;
    }
      .pdHshow{
        width:1024px;
  
        .pdHshow-container{
            width:1024px;
            .pdHshow-header-icon{
                padding-left: 20px;
            }
            .pdHshow-content{
                padding-left: 20px;
            }
            .PDHBtn{
              margin-right: 40px;
            }
        }
    }
}
@media screen and (max-width:768px) {
  .backgroundBar{
  width:768px;
  }
   .CPDH{
      left:0%;
    }
      .pdHshow{
        width:768px;
  
        .pdHshow-container{
            width:768px;
            .pdHshow-header-icon{
                padding-left: 20px;
            }
            .pdHshow-content{
                padding-left: 20px;
            }
            .pdHsjow-media-container{
                 .pdHshow-media{
                width:768px;
                height:auto;
                margin-left: auto;
                margin-right: auto;
                .mediaSlider{
                  width:768px;
                  img{
                    width:768px;
                  }
                  iframe{
                    width:768px;
                  }
                }
            }
            }
            .PDHBtn{
              margin-right: 40px;
            }
        }
    }
 
}
    
</style>