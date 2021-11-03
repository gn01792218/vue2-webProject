<template>
  <div class="PDS">
    <!-- @load="showProduct=showProduct" -->
    <div class="productShow" v-if="!editProduct">
      <h1>專案展示</h1>
      <div class='backgroundBar'></div>
      <header class="productShow-header">
        <div class="productShow-author">
          <div class="author-background">
            <MeberBar
             :userHeadShot="userAccount.userHeadShotPath"
             :userAccount="userAccount.userAccount"
             :userId="showProduct.userId"
            />
          </div>
        </div>
        <div class="productShow-header-main">
          <div class="productShow-header-main-icon">
            <img
              :src="`${baseURL}${showProduct.productHeadShotPath}`"
              :alt="showProduct.productTitle"
              width="500"
              height="400"
            />
              <article class="productShow-header-main-article">
            <div class="productShow-header-main-article-title">
              <h2>{{ showProduct.productTitle }}</h2>
              <div class="pLine"><p>{{showProduct.productDateTime}}</p></div>
            </div>
          </article>
          </div>
          <section class="productShow-header-main-section2">

            <div class="title-Line"> <h3>{{ showProduct.productTitle }}</h3>   </div>
              <p>{{ showProduct.productSubtitle }}</p>
             <a :href="showProduct.productUrl" target="_blank"> <div class="newBtn">專案連結</div></a>
             <div class="newBtn"  @click="passProductId(showProduct.productId)">觀看歷程</div>
          </section>
         
          <div v-if="isMyProduct" class="editMyproduct">
            <!--只有是我的產品時才會顯示編輯按鈕-->
            <div class="dropOption">
              <div class="newBtnS"  @click="isCreatHis=true" v-if="browseUserId==showProduct.userId">創建專案歷程紀錄</div>
              <div class="newBtnS" @click="edMyproduct" v-if="browseUserId==showProduct.userId">編輯我的專案</div>
              <div class="newBtnS" @click="delectProduct" v-if="browseUserId==showProduct.userId">刪除我的專案</div>
                <section class="productShow-header-main-section1">
                   <p class="font-weight-bold">專案回應:{{ contentsData.length }}</p>
                <div class="upvoteCount">
                    <div class="upvote-img"></div>
                    <p>被收藏數:{{productFllowerCount}}</p>
                </div>
                <div class="newBtnSlect pds-select" @click="fllowed">收藏</div>
                <div class="newBtnSlect" @click="isShowPDFllowed=true">收藏者</div>
                 <SubscriptShow class="SUB"
                      v-if="isShowPDFllowed"
                      :subType="3"
                      :id="showProduct.productId"
                      @close="isShowPDFllowed=false"
                    />
          </section>
            </div>
          </div>
        </div>
      </header>
      <section  class="productShow-imgs">
        <div class="productShow-imgs-header" v-if="productMediaVideoPath!='' || showImgs.length>0">
          <div class="productShow-imgs-header-h2"></div></div>
        <div class="pictures">
          <!-- <carousel-3d class="D3-slider" :autoplay="true" :autoplayTimeout="3000" :autoplayHoverPause="true" :perspective="35" :display="6" :width="800" :height="500" :inverseScaling="800" :controlsVisible="true" >
            <slide v-for="(i, index) in showImgs" :key="index" :index="index" >
              <img :src="`${baseURL}${i}`" width="800"  height="500" v-if="index!=5">
              <iframe v-if="index==5"
                width="800"  height="500"   :src="showImgs[5]"  title="YouTube video player"  frameborder="1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </slide>
            </carousel-3d> -->
          <slider class="mediaSlider"
            v-if="productMediaVideoPath!='' || showImgs.length>0" :autoPlay="!autoPlay" :interval="12000" :stopOnHover="stopHover"  animation="fade"
            width="1000px" height="600px"  indicators="center" >
           <slider-item
              v-if="productMediaVideoPath!==''"
              :style="productMediaVideoPath"
            >
              <iframe
                width="1000"  height="600"   :src="productMediaVideoPath"  title="YouTube video player"  frameborder="1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </slider-item>
           <slider-item
            v-for="i,index in showImgs" :key="index"  :style="i"
            >
              <img :src="`${baseURL}${i}`" width="1000"  height="600"/>
            </slider-item>
          </slider>
        </div>
      </section>
      <section class="productShow-description">
        <div class="productShow-description-h2"></div>
        
        <vue-markdown
          class="description"
          :source="showProduct.productContent"
        ></vue-markdown>
      </section>
      <section class="productShow-discuss">
        <h2 class="font-weight-bold section-header">專案討論區</h2>
        <div class="leaveMsg">
          <div class="createdPDComment"  @click="leaveMsg">+參與評論</div>
          <div class="pdShow-markdown" v-if="isleaveMsg">
            <quill-editor v-if="isleaveMsg" v-model="content" class="pdShow-textEditor"
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
                        </quill-editor>
          </div>
           <div v-if="isleaveMsg" class="display-flex">
                      <div class="newBtnS" @click="confirmMsg" >送出</div>
                      <div class="newBtnS" @click="dismisMsg" >取消</div>
            </div>
        </div>
        <div class="msgShow" v-if="contentsData.length > 0">
          <LeaveMSG v-for="(i, index) in contentsData"  :key="index"
              :Comment="i"
              :isPDC="true"
          />
        </div>
         <div class="createdPDComment" v-if="contentsData.length>4"  @click="leaveMsg2">+參與評論</div>
          <div class="pdShow-markdown" v-if="isleaveMsg2">
            <quill-editor v-if="isleaveMsg2" v-model="content" class="pdShow-textEditor"
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
                        </quill-editor>
          </div>
          <div v-if="isleaveMsg2" class="display-flex" >
                      <div class="newBtnS" @click="confirmMsg" >送出</div>
                      <div class="newBtnS" @click="dismisMsg" >取消</div>
            </div>
      </section>
    </div>
     <recommendBar
     :productType="showProduct.productCategory"
    />
    <creatProduct class="productShow-CPD"
       v-if="editProduct"
       :productVideoPath="productMediaVideoPath"
       :productImg="productImg"
       :pageTitle="pageTitle"
       :editProduct="showProduct"
       @close="reloadPD"
      />
        <creatProductHis class="productShow-CPDH"
                    v-if="isCreatHis"
                    :ProductId="showProduct.productId"
                    :productTitle="showProduct.productTitle"
                    :productHeadShot="showProduct.productHeadShotPath"
                     :productContent="showProduct.productContent"
                     :createBtn="true"
                      @close="isCreatHis=false"
                />
  </div>
