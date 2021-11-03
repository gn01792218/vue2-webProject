<template>
        <div class="msgShowContainer">
            <div class="userName">
              <MeberBar
                :userHeadShot="Comment.userHeadShotPath"
                :userAccount="Comment.userAccount"
                :userId="Comment.userId"
              />
            </div>
            <div class="msgDiv">
              <vue-markdown :source="Comment.commentContent"></vue-markdown>
              <p class="date">留言時間:{{ Comment.commentDateTime }}</p>
              <!-- v-if="Comment.userId == browseUserId" -->
              <div class="display-flex " >
                 <div class="newBtnS" @click="delectMsg(Comment.commentId)" v-if="!edMsg">刪除留言</div>
                <div class="newBtnS" @click="edMsg=true" v-if="!edMsg" >修改留言</div>
              </div>
              <div v-if="edMsg">
               <div  class="edPDcomment">
                 <quill-editor  v-model="Comment.commentContent" class="leavMsg-textEditor"
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
                  </quill-editor>
                    <!-- <vue-simplemde class="editor" v-model="Comment.commentContent" ref="markdownEditor" required/> -->
                </div>
                <div class="display-flex" >  
                      <div class="newBtnS" @click="edittMsg(Comment.commentId)" >確認</div>
                       <div class="newBtnS" @click="dismisedittMsg" >取消</div>
                    </div>
              </div>
            </div>
          </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
  import Quill from 'quill'  //引入编辑器
import VueMarkdown from "vue-markdown";
import MeberBar from "../components/MeberBar.vue"
import { editComments } from "../Allapi";
import { deleteComment } from "../Allapi";
import{editDisComment}from '../Allapi'
import{deleteDisComment}from '../Allapi'
export default {
   inject: ["reload"], //在后代组件中注入，並调用这个方法即可刷新路由啦。
    props:['Comment','isPDC'],//外面決定傳進來的是什麼區的留言
    components: {
      quillEditor,
          Quill,
    VueMarkdown,
    MeberBar,
  },
  created(){
    if(!this.isPDC){  //處理不是由產品展示區傳進來的就可以了
      this.Comment.commentContent=this.Comment.discusstionCommentContent;
      this.Comment.commentDateTime=this.Comment.discusstionCommentDateTime;
      this.Comment.commentId=this.Comment.discusstionCommentId;
    }
  },
  data(){
    return{
      browseUserId:this.$cookies.get('token'),
      edMsg:false,
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
    edittMsg(commId) {
      //傳留言id進來
       if(this.Comment.commentContent.length>0){
           if(this.isPDC){ editComments(commId, {commentContent: this.Comment.commentContent }).then((res) => { //是編輯產品頁下的留言時
        this.reload();
      });}else{ //是編輯討論區下的留言時
       editDisComment(commId,{discusstionCommentContent:this.Comment.commentContent})
          .then(res=>{
            console.log(res);
              this.reload();
          })
      }
       }else{alert('請勿留下空白留言哦~')}
      this.edMsg = false;
    },
       delectMsg(commId) {
      //點到哪一個，就取得哪一個的commentId
      //竟然刪除到上一筆留言
      var c=confirm("確定要刪除留言?");
        if(c){ 
          if(this.isPDC){ deleteComment(commId).then((res) => {
          this.reload();
      });}else{
         deleteDisComment(commId)
        .then(res=>{
          this.reload();
        })
      }
         }
    },
       dismisedittMsg() {
      this.edMsg = false;
    },
  }
  //需要傳入留言者頭像、帳號、留言內容(產品OR討論)、時間、
}
</script>

<style lang="scss">
.msgShow{
    .msgShowContainer{
         width:1200px;
         margin-bottom: 10px;
    }
    .msgDiv{
    border-left: 1px dashed black;
    padding: 5px;
    background-color: white;
    text-align: left;
        .date{
          width:250px;
            color:gray;
            font-size: small;
            margin-left: auto;
        }
    }
}
.edPDcomment{
  display: block;
  height:350px;
}
.leavMsg-textEditor{
    height:300px;
  }
//工具區
.display-flex{
  display: flex;
}
.newBtnS{
  width:150px;
  border-radius: 100px;
  border:0.5px solid gray;
  padding: 5px 10px;
  text-align: center;
}
.newBtnS:hover{
  // transform: scale(0.9);
  color: white;
  cursor: pointer;
  background: linear-gradient(left, #0793c5,#024e66 );
}
//響應式
@media screen and (max-width:1200px) {
  .edPDcomment{
    width:1160px;
}
}
@media screen and (max-width:1024px) {
    .edPDcomment{
    width:1020px;
}
.msgShow{
    .msgShowContainer{
         width:1024px;
    }
}
   
}
@media screen and (max-width:768px) {
     .edPDcomment{
    width:768px;
    height:380px;
}
.msgShow{
    .msgShowContainer{
         width:768px;
    }
}
}
</style>