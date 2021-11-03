<template>
  <div class="creat">
    <div class="creatPD-container"> 
      <Loading
        v-if="isLoading"
      />
      <h1>{{pageTitle}}</h1>
      <section class="cp-icon">
        <div class="img"><img :src="`${previewPIcon}`" alt="上傳專案Icon" width="360" height="200"></div>
        <div class="uploadIcon"><input class="changeimg" type="file" accept="image/*" @change="uploadImg"></div>
      </section>
      <section class="title">
        <div class="ProductName">
          <p class="font-weight-bold">專案名稱:</p>
          <input class="creatPD-input" type="text" placeholder="(必填)您的專案名稱"  v-model="data.productTitle" required>
        </div>
        <div class="subtitle">
          <P class="font-weight-bold">副標題:</P>
           <input class="creatPD-input" type="text" placeholder="請輸入描述專案的副標題"  v-model="data.productSubtitle">
        </div>
      </section>
      <section class="CPD-article">
         <p class="font-weight-bold">專案簡介:</p>
         <div class="CPD-markdown">
           <quill-editor  v-model="data.productContent" class="textEditor"
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
           </quill-editor>
        </div>
      </section>
      <section class="uploadImg">
        <div><p class="font-weight-bold">專案圖片/影音:</p></div>
        <div><p>檔案1:</p></div>
        <div class="flexDisplay">
        <div v-if="previews1!=undefined && previews1!=''"><img :src="`${previews1}`" width="50" height="50"></div>
        <input class="changeimg" type="file" accept="image/*" @change="uploadImage1">
        <button v-if="previews1!='' && previews1!=undefined" type="button" @click="delectImg(1)">刪除圖片</button>
        </div>
        <div><p>檔案2:</p></div>
        <div class="flexDisplay">
           <div v-if="previews2!=undefined && previews2!=''"><img :src="`${previews2}`" width="50" height="50"></div>
           <input class="changeimg" type="file" accept="image/*" @change="uploadImage2">
             <button v-if="previews2!='' && previews2!=undefined" type="button" @click="delectImg(2)">刪除圖片</button>
        </div>
        <div><p>檔案3:</p></div>
          <div class="flexDisplay">
           <div v-if="previews3!=undefined && previews3!=''"><img :src="`${previews3}`" width="50" height="50"></div>
        <input class="changeimg" type="file" accept="image/*" @change="uploadImage3">
          <button v-if="previews3!='' && previews3!=undefined" type="button" @click="delectImg(3)">刪除圖片</button>
          </div>

        <div><p>檔案4:</p></div>
        <div class="flexDisplay">
           <div v-if="previews4!=undefined && previews4!=''"><img :src="`${previews4}`" width="50" height="50"></div>
          <input class="changeimg" type="file" accept="image/*" @change="uploadImage4">
            <button v-if="previews4!='' && previews4!=undefined" type="button" @click="delectImg(4)">刪除圖片</button>
          </div>
        <div><p>檔案5:</p></div>
        <div class="flexDisplay">
           <div v-if="previews5!=undefined && previews5!=''"><img :src="`${previews5}`" width="50" height="50"></div>
           <input class="changeimg" type="file" accept="image/*" @change="uploadImage5">
            <button v-if="previews5!='' && previews5!=undefined" type="button" @click="delectImg(5)">刪除圖片</button>
          </div>
        <div><p class="font-weight-bold">影片位址:</p></div>
        <input v-if="createBtn" class="CD-input" type="url" v-model="data.ProductMediaVideoPath" placeholder="請輸入Youtube影片網址">
          <input v-else class="cpdhis-urlInput" type="url" accept="image/*" v-model="productVideoPath" placeholder="請輸入內嵌的src網址">
         <div class="url">
           <p class="font-weight-bold">產品連結</p>
          <input class="CD-input" type="url" placeholder="(必填)請輸入相關連結" v-model="data.productUrl" required>
        </div>
        <div class="type">
             <p class="font-weight-bold">選擇產品分類:</p>
             <select v-model="data.productCategory" required>
                <option>必選種類</option>
                <option v-for="i,index in producttype" :key="index" :value="i">{{producttype[index]}}</option>
          </select>
          </div>
      </section>
      <section class="flexDisplay">
        <div class="newBtnS" @click="editP" v-if="!createBtn">儲存修改</div>
      <div class="newBtnS" @click="createProduct" v-if="createBtn">創建專案</div>
      <div class="newBtnS" @click="$emit('close')">取消</div>
      </section>
      
    </div>
  </div>
