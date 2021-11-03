<template>
<div class="creatHis">
    <div class="His-container">
      <Loading
        v-if="isLoading"
      />
           <h1 v-if="!createBtn">編輯歷程紀錄</h1>
           <h1 v-else>紀錄產品歷程</h1>
           <section class="cp-icon">
                <div class="img"><img :src="`${previewPIcon}`" alt="上傳專案Icon" width="360" height="200"></div>
                <div class="uploadIcon"><input class="changeimg" type="file" accept="image/*" @change="uploadHeadShot"></div>
            </section>
            <section class="title">
             <div class="cpdHis-ProductName">
             <p class="font-weight-bold">專案歷程標題:</p>
             <input v-if="createBtn" class="cpdHis-input" type="text" placeholder="(必填)" v-model="data.productHistoryTitle" required>
             <input v-else class="cpdHis-input" type="text" placeholder="(必填)" v-model="edData.productHistoryTitle" required>
             </div>
             <div class="cpdHis-subtitle">
                <P class="font-weight-bold">專案歷程版本號:</P>
                <input v-if="createBtn" class="cpdHis-input" type="text" placeholder="(必填)請輸入產品版本號" v-model="data.productHistoryVersion">
                <input v-else class="cpdHis-input" type="text" placeholder="(必填)請輸入產品版本號" v-model="edData.productHistoryVersion">
                </div>
           </section>
            <section class="CPDHIS-article">
                <p class="font-weight-bold">專案歷程簡介:</p>
                <div class="cpdHis-markdown">
                  <quill-editor v-if="createBtn"  v-model="data.productHistoryContent" class="cpdHis-textEditor" :options="editorOption"  @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"  @change="onEditorChange($event)"></quill-editor>
                  <quill-editor v-else  v-model="edData.productHistoryContent" class="cpdHis-textEditor" :options="editorOption"  @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"  @change="onEditorChange($event)"></quill-editor>
               </div>
          </section>
          <section class="uploadImg">
           <div><p class="font-weight-bold">專案歷程圖片/影音:</p></div>
           <div><p>檔案1:</p></div>
           <div class="flexDisplay">
              <div v-if="previews1!=undefined && previews1!=''"><img :src="`${previews1}`" width="50" height="50"></div>
              <input class="changeimg" type="file" accept="image/*" @change="uploadImage1">
              <button v-if="previews1!='' && previews1!=undefined" type="button" @click="delePDHMed(1)">刪除圖片</button>
           </div>
          <div><p>檔案2:</p></div>
          <div class="flexDisplay">
           <div v-if="previews2!=undefined && previews2!=''"><img :src="`${previews2}`" width="50" height="50"></div>
           <input class="changeimg" type="file" accept="image/*" @change="uploadImage2">
           <button v-if="previews2!='' && previews2!=undefined" type="button" @click="delePDHMed(2)">刪除圖片</button>
          </div>
          <div><p>檔案3:</p></div>
            <div class="flexDisplay">
            <div v-if="previews3!=undefined && previews3!=''"><img :src="`${previews3}`" width="50" height="50"></div>
            <input class="changeimg" type="file" accept="image/*" @change="uploadImage3">
            <button v-if="previews3!='' && previews3!=undefined" type="button" @click="delePDHMed(3)">刪除圖片</button>
          </div>
          <div><p>檔案4:</p></div>
          <div class="flexDisplay">
           <div v-if="previews4!=undefined && previews4!=''"><img :src="`${previews4}`" width="50" height="50"></div>
           <input class="changeimg" type="file" accept="image/*" @change="uploadImage4">
            <button v-if="previews4!='' && previews4!=undefined" type="button" @click="delePDHMed(4)">刪除圖片</button>
          </div>
          <div><p>檔案5:</p></div>
          <div class="flexDisplay">
           <div v-if="previews5!=undefined && previews5!=''"><img :src="`${previews5}`" width="50" height="50"></div>
            <input class="changeimg" type="file" accept="image/*" @change="uploadImage5">
            <button v-if="previews5!='' && previews5!=undefined" type="button" @click="delePDHMed(5)">刪除圖片</button>
          </div>
          <div><p>影片位址:</p></div>
          <input v-if="createBtn" class="cpdhis-urlInput" type="url" accept="image/*" v-model="data.productHistoryMediaVideoPath" placeholder="請輸入內嵌的src網址">
          <input v-else class="cpdhis-urlInput" type="url" accept="image/*" v-model="edData.edVideo" placeholder="請輸入內嵌的src網址">
          </section>
          <div class="flexDisplay">
          <div class="newBtnS" @click="confirmCreatePDH" v-if="createBtn">紀錄專案歷程</div>
           <div class="newBtnS" @click="editPH" v-if="!createBtn">儲存修改</div>
          <div class="newBtnS" @click="$emit('close')">取消</div>
          </div>
        </div>
    </div>
