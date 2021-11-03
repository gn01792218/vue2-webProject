<template>
  <div class="articleShow">
    <div class="articleShowContainer">
      <h1>討論文章</h1>
      <div class="aticleShow-headerBar"></div>
      <section class="articleShow-header">
       <div class="articleShow-icon">
            <div class="articleShow-item">
              <MeberBar
               :userHeadShot="authorHeadShot"
                :userAccount="authorAccount"
                :userId="article.userId"
              />
            <div class="articleShow-article">
              <div v-if="isEd" class="ArticleShow-editor">
                  <input class="articleShow-edTitle"  type="text" v-model="article.discusstionTitle">
                  <quill-editor class="ArticleShow-textediter" v-model="article.discusstionContent" 
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
                  </quill-editor>
                  <div class="articleShow-editTag">
                    <p>修改標籤</p>
                    <input class="articleShow-edTag-input" type="text" v-model="disExitTagTemp">
                  </div>
                   <div class="display-flex">   
                    <div class="newBtnS" @click="confirmEdDis" >確認編輯</div>
                   <div class="newBtnS" @click="disMisEdDis" >取消編輯</div>
                   </div>
              </div>
              <div class="articleShow-title" v-if="!isEd">
                 <p class="articleShow-date">{{article.discusstionDateTime}}</p>
                <h1>{{article.discusstionTitle}}</h1>
                 <div class="articleShow-existedTag">
                <!-- 這裡會顯示已經有的標籤 樣式為#標籤 -->
                <div class="articleShow-existedTag-item" v-for="i,index in disAllExTag" :key="index" 
                @click="clickExitTag(i)">
                    <p>#{{i}}</p>
                </div>
            </div>
              </div>           
              </div>
          </div>
        </div>
         <div class="articleShow-upvote">
              <div class="upvoteCount">
                  <div class="upvote-img"></div>
                  <p>關注人數:{{articleFllowerCount}}</p>
                </div>
              <div class="newBtnSlect asSelect" @click="upvoteArticle"> 點我關注 </div>
              <div class="newBtnS" @click="edArticle" v-if="browseUserId==article.userId">編輯我的發文</div>
              <div class="newBtnS" @click="delectArticle" v-if="browseUserId==article.userId">刪除我的發文</div>
            </div>
       </section>
       <article class="mainArticle" v-if="!isEd">
         <div class="mainArticle-line"></div>
           <vue-markdown :source="article.discusstionContent"></vue-markdown>
       </article>
       <section class="ArticleShow-discuss">
             <div class="leaveMsg">
               <div class="createdATMSG"  @click="leaveMsg">+參與評論</div>
                   <div class="createdATMSG-markdown" v-if="isleaveMsg">
                      <quill-editor v-if="isleaveMsg" v-model="content" class="cartS-textEditor"
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
             <div class="msgShow"> 
               <LeaveMSG v-for="i,index in contents" :key="index"
                :Comment="i"
                :isPDC="false"
               />
             </div>
             <div v-if="contents.length>4"> 
             <div class="createdATMSG"  @click="leaveMsg2">+參與評論</div>
              <div class="createdATMSG-markdown" v-if="isleaveMsg2">
                 <quill-editor v-if="isleaveMsg2"  v-model="content" class="cartS-textEditor"
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
                    </quill-editor>
                   </div>
                    <div v-if="isleaveMsg2" class="display-flex">
                      <div class="newBtnS" @click="confirmMsg" >送出</div>
                      <div class="newBtnS" @click="dismisMsg" >取消</div>
            </div>
            </div>
        </section>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
  import Quill from 'quill'  //引入编辑器