</template>
<script>
//會在這邊寫入產品資料，按下創建專案時寫入資料
  import { quillEditor } from 'vue-quill-editor'
  import Quill from 'quill'  //引入编辑器
  import Loading from"@/components/Loading"
  import {creatProductMedia} from'../Allapi' //先創建產品媒體
  import {creatProduct} from'../Allapi' //最後再一起打包送進出去
  import{editProduct} from'../Allapi'//編輯產品
  import{editProductMedia} from'../Allapi'
  import{deleteProductMedia} from'../Allapi'
  
export default {
    inject:['reload'],  //在后代组件中注入，並调用这个方法即可刷新路由啦。
   components: {
    Loading,
    quillEditor,
    Quill,
  },
  props:['editProduct','createBtn','pageTitle','productImg','productVideoPath'], //專門為了產品展示頁的編輯檔案而使用的-->記得要把本地檔案灌進去data
    created(){
      console.log(typeof(this.data.ProductMediaVideoPath))
        if(this.editProduct!=undefined){//假如editProduct不是空的，表示是透過編輯按鈕進來的
          this.data=this.editProduct; //直接把外面送進來ㄉ產品資訊送進來；PS產品大頭貼已經轉檔轉好囉
          this.previewPIcon=this.baseURL+this.data.productHeadShotPath
        }
       if(this.productImg){
        if(this.productImg[0].productMediaPathOne!=null){this.previews1=this.baseURL+this.productImg[0].productMediaPathOne}
        if(this.productImg[1].productMediaPathTwo!=null){this.previews2=this.baseURL+this.productImg[1].productMediaPathTwo}
        if(this.productImg[2].productMediaPathThree!=null){this.previews3=this.baseURL+this.productImg[2].productMediaPathThree}
        if(this.productImg[3].productMediaPathFour!=null){this.previews4=this.baseURL+this.productImg[3].productMediaPathFour}
        if(this.productImg[4].productMediaPathFive!=null){this.previews5=this.baseURL+this.productImg[4].productMediaPathFive}
       }
        // if(this.productMediaVideoPath!=""){
        //     this.data.ProductMediaVideoPath=this.productVideoPath;
        // }
    },
    data () {
      return {
            baseURL:"http://34.80.165.225/",
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
                  // [{ size: ["small", false, "large", "huge"] }], // 字体大小
                  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                  [{ font: [] }], // 字体种类
                  [{ align: [] }], // 对齐方式
                  ["clean"], // 清除文本格式
                  ["link","video"] // 链接
                  // ["link", "image", "video"] // 链接、图片、视频
                ], //工具菜单栏配置
              },
              placeholder: '请此輸入留言', //提示
              readyOnly: false, //是否只读
              theme: 'snow', //主题 snow/bubble
              syntax: true, //语法检测
            },
        isLoading:false,
        previewPIcon:'',//暫存上傳專案照片的預覽Bse64
        mediaIsOk:false,
        productIsok:false,
        producttype:['生產力工具','遊戲相關','社群相關','設計與藝術','教育與學習','健康與生活'],
        imagsName:['FormFileOne','FormFileTwo','FormFileThree','FormFileFour','FormFileFive'],
        previews1:'',previews2:'',previews3:'',previews4:'',previews5:'',
        data:{
          userId:this.$cookies.get('token'),
          productId:'',
          productHeadShotPath:'',
          productTitle:'',
          productSubtitle:'',
          productContent:'',
          productMediaId:'',
          imgs:[], //裡面存的是五張File檔案喔!要使用的話請轉擋~這個屬性不會被存入資料庫唷~
          productCategory:'',
          productUrl:'',//產品的連結
          ProductMediaVideoPath:'',//產品影片連結-->和影片要先存
          productDateTime:'',//產品創建的日期-->進資料庫之後自動產生
        },
      }
    },
     computed: { //文本編輯器的
          editor() {
            return this.$refs.myQuillEditor.quill;
          }
        },
    methods:{ 
      // 失去焦点
          onEditorBlur(editor) {},
          // 获得焦点
          onEditorFocus(editor) {},
          // 开始
          onEditorReady(editor) {},
          // 值发生变化
          onEditorChange(editor) {
            this.data.productContent = editor.html;
            // console.log(editor);
          },
      delectImg(num){
          var c= confirm('確定要刪除這張照片嗎？');
      if (c) { // 確定刪除
      // this.productImg.splice(num-1,1); //刪除本地該張照片
      switch(num){
        case 1:
          this.previews1="";
          this.productImg[0].productMediaPathOne=null;
          break
        case 2:
          this.previews2="";
          this.productImg[1].productMediaPathTwo=null;
          break
        case 3:
          this.previews3="";
          this.productImg[2].productMediaPathThree=null;
          break
        case 4:
          this.previews4="";
          this.productImg[3].productMediaPathFour=null;
          break
        case 5:
          this.previews5="";
          this.productImg[4].productMediaPathFive=null;
          break
      }
        deleteProductMedia(this.data.productMediaId,{"index": num})
          .then(res=>{
            // console.log(res);
          })
      }else{return}
      },
        uploadImage1(event){  //上傳五張圖片
           var input = event.target;
           if (input.files) {
              var reader = new FileReader(); //創建一個讀取器
              reader.onload = (e) => { //當load完成時，將preview變成result
              this.previews1=e.target.result;//預覽照片的SRC
              }
              reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
              if(this.createBtn){
                this.data.imgs[0]=input.files[0];
                }else{this.productImg[0].productMediaPathOne=input.files[0]};
          }
        },
         uploadImage2(event){  //上傳五張圖片
           var input = event.target;
           if (input.files) {
              var reader = new FileReader(); //創建一個讀取器
              reader.onload = (e) => { //當load完成時，將preview變成result
              this.previews2=e.target.result;//預覽照片的SRC
              }
              reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
               if(this.createBtn){this.data.imgs[1]=input.files[0];}else{this.productImg[1].productMediaPathTwo=input.files[0]};
        }
        },
         uploadImage3(event){  //上傳五張圖片
           var input = event.target;
           if (input.files) {
              var reader = new FileReader(); //創建一個讀取器
              reader.onload = (e) => { //當load完成時，將preview變成result
              this.previews3=e.target.result;//預覽照片的SRC
              }
              reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
              if(this.createBtn){this.data.imgs[2]=input.files[0];}else{this.productImg[2].productMediaPathThree=input.files[0]};
        }
        },
         uploadImage4(event){  //上傳五張圖片
           var input = event.target;
           if (input.files) {
              var reader = new FileReader(); //創建一個讀取器
              reader.onload = (e) => { //當load完成時，將preview變成result
              this.previews4=e.target.result;//預覽照片的SRC
              }
              reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
              if(this.createBtn){this.data.imgs[3]=input.files[0];}else{this.productImg[3].productMediaPathFour=input.files[0]};
        }
        },
         uploadImage5(event){  //上傳五張圖片
           var input = event.target;
           if (input.files) {
              var reader = new FileReader(); //創建一個讀取器
              reader.onload = (e) => { //當load完成時，將preview變成result
              this.previews5=e.target.result;//預覽照片的SRC
              }
              reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
                if(this.createBtn){ this.data.imgs[4]=input.files[0];}else{
                  console.log(this.productImg[4])
                  console.log(this.productImg[4].productMediaPathFive)
                  console.log(input.files[0])
                 
                  this.productImg[4].productMediaPathFive=input.files[0]};
                  console.log(this.productImg[4].productMediaPathFive)
        }
        },
        uploadImg(event){  //上傳產品大頭貼圖片
           var input = event.target;
            if (input.files) {
              var reader = new FileReader(); //創建一個讀取器
              reader.onload = (e) => { //當load完成時，將preview變成result
              this.previewPIcon=e.target.result;//預覽照片的SRC
              }
              reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
              this.data.productHeadShotPath=input.files[0];
            }
        },
        createProduct(){
          this.isLoading=true;
          //先建立媒體櫃
          console.log(this.data.ProductMediaVideoPath)
          const MediaformData = new FormData()
           MediaformData.append('FormFileOne',this.data.imgs[0]);
           MediaformData.append('FormFileTwo',this.data.imgs[1]);
           MediaformData.append('FormFileThree',this.data.imgs[2]);
           MediaformData.append('FormFileFour',this.data.imgs[3]);
           MediaformData.append('FormFileFive',this.data.imgs[4]);
          if(this.data.ProductMediaVideoPath.indexOf('embed')==-1 && this.data.ProductMediaVideoPath!==""){ //解析Youtube影片，假如字串中不包含embed，就要+工
                  const video="https://www.youtube.com/embed/";
                  this.data.ProductMediaVideoPath=this.data.ProductMediaVideoPath.substr(32,11);
                  this.data.ProductMediaVideoPath=video+this.data.ProductMediaVideoPath;
                  }
          MediaformData.append('ProductMediaVideoPath',this.data.ProductMediaVideoPath);
          if(this.data.productTitle!="" && this.data.productContent!=""  && this.data.productContent!="(必填)" && this.data.productUrl!=""
                && this.data.productCategory!="" && this.data.productHeadShotPath!=""){
          creatProductMedia(MediaformData)
            .then(res=>{
                this.data.productMediaId=res.data.productMediaId;
                console.log(res);
                console.log(res.data.productMediaId);
                console.log(this.data.userId);
                console.log(this.data.productTitle);
                console.log(this.data.productSubtitle);
                console.log(this.data.productContent);
                console.log(this.data.productUrl);
                console.log(this.data.productCategory)
                console.log(this.data.productHeadShotPath);
                console.log(this.data.productHistoryMediaVideoPath)
                const ProductformData = new FormData()
                ProductformData.append('ProductMediaId',res.data.productMediaId);//先傳入產品媒體的流水號
                ProductformData.append('UserId',this.data.userId);//傳入當前會員id
                ProductformData.append('ProductTitle',this.data.productTitle);//傳入產品名稱
                ProductformData.append('ProductSubtitle',this.data.productSubtitle);//傳入產品副標題
                ProductformData.append('ProductContent',this.data.productContent);//傳入產品內文
                ProductformData.append('ProductUrl',this.data.productUrl);//傳入產品網址
                ProductformData.append('ProductCategory',this.data.productCategory);//傳入產品分類
                ProductformData.append('HeadShotFile',this.data.productHeadShotPath);//傳入產品icon
                creatProduct(ProductformData)
                .then(res=>{
                  console.log(res)
                  this.data.productDateTime=res.data.productDateTime;
                  this.data.productId=res.data.productId;
                  this.$emit('close',this.data);
                  console.log("專案傳送完畢");
                   console.log(this.data);
                  this.reload();
                })
                // this.isLoading=false;
            })
            }else{alert("專案Icon沒有上傳；或是還有必填的欄位沒有填唷!")
            this.isLoading=false;
            };
        },
        editP(){
          this.isLoading=true;
          const formData = new FormData()
          formData.append('ProductTitle',this.data.productTitle);//要轉成fromData格式唷~
          formData.append('ProductSubtitle',this.data.productSubtitle);//要轉成fromData格式唷~
          formData.append('ProductContent',this.data.productContent);//要轉成fromData格式唷~
          formData.append('HeadShotFile',this.data.productHeadShotPath);//要轉成fromData格式唷~請先把格式轉換成file格式
          formData.append('ProductUrl',this.data.productUrl);//要轉成fromData格式唷~
          formData.append('ProductCategory',this.data.productCategory);//要轉成fromData格式唷~
           if(this.data.productTitle!="" && this.data.productContent!=""  && this.data.productContent!="(必填)" && this.data.productUrl!=""
                && this.data.productCategory!="" && this.data.productHeadShotPath!=""){
          editProduct(this.data.productId,formData)
            .then(res=>{
                const MediaformData = new FormData()
                if(this.productImg[0].productMediaPathOne!=null){MediaformData.append('FormFileOne',this.productImg[0].productMediaPathOne)};
                if(this.productImg[1].productMediaPathTwo!=null){MediaformData.append('FormFileTwo',this.productImg[1].productMediaPathTwo)};
                if(this.productImg[2].productMediaPathThree!=null){MediaformData.append('FormFileThree',this.productImg[2].productMediaPathThree)};
                if(this.productImg[3].productMediaPathFour!=null){MediaformData.append('FormFileFour',this.productImg[3].productMediaPathFour)};
                if(this.productImg[4].productMediaPathFive!=null){MediaformData.append('FormFileFive',this.productImg[4].productMediaPathFive)};
                if(this.productVideoPath.indexOf('embed')==-1 && this.productVideoPath!=""){ //解析Youtube影片，假如字串中不包含embed，就要+工
                  const video="https://www.youtube.com/embed/";
                  this.productVideoPath=this.productVideoPath.substr(32,11);
                  this.productVideoPath=video+this.productVideoPath;
                  }
                 MediaformData.append('ProductMediaVideoPath',this.productVideoPath);
                 console.log(this.productVideoPath)
                editProductMedia(this.data.productMediaId,MediaformData)
                  .then(res=>{
                    console.log(res)
                    this.$emit('close');
                      this.reload();
                  })
            })
          }else{alert("專案Icon沒有上傳；或是還有必填的欄位沒有填唷!")
          this.isLoading=false;
          };
        }
    }
}
</script>