</div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'  //引入编辑器
import Loading from"@/components/Loading"
import { creatProductHisMedia } from "../Allapi"; //先創建產品媒體
import { creatProductHis } from "../Allapi"; //最後再一起打包送進出去
import{editPdHis} from"../Allapi" //編輯產品基本資料
import{editPdHisMida}from "../Allapi"//修改圖片
import{deletePdHisMedia}from"../Allapi" //刪除圖片
export default {
  //從ProdShow進來時，帶產品id進來
  inject: ["reload"], //在后代组件中注入，並调用这个方法即可刷新路由啦。
  props: ["ProductId", "productTitle", "productHeadShot", "productContent","createBtn","edPDHBase","edPDHImg","edVideo"],//編輯時候用的外面會傳進來要編輯的資料
  components:{
    Loading,
     quillEditor,
          Quill,
  },
  created() {
    if(this.createBtn){
    this.data.productHistoryTitle = this.productTitle;
    this.data.productHistoryContent = this.productContent;
    }else{
      this.edData=this.edPDHBase;
      this.edData.edVideo=this.edVideo;
      if(this.edPDHImg[0].productHistoryMediaPathOne!=null){this.previews1=this.baseURL+this.edPDHImg[0].productHistoryMediaPathOne;}
      if(this.edPDHImg[1].productHistoryMediaPathTwo!=null){this.previews2=this.baseURL+this.edPDHImg[1].productHistoryMediaPathTwo;}
      if(this.edPDHImg[2].productHistoryMediaPathThree!=null){this.previews3=this.baseURL+this.edPDHImg[2].productHistoryMediaPathThree;}
      if(this.edPDHImg[3].productHistoryMediaPathFour!=null){this.previews4=this.baseURL+this.edPDHImg[3].productHistoryMediaPathFour;}
      if(this.edPDHImg[4].productHistoryMediaPathFive!=null){this.previews5=this.baseURL+this.edPDHImg[4].productHistoryMediaPathFive;}
      this.previewPIcon=this.baseURL+this.edData.productHistoryHeadShot;
    }
  },
  data() {
    return {
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
      baseURL:"http://34.80.165.225/",
      isLoading:false,
      previewPIcon: "", //產品大頭貼的預覽icon
      previews1:'',previews2:'',previews3:'',previews4:'',previews5:'',
      edData:{},
      data: {
        imgs: [], //用來儲存歷程照片
        productHistoryMediaVideoPath:'',//歷程影片網址
        productHistoryMediaId: "", //產品媒體櫃流水號
        productHistoryTitle: "", //標題-->可以直接從外面帶進來
        productHistoryContent: "", //內容
        productHistoryVersion: "", //版本號
        productHistoryHeadShot: "", //歷程大頭貼
      },
    };
  },
  methods: {
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
    uploadHeadShot(event) {
      //上傳產品大頭貼圖片
      var input = event.target;
      if (input.files) {
        var reader = new FileReader(); //創建一個讀取器
        reader.onload = (e) => {
          //當load完成時，將preview變成result
          this.previewPIcon = e.target.result; //預覽照片的SRC
        };
        reader.readAsDataURL(input.files[0]); //將讀取到的檔案編碼成Data URL
        if(this.createBtn){ this.data.productHistoryHeadShot = input.files[0];}else{this.edData.productHistoryHeadShot=input.files[0];}
      }
    },
    uploadImage1(event){  //上傳五張圖片
           var input = event.target;
           if (input.files) {
              var reader = new FileReader(); //創建一個讀取器
              reader.onload = (e) => { //當load完成時，將preview變成result
              this.previews1=e.target.result;//預覽照片的SRC
              }
              reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
              if(this.createBtn){this.data.imgs.push(input.files[0]);}else{this.edPDHImg[0].productHistoryMediaPathOne=input.files[0]}
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
              // this.data.imgs[1]=input.files[0];
               if(this.createBtn){this.data.imgs.push(input.files[0]);}else{this.edPDHImg[1].productHistoryMediaPathTwo=input.files[0]};
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
              // this.data.imgs[2]=input.files[0];
               if(this.createBtn){this.data.imgs.push(input.files[0]);}else{this.edPDHImg[2].productHistoryMediaPathThree=input.files[0]}
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
              // this.data.imgs[3]=input.files[0];
               if(this.createBtn){this.data.imgs.push(input.files[0]);}else{this.edPDHImg[3].productHistoryMediaPathFour=input.files[0]}
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
              // this.data.imgs[4]=input.files[0];
               if(this.createBtn){this.data.imgs.push(input.files[0]);}else{this.edPDHImg[4].productHistoryMediaPathFive=input.files[0]}
        }
        },
    confirmCreatePDH() {
      this.isLoading=true;
      //確定要創建產品歷程的方法
      //進入創建產品歷程前，先擋標題、產品歷程內容、產品版本號不可為空 this.data.productHistoryHeadShot!=""
      if (
        this.data.productHistoryTitle != "" &&
        this.data.productHistoryContent != "" &&
        this.data.productHistoryVersion != "" &&
        this.data.productHistoryHeadShot!=""
      ) {
        //先建立產品媒體櫃
        const pdHisFormData = new FormData();
        pdHisFormData.append("FormFileOne", this.data.imgs[0]);
        pdHisFormData.append("FormFileTwo", this.data.imgs[1]);
        pdHisFormData.append("FormFileThree", this.data.imgs[2]);
        pdHisFormData.append("FormFileFour", this.data.imgs[3]);
        pdHisFormData.append("FormFileFive", this.data.imgs[4]);
        if(this.data.productHistoryMediaVideoPath.indexOf('embed')==-1 && this.data.productHistoryMediaVideoPath!=""){ //假如字串中不包含embed，就要+工
                  const video="https://www.youtube.com/embed/";
                  this.data.productHistoryMediaVideoPath=this.data.productHistoryMediaVideoPath.substr(32,11);
                  this.data.productHistoryMediaVideoPath=video+this.data.productHistoryMediaVideoPath;
                  }
        pdHisFormData.append("ProductHistoryMediaVideoPath",this.data.productHistoryMediaVideoPath);
        creatProductHisMedia(pdHisFormData).then((res) => {
          console.log(res)
          //再創產品歷程productHistoryMediaId
          const ForData = new FormData();
          ForData.append("ProductId",this.ProductId);
          ForData.append("ProductHistoryTitle", this.data.productHistoryTitle);
          ForData.append("HeadShotFile", this.data.productHistoryHeadShot);
          ForData.append("ProductHistoryContent",this.data.productHistoryContent);
          ForData.append("ProductHistoryVersion",this.data.productHistoryVersion);
          ForData.append("ProductHistoryMediaId",res.data.productHistoryMediaId);
          creatProductHis(ForData).then(re=> {
            console.log(re)
            //關閉視窗
            this.reload();
          });
        });
      } else {
        alert("還有必填的欄位沒有填唷!必填欄位有:專案Icon、專案歷程標題、專案歷程版本號、專案歷程簡介");
        this.isLoading=false;
      }
    },
    editPH(){
      this.isLoading=true;
      //修改基本資料(標題、內文、版本號不可為空)
      if(this.edData.productHistoryTitle.length>0 && this.edData.productHistoryContent.length>0 && this.edData.productHistoryVersion.length>0 ){
        const frombody=new FormData();
        frombody.append('ProductHistoryTitle',this.edData.productHistoryTitle);
        frombody.append('ProductHistoryContent',this.edData.productHistoryContent);
        frombody.append('ProductHistoryVersion',this.edData.productHistoryVersion);
        frombody.append('HeadShotFile',this.edData.productHistoryHeadShot);
        editPdHis(this.edData.productHistoryId,frombody)
          .then(res=>{
            const PDHMedia=new FormData();
            if(this.edPDHImg[0].productHistoryMediaPathOne!=null){PDHMedia.append('FormFileOne',this.edPDHImg[0].productHistoryMediaPathOne)};
            if(this.edPDHImg[1].productHistoryMediaPathTwo!=null){PDHMedia.append('FormFileTwo',this.edPDHImg[1].productHistoryMediaPathTwo)};
            if(this.edPDHImg[2].productHistoryMediaPathThree!=null){PDHMedia.append('FormFileThree',this.edPDHImg[2].productHistoryMediaPathThree)};
            if(this.edPDHImg[3].productHistoryMediaPathFour!=null){PDHMedia.append('FormFileFour',this.edPDHImg[3].productHistoryMediaPathFour)};
            if(this.edPDHImg[4].productHistoryMediaPathFive!=null){PDHMedia.append('FormFileFive',this.edPDHImg[4].productHistoryMediaPathFive)};
             if(this.edData.edVideo.indexOf('embed')==-1 && this.edData.edVideo!=""){ //假如字串中不包含embed，就要+工
                  const video="https://www.youtube.com/embed/";
                  this.edData.edVideo=this.edData.edVideo.substr(32,11);
                  this.edData.edVideo=video+this.edData.edVideo;
            }
            PDHMedia.append('ProductHistoryMediaVideoPath',this.edData.edVideo);
            editPdHisMida(this.edData.productHistoryMediaId,PDHMedia)
              .then(res=>{
                console.log(res)
                this.$emit('close');
                this.reload();
              })
          })
      //修改圖片(隨便，假如都是null就不要做了)
      }else{alert("標題、內文、版號不可為空；產品Icon也不可為空");
      this.isLoading=false;
      }
    },
    delePDHMed(num){
      var a=Number(num);
      var c=confirm("確定要刪除圖片嗎?");
      if(c){
         switch(num){
        case 1:
          this.previews1="";
          this.edPDHImg[0].productHistoryMediaPathOne=null;
          break
        case 2:
          this.previews2="";
          this.edPDHImg[1].productHistoryMediaPathTwo=null;
          break
        case 3:
          this.previews3="";
          this.edPDHImg[2].productHistoryMediaPathThree=null;
          break
        case 4:
          this.previews4="";
          this.edPDHImg[3].productHistoryMediaPathFour=null;
          break
        case 5:
          this.previews5="";
          this.edPDHImg[4].productHistoryMediaPathFive=null;
          break
      }
      deletePdHisMedia(this.edData.productHistoryMediaId,{"index":a})
        .then(res=>{
          console.log(res);
        })
    }else{return}
    },
  }
}
</script>
<style lang="scss">
//共同
%mlr-center {
  margin-left: auto;
  margin-right: auto;
}
//主要區域
.creatHis {
  width: 1360px;
  background-color: rgba(50, 50, 50, 0.5);
  @extend %mlr-center;
}
.His-container{
  width:1260px;
  border: 1px solid #bfbab0;
  @extend %mlr-center;
  display: block;
  background-color: #fff;
  text-align: left;
  padding: 10px;
  h1 {
    text-align: center;
  }
}
.cp-icon {
  width: 300px;
  @extend %mlr-center;
  background-color: #bfbab0;
  border-radius: 5px;
  border: 1px solid #f2f2f2;
  box-shadow: 0px 0px 3px #252526;
  position: relative;
  .img {
    width: 360px;
    height: 200px;
    overflow: hidden;
  }
  .uploadIcon {
    position: absolute;
    bottom: 0;
    right: -90%;
  }
}
.title{
  display: flex;
  width:100%;
  margin-top: 40px;
    .cpdHis-ProductName{
      display: flex;
      p{
        margin-top: 7px;
      }
    }
    .cpdHis-subtitle{
      display: flex;
       p{
        margin-top: 7px;
      }
    }
}
.cp-ico,
.title,
.CPDHIS-article,
.uploadImg,
.choose,
.confirm {
  margin-bottom: 10px;
}
//工具
.cpdHis-input{
  height:30px;
  margin-right: 20px;
}
.cpdHis-markdown{
  height:350px;
}
.cpdHis-textEditor{
  height:300px;
}
.cpdhis-urlInput{
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
.flexDisplay {
  display: flex;
}
//響應式
@media screen and (max-width:1200px) {
  .creatHis {
  width: 1200px;
}
  .His-container{
  width:1200px;
  padding: 10px;
}
.cpdHis-markdown{
  width:1180px;
}


}
@media screen and (max-width:1024px) {
    .creatHis {
  width: 1024px;
}
  .His-container{
  width:1024px;
  padding: 10px;
}
.cpdHis-markdown{
  width:1020px;
}
  
}
@media screen and (max-width:768px) {
     .creatHis {
  width: 768px;
}
  .His-container{
  width:768px;
  padding: 10px;
}
.cpdHis-markdown{
  width:748px;
}
  
}
</style>