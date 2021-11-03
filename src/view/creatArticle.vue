<template>
    <div class="createArticle">
          <section class="confirm">
              <h2>發起討論</h2>
              <div class="CA-confirm">
              </div>
        </section>
        <section class="title">
             <input class="CArt-input" type="text" v-model="disData.discusstionTitle" required placeholder="輸入討論主題">
        </section>
        <section class="cart-main">
           <quill-editor  v-model="disData.discusstionContent" class="cart-textEditor"
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
           </quill-editor>
        </section>
        <section class="creatArticle-tag">
            <!-- 顯示最終選擇的標籤 -->
            <div class="creatArticle-tag-finalTag">
                <h3>我的發文標籤</h3>
                <p>{{disData.discusstionCategory}}</p>
            </div>
            <p class="color-green">選擇發文標籤</p>
            <div class="creatArticle-existedTag">
                <!-- 這裡會顯示已經有的標籤 樣式為#標籤 -->
                <div class="creatArticle-existedTag-item" v-for="i,index in allExitTags" :key="index" @click="clickExitTag(i)">
                    <p>#{{i}}</p>
                </div>
               
                  <!-- 創建標籤 -->
            <div class="creatArticle-createTag">
                <div class="newBtnS" @click="IscreatTag=true">+創建標籤</div>
                <div v-if="IscreatTag">
                    <input type="text" v-model="articleTag">
                    <div class="newBtnS" @click="ctTag">確定</div>
                    <div class="newBtnS" @click="IscreatTag=false">取消</div>
                </div>
            </div>
            </div>
            <div class="display-flex">
              <div class="newBtnS" type="submit" @click="creatDis">發表</div>
              <div class="newBtnS" type="submit" @click="$emit('close')">取消</div>
              </div>
        </section>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
  import Quill from 'quill'  //引入编辑器
 import {createDis} from '../Allapi'
 import{getAllDis}from '../Allapi'
 import{getDisFFllowerNum} from'../Allapi'
export default {
     inject:['reload','sortKey'],  //在后代组件中注入，並调用这个方法即可刷新路由啦。
     components: {
          quillEditor,
          Quill,
      },
  created(){
      getAllDis()
        .then(async(res)=>{
        //取得所有發文，並且從中篩選出標籤
        var temp=res.data;
        const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId));
        const newList=await Promise.all(apiList);
        temp.forEach((item,index)=>{
            item.subscribeCount=newList[index].data.subscribeCount;
        })
        temp=this.sortKey(res.data,'subscribeCount'); //先排序
        temp.forEach((item)=>{ 
           this.exitTagTemp+=item.discusstonCategory;
        })
        this.allExitTags=this.exitTagTemp.split("#");
        this.allExitTags=[...(new Set(this.allExitTags))];
        })
  },
    data(){
        return{
            disData:{
                userId:this.$cookies.get('token'),
                discusstionTitle:'',
                discusstionContent:'',
                discusstionCategory:'',//用來裝最終確認的標籤，可能是自創+存在標籤；or多個存在標籤
            },
            exitTagTemp:'',//把所有tag連接成一串大字串
            allExitTags:[],//裝所有已經存在的標籤-->每個人裝進來的時候還要自帶計數器
            articleTag:'',//裝創建文章標籤的
            IscreatTag:false,
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
                //   [{ size: ["small", false, "large", "huge"] }], // 字体大小
                  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
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
        }
    },
    methods:{
         // 值发生变化
          onEditorChange(editor) {
            this.data.productContent = editor.html;
            // console.log(editor);
          },
        creatDis(){
            if(this.disData.discusstionContent.length>0 && this.disData.discusstionTitle.length>0 && this.disData.discusstionCategory.length>0){
            console.log(this.disData.discusstionCategory);
            createDis(this.disData)
                .then(res=>{
                    console.log(res);
                    this.reload();
                })
            }else{alert("標題或內容不可為空，或是未選擇文章標籤")}
        },
        clickExitTag(exitTag){ //每個tag點擊可以+上或取消
         if(exitTag.indexOf('#')==-1){ 
             var tag='#'+exitTag;
             }else{
                 console.log("不須+#")
            var tag=exitTag;
             }
             if(this.disData.discusstionCategory.indexOf(exitTag)==-1){
                  this.disData.discusstionCategory+=tag;
             }else{
                 console.log(typeof(tag))
                 this.disData.discusstionCategory.replace(tag, '');
             }
        },
        ctTag(){
             if(this.articleTag.indexOf('#')==-1){ //假如創建標籤時不包含#字號
                this.disData.discusstionCategory+='#'+this.articleTag;
            }else{
                this.disData.discusstionCategory+=this.articleTag;
            }
            this.IscreatTag=false;
        },
    }

}
</script>

<style lang="scss">
.createArticle{
    width:1200px;
    border-radius: 10px;
    text-align: left;
    background-color: #F2F2F2;
    padding: 20px 20px;
}
.cart-main{
    margin-bottom: 40px;
}
.cart-textEditor{
        height:400px;
    }
.CArt-input{
    width:99.5%;
    height:65px;
    border-radius: 5px;
    margin-bottom: 20px !important;
    font-size:1.5rem;
    color: gray;
    margin-left: auto;
    margin-right: auto;
}
  .btn{
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
  }
  .CodeMirror-scroll{
      height:100vh;
  }
  .confirm{
  display: flex;
  padding-left: 20px;
      .CA-confirm{
      width:350px;
      margin-left: auto;
       margin-top:20px;
      margin-bottom: 20px;
      }
  }
  .color-green{
      color:#15C39A;
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
.creatArticle-existedTag{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
}
.creatArticle-existedTag-item{
    cursor: pointer;
  
    margin-left: 5px;
    margin-right: 5px;
    p{
        margin: 0;
    }
}
.creatArticle-tag-finalTag{
    display: flex;
    h3{
        margin-bottom: 0;
        margin-right: 20px;
    }
    // p{margin-right: 20px;}
}
.display-flex{
    display: flex;
}
</style>