<style lang="scss">
%mlr-center{
  margin-left: auto;
  margin-right: auto;
}
.markdown{
  width:1200px;
  height:400px;
}
.textEditor{
  height:400px;
}

.creat{
  width:1300px;
  background-color: rgba(50,50,50,0.5);
   @extend %mlr-center;
}
.creatPD-container{
  border:1px solid #BFBAB0;
  width:1200px;
  @extend %mlr-center;
  display: block;
  background-color: #FFF;
  text-align: left;
  padding: 10px;
  h1{
    text-align: center;
  }
}
.cp-ico,.title,.CPD-article,.uploadImg,.choose,.confirm{
  margin-bottom: 10px;
}
.title{
  display: flex;
  width:100%;
  margin-top: 40px;
    .ProductName{
      display: flex;
      p{
        margin-top: 7px;
      }
    }
    .subtitle{
      display: flex;
         p{
        margin-top: 7px;
      }
    }
}

.uploadImg{
  margin-top: 60px;
}
.cp-icon{ 
  width:300px;
  @extend %mlr-center;
  background-color: #BFBAB0;
  border-radius: 5px;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 0px 3px #252526;
  position: relative;
  .img{
     width:360px;
     height:200px;
     overflow: hidden;
  }
  .uploadIcon{
    position: absolute;
    bottom:0;
    right:-90%;
  }
}
//工具
.creatPD-input{
  height:30px;
  margin-right: 10px;
}
.CD-input{  //影片和Url的輸入框樣式
  width:50%;
  height:30px;
}
 .newBtnS{
  width:150px;
  border-radius: 100px;
  border:0.5px solid gray;
  padding: 5px 10px;
}
.newBtnS:hover{
  cursor: pointer;
  color: white;
   background: linear-gradient(left, #0793c5,#024e66 );
}
.flexDisplay{
    display: flex;
  }
  .font-weight-bold{
  font-weight: bold;
}
//響應式
@media screen and (max-width:1200px) {
.creatPD-container{
  width:1200px;
  display: block;
  text-align: left;
  padding-left: 50px;
  h1{
    text-align: center;
  }
}
.textEditor{
  padding-right: 20px;
}
}
@media screen and (max-width:1024px) {
 .creatPD-container{
  width:1024px;
  h1{
    text-align: center;
  }
}
  .textEditor{
  padding-right: 30px;
}
  .creatPD-input{
  margin-right: 5px;
}
}
@media screen and (max-width:768px) {
 .creatPD-container{
  width:768px;
  h1{
    text-align: center;
  }
}
  .textEditor{
  padding-right: 30px;
}
  .creatPD-input{
  margin-right: 5px;
}
  
}
</style>