</template>

<script>
//這是產品展示頁---->要改成彈跳視窗~!!!!!!!!!!!!!
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'  //引入编辑器
import { Slider, SliderItem } from "vue-easy-slider";
import VueMarkdown from "vue-markdown";
import LeaveMSG from "./LeaveMSG.vue"
import MeberBar from "../components/MeberBar.vue"
import recommendBar from '../components/recommendBar'
import CreatProduct from "./CreateProduct.vue"; //當成編輯專案的頁面-->把資料都傳進來即可
import CreatProductHis from"./CreatProductHis.vue";
import SubscriptShow from './SubscriptShow.vue'
import{getProduct}from"../Allapi";
import { getProductMedia } from "../Allapi";
import {deleteProduct} from"../Allapi";
import { getUserInfo } from "../Allapi";
import { creatComments } from "../Allapi";
import { getProductComments } from "../Allapi";
import {userFllowerProduct} from "../Allapi";
import {getProductFllower}from "../Allapi";

export default {
  components: {
    Slider,
    SliderItem,
    VueMarkdown,
    CreatProduct,
    CreatProductHis,
    LeaveMSG,
    MeberBar,
    SubscriptShow,
    recommendBar,
     quillEditor,
          Quill,
  },
  inject: ["reload"], //在后代组件中注入，並调用这个方法即可刷新路由啦。
  // props: ["showProduct"], //接收外面傳進的產品物件；
  created() {
    getProduct(this.$route.params.productId)
      .then(async(res)=>{
        this.showProduct=res.data;
        this.showProduct.productHeadShotPath=this.showProduct.productHeadShotPath;
        this.showProduct.productDateTime=this.showProduct.productDateTime.slice(0,10)
        this.showProduct.productDateTime=this.showProduct.productDateTime.replaceAll('-','.');
        //取得使用者資訊及產品相關資訊
          getUserInfo(this.showProduct.userId) //取得這個產品的使用者id
      .then((res) => {
        this.userAccount = res.data;
        this.userAccount.userHeadShotPath=this.userAccount.userHeadShotPath;
      });
    getProductMedia(this.showProduct.productMediaId) //取得這個產品的媒體櫃
      .then((res) => {
        this.productImg[0]={productMediaPathOne:res.data.productMediaPathOne};
        this.productImg[1]={productMediaPathTwo:res.data.productMediaPathTwo};
        this.productImg[2]={productMediaPathThree:res.data.productMediaPathThree}
        this.productImg[3]={productMediaPathFour:res.data.productMediaPathFour}
        this.productImg[4]={productMediaPathFive:res.data.productMediaPathFive}
        if(res.data.productMediaPathOne!=null){this.showImgs.push(this.productImg[0].productMediaPathOne)};
        if(res.data.productMediaPathTwo!=null){this.showImgs.push(this.productImg[1].productMediaPathTwo)};
        if(res.data.productMediaPathThree!=null){this.showImgs.push(this.productImg[2].productMediaPathThree)};
        if(res.data.productMediaPathFour!=null){this.showImgs.push(this.productImg[3].productMediaPathFour)};
        if(res.data.productMediaPathFive!=null){this.showImgs.push(this.productImg[4].productMediaPathFive)};
        if (res.data.productMediaVideoPath != undefined) { //有影片回來時才要+
          this.productMediaVideoPath = res.data.productMediaVideoPath;
          // this.showImgs.push(res.data.productMediaVideoPath);
        }
      });
    getProductComments(this.showProduct.productId) //取得該產品的所有留言
      .then(async(res) => {
        const temp = res.data;//裝所有留言的資料
        const apiList = temp.map(async(item) => await getUserInfo(item.userId)); //把每個使用者裝到一個List中
        const newList = await Promise.all(apiList);//等到所有的使用者資訊都裝好了，再放到新List中
        temp.forEach((item,index) => { //開始為我們的每個留言資料增加使用者的帳號和照片
            item.userAccount = newList[index].data.userAccount;
            item.userHeadShotPath = newList[index].data.userHeadShotPath
        })
        this.contentsData = temp;
      });
     getProductFllower(this.showProduct.productId)
        .then(res=>{
            this.productFllower=res.data;
            this.productFllowerCount=res.data.length;
            this.productFllower.forEach(item=>{
              if(item.userId==this.$cookies.get('token')){
                 document.querySelector('.pds-select').classList.add('isfllowed');
              }
            })
        })
      })
    },
  data() {
    return {
      baseURL:'http://34.80.165.225/',
      onClicComment:'',
      showProduct:{},
      showImgs:[],//用來放進本頁Slider中的
      pdCatagory:'',//產品類型
      pageTitle:"編輯產品",
      autoPlay: false, //Slider的自動倫波功能
      interval: 8000, //輪播的delay
      stopHover: true, //璇停時暫停輪播
      productImg: [], //裝圖片
      productMediaVideoPath:'', //裝影片連結的
      userAccount: "", //該產品的作者
      productFllowerCount:0,//該產品的追蹤人數
      productFllower:[],//訂閱該產品的所有會員
      browseUserId: this.$cookies.get("token"), //現在瀏覽的是誰
      editProduct: false, //是否處於編輯產品的狀態
      edMsg: false, //是否處於修改留言的狀態
      isCreatHis:false,
      isMyProduct: true, //是我的產品才會顯示編輯按鈕
      isShowPDFllowed:false,//是否顯示此產品被那些人追蹤的欄位
      contentsData: [], //裝下創建時候從外面傳進來的，裡面包含了該則留言的使用者名稱
      contents: [], //裝下本產品中的所有留言
      content: "", //撰寫留言時的內容
      EDcontent: this.content,
      dontCheck: false,
      demovideo: "https://www.youtube.com/embed/vOuAR5G1Jwo",
      isleaveMsg: false,
      isleaveMsg2: false,
       editorOption: {
              modules: {
                toolbar: [
                  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                  ["blockquote", "code-block"], // 引用  代码块
                  [{ header: 1 }, { header: 2 }], // 1、2 级标题
                  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                  [{ script: "sub" }, { script: "super" }], // 上标/下标
                  [{ indent: "-1" }, { indent: "+1" }], // 缩进
                  // [{'direction': 'rtl'}],                         // 文本方向
                  // [{ size: ["small", true, "large", "huge"] }], // 字体大小
                  [{ header: [1, 2, 3, 4, 5, 6, true] }], // 标题
                  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                  [{ font: [] }], // 字体种类
                  [{ align: [] }], // 对齐方式
                  ["clean"], // 清除文本格式
                  ["link", "video"] // 链接、图片、视频
                ], //工具菜单栏配置
              },
              placeholder: '請在此輸入留言', //提示
              readyOnly: false, //是否只读
              theme: 'snow', //主题 snow/bubble
              syntax: true, //语法检测
            },
    };
  },
  watch:{
    '$route'(to, from) {
        this.$router.go(0);
      },
  },
  methods: {
    reloadPD(){
      this.reload();
    },
    passProductId(productId){
       this.$router.push({
          path: `/ProductHistoryShow/${productId}`,
       })
    },
    leaveMsg() {
      if (this.$cookies.get("token") != null) {
      this.isleaveMsg = true;
      } else {
        alert("留言屬於會員專屬功能，請先登入會員，或註冊會員唷~");
         this.$router.push('/login');
      }
    },
    leaveMsg2() {
      if (this.$cookies.get("token") != null) {
      this.isleaveMsg2 = true;
      } else {
        alert("留言屬於會員專屬功能，請先登入會員，或註冊會員唷~");
         this.$router.push('/login');
      }
    },
    confirmMsg() {
      //有登入的人才可以留言
        var commentBody = {
          productId: this.showProduct.productId,
          userId: this.$cookies.get("token"),
          commentContent: this.content,
        };
        creatComments(commentBody).then((res) => {
          var temp = res.data; //抓到這則留言的資料
          getUserInfo(res.data.userId) //取得留言主人的資料
            .then((res) => {
              temp.userAccount = res.data.userAccount; //取得這則留言的帳號名稱，和上面的留言訊息一起包裝起來
              temp.userHeadShotPath = res.data.userHeadShotPath;
              this.contentsData.push(temp); //最後整包push到本地的contentsData
              this.content="";
            });
        });
        this.isleaveMsg = false;
         this.isleaveMsg2 = false;
    },
    dismisMsg() {
      this.isleaveMsg = false;
      this.isleaveMsg2 = false;
    },
    edMyproduct() {
      this.editProduct = true;
    },
    fllowed(){//按第一下是追蹤；第二下是取消追蹤
        //傳入userId和ProductId為參數
        if(this.$cookies.get('token')!=null){
        const FllowerData={followUserId:this.$cookies.get('token'),followedProductId:this.showProduct.productId};
        userFllowerProduct(FllowerData)
            .then(res=>{
                  if(res.status==201){
                    this.productFllowerCount++;
                    document.querySelector('.pds-select').classList.add('isfllowed');
                }else if(res.status==204){
                    this.productFllowerCount--;
                    document.querySelector('.pds-select').classList.remove('isfllowed');
                }
            })
        }else{
          alert("收藏專案是會員專屬功能~請先登入或註冊")
           this.$router.push('/login');
        }
    },
    delectProduct(){
      var c= confirm('專案將永久刪除，並且無法回復，你確定嗎？');
      if (c) { // 確定刪除
         deleteProduct(this.showProduct.productId) 
        .then(res=>{
          this.$router.go(-1);
          // this.$router.push('/');
        })
      } else {
      return
    }
  },
}
}
</script>
<style lang="scss">
%mlr-center {
  margin-left: auto;
  margin-right: auto;
}