import VueMarkdown from 'vue-markdown'
import LeaveMSG from "../view/LeaveMSG.vue"
import MeberBar from "../components/MeberBar.vue"
import Article from'@/view/Article'
import {getUserInfo} from '../Allapi'
import {getDis} from '../Allapi'
import{upvoat} from '../Allapi'
import{getDisFFllowerNum} from '../Allapi'
import{deleteDis} from '../Allapi'
import{editDis} from '../Allapi'
import{createDisComment} from '../Allapi'
import{getDisAllComment}from '../Allapi'
import{getFlloweDisUserInfo} from '../Allapi'
export default {
   inject: ["reload"], //在后代组件中注入，並调用这个方法即可刷新路由啦。
    components: {
       quillEditor,
          Quill,
     VueMarkdown,
    LeaveMSG,
    MeberBar,
    Article,
  },
  created(){
    //顯示留言
    getDis(this.$route.params.showArticleId)//路由會傳一個文章id過來
      .then(res=>{
        this.article=res.data;
         this.article.discusstionDateTime=this.article.discusstionDateTime.slice(0,16)
         this.article.discusstionDateTime=this.article.discusstionDateTime.replace('-','.');
         this.article.discusstionDateTime=this.article.discusstionDateTime.replace('T',' ');
        this.disExitTagTemp=this.article.discusstonCategory;

        this.disAllExTag=this.disExitTagTemp.split("#");
        this.disAllExTag=[...(new Set(this.disAllExTag))];
        getUserInfo(this.article.userId)
          .then(res=>{
            this.authorAccount=res.data.userAccount;
            this.authorHeadShot=res.data.userHeadShotPath;
             getDisFFllowerNum(this.$route.params.showArticleId)
              .then(res=>{
                this.articleFllowerCount=res.data.subscribeCount;
              })
          })
      })
    getDisAllComment(this.$route.params.showArticleId)
      .then(async (res)=>{
        var temp=res.data;
        //還要取得所有留言的使用者大頭和帳號
        const apiList=temp.map(async(item)=>await getUserInfo(item.userId));
        const newList=await Promise.all(apiList);
        temp.forEach((item,index)=>{
          item.userAccount=newList[index].data.userAccount;
          item.userHeadShotPath=newList[index].data.userHeadShotPath;
        })
       this.contents=temp;            
      })
    getFlloweDisUserInfo(this.$route.params.showArticleId)
      .then(res=>{
         res.data.forEach(item=>{
              if(item.userId==this.$cookies.get('token')){
                 document.querySelector('.asSelect').classList.add('isSelectAS');
              }
            })
      })
  },
    props:['onClickArticle'],//接收點選的該則留言資料
    data(){
      return{
        isleaveMsg2:false,//超過五則時下方顯示的留言
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
                  //  [{ size: ["12px",false,"20px","24px","100px"]}],
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
         isEd:false,
         isEdCom:false,
         onClickTag:'',//被點選的標籤
         filterArticle:[],//裝點選標籤後篩選的文章
         disExitTagTemp:'',//暫存標籤字串
         disAllExTag:[],//儲存切割的字串
         browseUserId:this.$cookies.get('token'),
         articleFllowerCount:0,//追蹤此則文章的人
         article:{},//本article物件
         authorAccount:'',
         authorHeadShot:'',
         contents:[],//裝下本產品中的所有留言
         content:'',//讓使用者留下評論的暫存內容
         isleaveMsg:false,
         prevRoute:'',//獲取上一頁的路由
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
      passTag(exitTag){
        if(exitTag==""){
          exitTag="所有文章"+exitTag;}
            this.$router.push({
          path: `/ArticleShowFilter/${exitTag}`,
        })
        },
        clickExitTag(exitTag){ //每個tag點擊可以搜尋文章tag
          this.passTag(exitTag)
        },
      edArticle(){
        this.isEd=true;
      },
      confirmEdDis(){
        if(this.article.discusstionTitle.length>0 && this.article.discusstionContent.length>0){
          if(this.disExitTagTemp[0]!=='#'){
              this.disExitTagTemp='#'+this.disExitTagTemp;
          }
        editDis(this.article.discusstionId,{discusstionTitle:this.article.discusstionTitle,discusstionContent:this.article.discusstionContent,discusstionCategory:this.disExitTagTemp})
          .then(res=>{
              console.log(res);
             this.reload();
          })
        }else{
          alert("標題和內文都需要輸入文字")
        }
      },
      disMisEdDis(){
        this.isEd=false;
      },
      delectArticle(){
        var c=confirm('刪除後發文將無法回復，確定要刪除發起的文章嗎?')
        if(c){
          deleteDis(this.article.discusstionId)
          .then(res=>{
            this.$router.go(-1);
            // this.$router.push('/discuss');
          })
        }else{return}
      },
      upvoteArticle(){//追蹤文章
      if(this.$cookies.get('token')!=null){
        upvoat({followUserId:this.$cookies.get('token'),followedDiscusstionId:this.$route.params.showArticleId})
          .then(res=>{
            if(res.status==201){
                    this.articleFllowerCount++;
                    document.querySelector('.asSelect').classList.add('isSelectAS');
                }else if(res.status==204){
                    this.articleFllowerCount--;
                     document.querySelector('.asSelect').classList.remove('isSelectAS');
                }
          })
          }else{
            alert("關注文章是會員專屬功能，請先登入或註冊")
            this.$router.push('/login');
          }
      },
      leaveMsg(){
        if(this.$cookies.get("token") != null){
           this.isleaveMsg=true;
        }else{
          alert("留言屬於會員專屬功能，請先登入唷~")
           this.$router.push('/login');
        }
     },
     leaveMsg2(){
        if(this.$cookies.get("token") != null){
           this.isleaveMsg2=true;
        }else{
          alert("留言屬於會員專屬功能，請先登入唷~")
           this.$router.push('/login');
        }
     },
      confirmMsg(){
        if(this.content.length>0){
        createDisComment({discusstionId:this.article.discusstionId,userId:this.browseUserId,discusstionCommentContent:this.content})
          .then(res=>{
            this.reload();
          })
          }else{alert('若要留下評論，請輸入內容唷~')}
     },
      dismisMsg(){
         this.isleaveMsg=false;
         this.isleaveMsg2=false;
     },
     edDisComent(){
       this.isEdCom=true;
     },
     dismisEdDisComent(){
       this.reload();
     }
    },
    watch:{

    }
}
</script>

<style lang="scss">
%mlr-center{
  margin-left: auto;
  margin-right: auto;
}
    .mainArticle{
      text-align: left;
      padding-left: 10px;
      .mainArticle-line{
        width:100%;
        border-top: 1px solid #0687B5;
        margin-top: 20px;
      }
    }
//重新撰寫
.articleShow{
  margin-bottom: 20px;
}
.articleShow-editTag{
  display: flex;
  p{
    margin: 0;
    padding-top:7px;
  }
}
.articleShow-edTag-input{
  width:500px;
  height:30px;
  margin-bottom: 20px;
}
.ArticleShow-editor{
  height:400px;
  margin-bottom: 80px;
}
.ArticleShow-textediter{
  height:300px;
  margin-bottom: 60px;
}
.createdATMSG-markdown{
  height:350px;
}
.cartS-textEditor{
  height:300px;
}
.articleShow-date{
  color:gray;
}
.articleShowContainer{
  width:1200px;
  margin-left: auto;
  margin-right: auto;
}
.aticleShow-headerBar{
   width:1260px;
  height:20px;
  background: linear-gradient(left, #024e66, #0793c5);
  margin-bottom: 20px;
}
.articleShow-header{
  display: flex;
}
.articleShow-icon{
  display: flex;
}
.articleShow-title{
  text-align: left;
  border-left: 2px solid #0793c5;
  padding-left: 10px;
}
.articleShow-edTitle{
  width:99%;
  font-size: 1.5rem;
}
.articleFllowerCount{
  margin-left: auto;
}
.articleShow-upvote{
  width:150px;
  margin-left: auto;
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
.editor-statusbar{
  display: none;
}
.articleShow-existedTag{
    display: flex;
    flex-wrap: wrap;
    width:1200px;
    margin-left: auto;
    margin-right: auto;
    
}
.articleShow-existedTag-item{
    cursor: pointer;
    color: #42B983;
    margin-left: 5px;
    p{
        margin: 0;
    }
}
//工具區
.isSelectAS{
  background-color: red;
  color:white;
}
.display-flex{
  display: flex;
}
.createdATMSG{
  width:180px;
  margin-left: auto;
  margin-right: auto;
  background-color: orange;
  border-radius: 5px ;
   font-size: 1.2rem;
  height:30px;
}
.createdATMSG:hover{
  transform: scale(1.1);
  opacity: 0.8;
  transition: transform 0.5s ease ,opacity 1s ease;
  cursor: pointer;
 
}
.newBtnS{
  width:150px;
  border-radius: 100px;
  border:0.5px solid gray;
  padding: 5px 10px;
}
.newBtnS:hover{
  // transform: scale(0.9);
  cursor: pointer;
  color: white;
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
//響應式
@media screen and (max-width:1200px) {
  .aticleShow-headerBar{
   width:1200px;
    }
    .articleShow-header{
      width:1200px;
    }
 .articleShow-upvote{
   margin-left:-200px;
 }
}
@media screen and (max-width:1024px) {
   .aticleShow-headerBar{
   width:1024px;
    }
    .articleShow-header{
      width:1024px;
    }
 .articleShow-upvote{
   margin-left:-400px;
 }
 .mainArticle{
     width:1024px;
      .mainArticle-line{
        width:100%;
        border-top: 1px solid #0687B5;
        margin-top: 20px;
      }
    }
  .ArticleShow-discuss{
    width:1024px;
  }
}
@media screen and (max-width:768px) {
  .aticleShow-headerBar{
   width:768px;
    }
    .articleShow-header{
      width:768px;
    }
 .articleShow-upvote{
   margin-left:-600px;
 }
 .mainArticle{
     width:768px;
      .mainArticle-line{
        width:100%;
        border-top: 1px solid #0687B5;
        margin-top: 20px;
      }
    }
  .ArticleShow-discuss{
    width:768px;
  }
  .ArticleShow-editor{
    width:768px;
    height:550px;
    position: absolute;
    background: white;
  }
.articleShow-editTag{
 margin-top: 70px;
}
.createdATMSG-markdown{
  margin-bottom: 20px;
}
}

</style>