.SUB{
  position: absolute;
  z-index: 100;
}
.pdShow-markdown {
  height:350px;
}
.pdShow-textEditor{
  height:300px;
}
.display-flex{
  display: flex;
}
.pictures{
  background-color: #f2f2f2;
  padding-top: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.description {
  padding-left: 100px;
  text-align: left;
}
.productShow-description{
   box-sizing: border-box;
   text-align: left;
    border-top: 2px solid black;
      margin-top: 40px;
   .productShow-description-h2{
     margin-bottom: 20px;
     border-top: 5px solid black;
     width:100px;
     
   }
   h2{
     margin-top: 0;
     padding-top: 20px;
   }
}
.productShow-imgs-header{
    box-sizing: border-box;
    text-align: left;
     margin-top: 80px;
     border-top: 2px solid black;
   .productShow-imgs-header-h2{
     margin-bottom: 20px;
     padding-top: 20px;
     border-top: 5px solid black;
    width:120px;
     h2{
        margin-top: 0;
     }
   }
}
.productShow-discuss{
  h2{
   padding-top:20px;
  }
}
.font-weight-bold{
  font-weight: bold;
}
.PDS{
 box-sizing: border-box;
 width:1200px;
 margin-left: auto;
 margin-right: auto;
}
.productShow {
  box-sizing: border-box;
  width: 1300px;
  // border: 3px solid #2ac5b3;
  border-radius: 5px;
  background-color: white;
  @extend %mlr-center;
  padding: 20px;
  box-sizing: border-box;
}
.productShow-author {
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: -30px;
  .author-background{
    display: static;
    background-color: #f2f2f2;
    width:500px;
    height: 80px;
    display: flex;
    padding-top:15px;
    padding-left: 10px;
    box-sizing: border-box;
     border-bottom-right-radius: 100px;
  border-top-right-radius:100px ;
  }
}
.productShow-header {
  width: 1200px;
  height: 500px;
  margin-top: 20px;
  @extend %mlr-center;
  .productShow-header-main {
    width: 1200px;
    display: flex;
    @extend %mlr-center;
    .productShow-header-main-icon {
      position: relative;
      border-radius: 5px;
      box-shadow: 5px 5px 8px grey;
      margin-right: 100px;
      .productShow-header-main-article{
      position: absolute;
      width:1000px;
       background: linear-gradient(left, #024e66, #0793c5);
       color:white;
      border-radius: 1px;
      bottom:-10%;
      left:38%;
      padding: 0px 20px;
      text-align: left;
      .productShow-header-main-article-title{
        display: flex;
        h2{
          margin-right: 20px;
          margin-top: 10px;
        }
        .pLine{
          border-bottom:2px solid gray;
          height:35px;
          color: white;
            p{
            margin-top: 10px;
            margin-bottom: 0;
        }
      }
      }
    }
    }
    .productShow-header-main-section1 {
      margin-top: 50px;
      margin-right: 20px;
    }
    .productShow-header-main-section2 {
      margin-top: 50px;
      margin-right: 20px;
      a {
        display: block;
        color: red;
      }
    }
  }
}
 .productShow-imgs-header{
      margin-bottom: 20px;
    }

.productShow-imgs {
  box-sizing: border-box;
  width: 1260px;
  margin-top: 50px;
  .pictures {
    display: flex;
    @extend %mlr-center;
    margin-bottom: 10px;
  }
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

.editMyproduct{
  width:150px;
  margin-left: auto;
}
.edPDcomment{
  display: block;
}
.productShow-CPDH{
  position: absolute;
  left:17%;
  top:20%;
  z-index: 9999;
}
//工具
.isfllowed{
  background-color: red; //專門給已經訂閱的
  color:white;
}
.display-Block{
  display: block;
}
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
.backgroundBar{
  width:1260px;
  height:20px;
  background: linear-gradient(left, #024e66, #0793c5);
}
  .section-header{
     background: linear-gradient(left, #024e66, #0793c5);
    color: white;
    height: 50px;
  }
.title-Line{
  border-bottom:2px solid black;
  margin-bottom: 20px;
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
.newBtnS{
  width:150px;
  border-radius: 100px;
  border:0.5px solid gray;
  padding: 5px 10px;
}
.newBtnS:hover{
  // transform: scale(0.9);
  color: white;
  cursor: pointer;
  background: linear-gradient(left, #0793c5,#024e66 );
}
.newBtnSlect{
  width:150px;
  border-radius: 100px;
  border:0.5px solid palevioletred;
  padding: 5px 10px;
  color: black;
}
.newBtnSlect:hover{
  transform: scale(0.9);
  cursor: pointer;
}
.createdPDComment{
  width:180px;
  height:30px;
  margin-left: auto;
  margin-right: auto;
  background-color: orange;
  border-radius: 5px ;
  font-size: 1.2rem;
}
.createdPDComment:hover{
  transform: scale(1.1);
  opacity: 0.8;
  transition: transform 0.5s ease ,opacity 1s ease;
  cursor: pointer;
}
//響應式
@media screen and (max-width:1200px) {
.productShow {
  width: 1200px;
}
.productShow-CPD{
  position: absolute;
  left:-5%;
}
.productShow-CPDH{
  left:0%;
  top:30%;
}
.pdShow-markdown {
  width:1160px;
}
.productShow-imgs {
  box-sizing: border-box;
  width: 1200px;
  margin-top: 50px;
  .pictures {
    display: flex;
    margin-bottom: 10px;
  }
}
.PDS{
box-sizing: border-box;
 width:1200px;
}
.productShow-discuss{
  width:1200px;
}
.productShow-description{
  width:1200px;
}
.backgroundBar{
  width:1200px;
}
.productShow-header {
  width: 1200px;
  .productShow-header-main {
    width: 1200px;
    .productShow-header-main-icon {
      .productShow-header-main-article{
      width:940px;
    }
    }
  }
}
.productShow-author{
  width:1200px;
}
.editMyproduct{
  width:150px;
  margin-right: auto;
}
}
@media screen and (max-width:1024px) {
    .productShow {
  width: 1024px;
}

.productShow-CPD{
  position: absolute;
  left:-13%;
}
.productShow-CPDH{
  left:0%;
  top:30%;
}
.pdShow-markdown {
  width:1004px;
}

    .productShow-imgs {
  box-sizing: border-box;
  width: 1024px;
  margin-top: 50px;
  .pictures {
    display: flex;
    margin-bottom: 10px;
  }
}
.PDS{
box-sizing: border-box;
 width:1024px;
}
.productShow-discuss{
  width:1024px;
}
.productShow-description{
  width:1024px;
}
.backgroundBar{
  width:1024px;
}
.productShow-header {
  width: 1024px;
  .productShow-header-main {
    width: 1024px;
    .productShow-header-main-icon {
      margin-right: 20px;
      width:400px;
      img{
        width:100%;
        height:auto;
      }
      .productShow-header-main-article{
      width:674px;
    }
    }
  }
}
.productShow-author{
  width:1024px;
}
.editMyproduct{
  width:150px;
  margin-right: auto;
  margin-left: 0;
}
}
@media screen and (max-width:768px) {
      .productShow {
  width:768px;
}
.productShow-CPD{
  position: absolute;
  left:-31%;
}
.productShow-CPDH{
  left:0%;
  top:30%;
}
.pdShow-markdown {
  width:748px;
  height: 380px;
}
.productShow-imgs {
  box-sizing: border-box;
  width:768px;
  margin-top: 50px;
  .pictures {
    display: flex;
    margin-bottom: 10px;
  }
}
.PDS{
box-sizing: border-box;
 width:768px;
}
.productShow-discuss{
  width:768px;
}
.productShow-description{
  width:768px;
}
.backgroundBar{
  width:768px;
}
.productShow-header {
  width: 768px;
  .productShow-header-main {
    width:768px;
    .productShow-header-main-icon {
      margin-right: 20px;
      width:250px;
      height:100%;
      img{
        width:100%;
        height:auto;
      }
      .productShow-header-main-article{
        display: none;
    }
    }
  }
}
.productShow-author{
  width:768px;
}
.editMyproduct{
  width:150px;
  margin-right: auto;
  margin-left: 0;
}
}
</style>

