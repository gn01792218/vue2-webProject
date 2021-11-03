
<template>
<!--此頁面需要判斷進入的會員流水號是自己還是別人，是自己才會有編輯按鈕以及創建產品的按鈕-->
  <div>
    <div class="uheader">
    <header class="userInfo-header" :style="{backgroundColor:userData.userBackgroundColor}">
      <section class="userInfo-header-icon">
          <div class="icon">
          <img :src="`${baseURL}${userData.userHeadShotPath}`" alt="會員照片等待上傳" width="300" height="300">
          </div>
          <div class="abposition" v-if="isMyUserinfo">
            <div class="btn upimg"></div>
            <h3 class="upimg-h3" >上傳個人照片</h3>
            <div class="btn design delectUserIcon" type="button"  @click="delectMyIcon" ></div>
            <h3 class="upimg-h3" >刪除</h3>
          </div>
           <input  v-if="isMyUserinfo" class="changeIconimg" type="file" accept="image/*" @change="previewImage">
      </section>
      <section class="userInfo-header-main">
        <div class="userInfo-header-main-up">
          <div class="userInfo-header-main-up1">
              <div class="name">
                 <div class="userNameP">
                   <div v-if="isMyUserinfo">
                        <input class="input" v-if="editName" type="text" v-model="userData.userRealName">
                   </div>
                  <p>{{userData.userRealName}}</p>
                  <div v-if="isMyUserinfo">
                    <button class="newBtnS" type="button"  v-if="editName" @click="fName">確認</button>
                    <button class="newBtnS" type="button"  v-if="editName" @click="editName=false">取消</button>
                      <div class="btn design" type="button" v-if="!editName" @click="edName"></div>
                  <p class="inputerr" v-if="userIserr">{{uNErr}}</p>
                  </div>
                  </div>
              </div>
              <div class="line"></div>
               <div class="usermsg">
                  <p class="inputerr" v-if="uInfoErr">{{uInfoErrMsg}}</p>
                    <div class="pen" type="button" v-else @click="edInfo"></div>
                  <vue-markdown v-if="!editInfo" class="userinfo" :source="userData.userIntroduction"></vue-markdown>
                 <div class="deMyinfo"  v-if="isMyUserinfo">
                   <quill-editor  v-if="editInfo" v-model="userData.userIntroduction" class="userInfo-textEditor"
                           :options="editorOption"
                           @blur="onEditorBlur($event)"
                           @focus="onEditorFocus($event)"
                           @change="onEditorChange($event)">
                    </quill-editor>
                    <div v-if="isMyUserinfo">
                      <div class="display-flex">
                      <button class="newBtnS" type="button"  v-if="editInfo" @click="fInfo">確認</button>
                      <button class="newBtnS" type="button"  v-if="editInfo" @click="editInfo=false">取消</button>
                    </div>
                  </div>
                   
          </div>
          </div>
          </div>
          <div class="userInfo-header-main-up3">
               <section class="creatProduct"  v-if="isMyUserinfo">
                  <div class="newBtnS" @click="creatProduct">創建專案</div>
               </section>
                 <CreateProduct class="cp" v-if="cp"
                      :createBtn="true"
                      :pageTitle="pageTitle"
                      @close="cp=false,myproducts.push($event)"      
                      >  
                    </CreateProduct>
                <section class='edPassword'  v-if="isMyUserinfo">
                  <div class="newBtnS" @click="editPassword">修改密碼</div>
                </section>
                 <div class="edPfrom" v-if="this.edp">
                    <input class="user-EditInput" type="text" placeholder="輸入舊密碼" v-model="oldPassword">
                    <input class="user-EditInput" type="password" placeholder="輸入新密碼" v-model="newPassword">
                    <p class="error" v-if="passwordError">{{passErrMsg}}</p>
                    <input class="user-EditInput" type="password" placeholder="再次輸入新密碼" v-model="newPasswordAgain">
                    <div class="display-flex">
                       <button class="newBtnS" type="button"  @click="confirmEdPassword">確認</button>
                       <button class="newBtnS" type="button"  @click="dismissEdPassword">取消</button>
                    </div>
                  </div>
                  <section v-if="isMyUserinfo">
                   <div class="newBtnS" @click="edE=true">修改mail</div>
                  </section>
                  <div class="edPMail" v-if="edE">
                    <input class="user-EditInput" type="text" placeholder="輸入信箱" v-model="email">
                    <p class="error" v-if="emailError">{{emailErrMsg}}</p>
                    <div class="display-flex">
                       <button class="newBtnS" type="button"  @click="confirmMail">確認</button>
                       <button class="newBtnS" type="button"  @click="edE=false">取消</button>
                    </div>
                  </div>
                  <div class="account">
                      <div class="newBtnSlect" type="button"  @click="isShowMyFllowed=true">
                        被訂閱數:{{followed}}
                      </div>
                        <SubscriptShow class="followed-RWD"
                         v-if="isShowMyFllowed"
                         :subType="2"
                         :id="passUser"
                         @close="isShowMyFllowed=false"
                        />
                    <div class="newBtnSlect" type="button"  @click="isShowMyFlloweing=true">訂閱數:{{ following }}</div>
                    <SubscriptShow class="follow-RWD"
                      v-if="isShowMyFlloweing"
                      :subType="1"
                      :id="passUser"
                      @close="isShowMyFlloweing=false"
                    />
              <div class="newBtnSlect useSub" v-if="!isMyUserinfo" @click="fllowedUser">訂閱</div>
            </div>
          </div>
        </div>
      </section>
       <section class="colorpicker"  v-if="isMyUserinfo">
          <p>更換面板顏色</p>
          <input type="color" v-model="userData.userBackgroundColor" @change="changeColor">  <!--影響的地方在上面哦-->
      </section>
    </header>
    </div>
    <div class="UserMain">
      <header class="UserMain-header">
        <nav class="UserMain-header-nav">
          <ul class="UserMain-header-nav-ul">
            <li class="myPd onColickSection" @click="changemySection(1)">我的專案</li>
            <li class="myFPD" @click="changemySection(2)">我追蹤的專案</li>
            <li class="myDIs" @click="changemySection(3)">我的發文</li>
            <li class="myFDis" @click="changemySection(4)">我關注的發文</li>
          </ul>
        </nav>
      </header>
      <section class="User-body">
        <section class="MyPD" v-if="section1">
          <div v-if="myproducts.length==0 && myproducts.length!=undefined && userIdd==passUser">
           <p >還沒個人專案</p>
            <div class="seemore">
              <div type="button"  @click="creatProduct">創建專案</div>
           </div>
           </div>
            <section class="myproductItem-container">
              <Product class="user-pD"
              v-for="i,index in myproducts" :key="index"
              :productObject="i"
              @open="passPDObject($event.productId)"
              />
            </section>
        </section>
        <section class="MyFPD" v-if="section2">
          <div v-if="myFllowerPeoducts.length<1 && myFllowerPeoducts.length!=undefined && userIdd==passUser">
           <p >還沒收藏的專案</p>
            <div class="seemore">
              <router-link to="/productclassification"><p>到專案分類瀏覽專案</p></router-link>
           </div>
          </div>
          <section class="myproductItem-container">
            <Product class="user-pD"
              v-for="i,index in myFllowerPeoducts" :key="index"
              :productObject="i"
              @open="passPDObject($event.productId)"
              />
           </section>
        </section>
        <section class="MyDis" v-if="section3">
          <div v-if="myDis.length<1 && userIdd==passUser">
           <p >還沒有追蹤發文</p>
            <div class="seemore">
            <router-link to="/discuss"><p>到討論區發表文章</p></router-link>
           </div>
          </div>
          <section class="popDiscoust-container">
              <Article
              v-for="i,index in myDis" :key="index"
              :article="i"
              />
            </section>
        </section>
        <section class="MyFDis" v-if="section4">
           <div v-if="myFllowerDis.length<1 && userIdd==passUser">
           <p >還沒有追蹤發文</p>
            <div class="seemore">
            <router-link to="/discuss"><p>到討論區瀏覽好文章</p></router-link>
           </div>
        </div>
        <section class="popDiscoust-container">
        <Article
          v-for="i,index in myFllowerDis" :key="index"
          :article="i"
        />
        </section>
        </section>
      </section>
    </div>
   <div class="home"><router-link to="/">首頁</router-link></div>
  </div>
</template>
<script>
// import VueSimplemde from 'vue-simplemde'
import { quillEditor } from 'vue-quill-editor'
  import Quill from 'quill'  //引入编辑器
import VueMarkdown from 'vue-markdown'
import Product from '../components/Product.vue'
import Article from'@/view/Article'
import CreateProduct from './CreateProduct.vue'
import ProductShow from '../view/ProductShow.vue'
import SubscriptShow from './SubscriptShow.vue'
import {getUserInfo} from '../Allapi'
import {editUserInfo} from '../Allapi'
import {editUserPassword} from'../Allapi'
import {getProductByuserId} from '../Allapi'
import{deleteUserIcon}from'../Allapi'
import {getUserFllowerProduct} from '../Allapi'
import{getDisByUser} from '../Allapi'
import{getUserFlloweDis} from '../Allapi'
import{fllowedUser} from '../Allapi'
import {getAfllow} from '../Allapi'
import {getAfllowed} from '../Allapi'
import {getAfllowInfo} from '../Allapi'
import{getDisFFllowerNum}from '../Allapi'

//會園區資料-->編輯的時候要改成fromData上傳，然後圖片要用file上傳。
  export default {
     inject:['reload'],  //在后代组件中注入，並调用这个方法即可刷新路由啦。
    components:{
     VueMarkdown,CreateProduct,Product,ProductShow, Article,quillEditor,SubscriptShow,
    Quill,
    },
    created(){
      // console.log(this.$router.go(-1))
      if(this.userIdd==this.passUser){this.isMyUserinfo=true}
      getUserInfo(this.passUser)
      .then(res => {
        this.userData=res.data; //密碼不會丟回來唷~~~
        this.email=res.data.userEmail;
      })
      getProductByuserId(this.passUser) //取得我的所有產品，要留著，因為是預設
        .then(res=>{
          this.myproducts=res.data;
        })
        getUserFllowerProduct(this.passUser) //取得我追蹤的產品
          .then(res=>{
            this.myFllowerPeoducts=res.data;
          })
        getDisByUser(this.passUser)  //取得我的發文
          .then(async(res)=>{
              var temp = res.data;//取得所有文章
              const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
              const newList=await Promise.all(apiList);
              temp.forEach((item,index)=>{
              item.subscribeCount=newList[index].data.subscribeCount;
              })
              this.myDis=temp;
          })
        getUserFlloweDis(this.passUser)
          .then(async(res)=>{
            var temp = res.data;//取得所有文章
              const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
              const newList=await Promise.all(apiList);
              temp.forEach((item,index)=>{
              item.subscribeCount=newList[index].data.subscribeCount;
              })
            
             this.myFllowerDis=temp;

          })
        getAfllowInfo(this.passUser) //查該會員的訂閱和被訂閱數
          .then(res=>{
            this.followed=res.data.folowedCount;
            this.following=res.data.followingCount;
          })
        getAfllowed(this.passUser) //查該會員被誰訂閱，為了訂閱按鈕設置的
          .then(res=>{
              res.data.forEach(item=>{
              if(item.userId==this.$cookies.get('token')){
                 document.querySelector('.useSub').classList.add('isSelectMeber');
              }
            })
          })
    },
    data () {
      //這裡應該要撈API資料:姓名上傳頭像，編輯描述，顯示追蹤的人數，顯示被追蹤的人數
      //顯示擁有的產品
      //顯示近期瀏覽
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
                  [{ size: ["small", false, "large", "huge"] }], // 字体大小
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
        baseURL:'http://34.80.165.225/',
        // isLoading:false,
        section1:true,
        section2:false,
        section3:false,
        section4:false,
        pageTitle:'創建專案',
        userIdd:this.$cookies.get('token'),//用來裝瀏覽者user的ID流水號
        passUser:this.$route.params.userId,//接收從大頭照點擊而來的userId(當前造訪的是誰的網頁)
        isMyUserinfo:false,
        isShowMyFlloweing:false,//是否顯示我訂閱了那些人的欄位
        isShowMyFllowed:false,//是否顯示我輩誰訂閱的欄位
        userData:{},//用來接取得的會員資料
        myproducts:[],//從CreatProduct中接收我的專案物件
        myFllowerPeoducts:[],//我追蹤的產品
        myDis:[],//用來裝我發表的文章
        myFllowerDis:[],//用來裝我追蹤的文章
        oldPassword:'',newPassword:'',newPasswordAgain:'',//裝修改密碼資料的物件
        passwordError:false,passErrMsg:'',//檢查新密碼的
        emailError:false,emailErrMsg:"",email:"",
        image: '',
        preview: '',
        uNErr:'請輸入至少一個字元',
        userIserr:false,
        // userId: this.$cookies.get('token2'), //似乎不需要用到-->userData就有了
        borderColor:'#2AC5B3',  //預設的顏色
        editName:false,
        editInfo:false,
        edE:false,//修改mail
        uInfoErr:false,
        uInfoErrMsg:"請勿輸入超過1200個字元唷(包含markdown語法)",
        edp:false,//是否顯示修改密碼
        cp:false, //創建產品的頁面是否顯示
        // ps:false,//產品展示頁是否顯示
        followed:0,//被追蹤數
        following:0,//追蹤數
        onClickproductPK:'',//接收現在被點到的產品流水號是多少
        onClickproduc:{   //測試用，目前可以
          author:'',  //作者名稱
          img:'AAAAAA',
          title:'DDDDDDDDDDDDD',
          subtitle:'DDDD',
          content:'',
          url:'',
          imgs:[],
          type:'',
          url:'',
          date:'',
        }, //當前被點到的產品物件
          configs: {//用來客製化文本編輯器的工具
          toolbar: ['bold', 'italic', 'heading', '|', 'quote']
      }
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
      changemySection(num){ //切換我的區塊的方法
        switch(num){
          case 1:
            this.section1=true;
            this.section2=false;
            this.section3=false;
            this.section4=false;
            document.querySelector('.myPd').classList.add("onColickSection");
            document.querySelector('.myFPD').classList.remove("onColickSection");
            document.querySelector('.myDIs').classList.remove("onColickSection");
            document.querySelector('.myFDis').classList.remove("onColickSection");
            break
          case 2:
            this.section1=false;
            this.section2=true;
            this.section3=false;
            this.section4=false;
             document.querySelector('.myFPD').classList.add("onColickSection");
              document.querySelector('.myDIs').classList.remove("onColickSection");
            document.querySelector('.myFDis').classList.remove("onColickSection");
            document.querySelector('.myPd').classList.remove("onColickSection");
            break
          case 3:
            this.section1=false;
            this.section2=false;
            this.section3=true;
            this.section4=false;
        document.querySelector('.myDIs').classList.add("onColickSection");
        document.querySelector('.myPd').classList.remove("onColickSection");
        document.querySelector('.myFPD').classList.remove("onColickSection");
        document.querySelector('.myFDis').classList.remove("onColickSection");
            break
          case 4:
            this.section1=false;
            this.section2=false;
            this.section3=false;
            this.section4=true;
        document.querySelector('.myFDis').classList.add("onColickSection");
        document.querySelector('.myPd').classList.remove("onColickSection");
            document.querySelector('.myFPD').classList.remove("onColickSection");
            document.querySelector('.myDIs').classList.remove("onColickSection");
            break
        }
      },
    passPDObject(PDOId){
       this.$router.push({
          path: `/productShow/${PDOId}`,
        })
       },
    fllowedUser(){ //訂閱此人，點一下是訂閱，再點一下是取消
     if(this.$cookies.get("token") != null){
             fllowedUser({followUserId:this.userIdd,followedUserId:this.passUser})
        .then(res=>{
          console.log(res);
           if(res.status==201){
                    this.followed++;
                    document.querySelector('.useSub').classList.add('isSelectMeber');
               
                }else if(res.status==204){
                    this.followed--;
                    document.querySelector('.useSub').classList.remove('isSelectMeber');
                }
        })
        }else{
          alert("訂閱屬於會員專屬功能，請先登入唷~")
           this.$router.push('/login');
        }
    
    },
    confirmMail(){ //修改mail
    console.log(this.email)
    const formData=new FormData()
     formData.append('userEmail',this.email);//要轉成fromData格式唷~
        if(!this.emailError){ //沒有錯誤才傳送
             editUserInfo(this.userData.userId,formData)
             .then(res=>{
               this.edE=false;
               alert("修改信箱成功!")
               })
        } else{
          alert("信箱格式不正確唷")
        }
    },
      edName(){ //點下去之後，把編輯name設為true
        this.editName=true; 
      },
      edInfo(){
        this.editInfo=true;
      },
      fName(){ //修改會員名稱
        if(this.userData.userRealName.length<1){
          this.userIserr=true;
        }else{ //編輯通過
          //把userData裡面的資料，put去資料庫前要先改成fromData
          const formData = new FormData()
          formData.append('userRealName',this.userData.userRealName);//要轉成fromData格式唷~
          editUserInfo(this.userData.userId,formData)
           .then(res=>{
             console.log(res);
           })
          this.editName=false;
        }
      },
      fInfo(){
        if(this.userData.userIntroduction.length>1200){//輸入超過100字不給過
              this.uInfoErr=true;
        }else{
          const formData = new FormData()
          formData.append('userIntroduction',this.userData.userIntroduction);//要轉成fromData格式唷~
         editUserInfo(this.userData.userId,formData)//再送出去
          .then(res=>{
             console.log(res);
           })
        this.uInfoErr=false;
        this.editInfo=false;
        }
      },
    changeColor(){
       const formData = new FormData()
      formData.append('userBackgroundColor',this.userData.userBackgroundColor);//要轉成fromData格式唷~
      editUserInfo(this.userData.userId,formData)//再送出去，但為何沒有執行?!
    },
    creatProduct(){
      this.cp=true;
      //但點旁邊時或是按下專案創建的時候會消失
      //並且要清除所有檔案
        this.productId=0;
        this.text='';//用來接收創建專案時候傳過來的文本
        this.name='';
        this.subtitle='';
        this.url='';
        this.type='';
        this.imgs=[]; //裝產品圖片的
        this.img='';
    },
    editPassword(){
      this.edp=true;
    },
       previewImage: function(event) { //大頭照的預覽顯示和上傳
      var input = event.target;
      if (input.files) {
        var reader = new FileReader(); //創建一個讀取器
        reader.onload = (e) => { //當load完成時，將preview變成result
          this.preview = e.target.result; //此時是base64
        }
        this.image=input.files[0];
        reader.readAsDataURL(input.files[0]);  //將讀取到的檔案編碼成Data URL
          const formData = new FormData()
          formData.append('HeadShotFile',this.image);//要轉成fromData格式唷~
          editUserInfo(this.userData.userId,formData)//再送出去
          .then(res=>{
            console.log(res);
              this.reload();//重整頁面~~~刷新帥照~
           })
      }
    },
    confirmEdPassword(){  //按下確認修改密碼後會執行的事情
      this.edp=false;
      let passwordData={};
      passwordData.oldPassword=this.oldPassword;
      passwordData.newPassword=this.newPassword;
      passwordData.newPasswordAgain=this.newPasswordAgain;
      if(!this.passwordError){
      editUserPassword(this.userIdd,passwordData)
        .then(res=>{
          console.log(res)
          alert("修改密碼成功")
          //並且強制登出
        })
        .catch(res=>{
          if(res.status!=201){
            alert("修改密碼失敗，可能原因如下:可能是舊密碼輸入錯誤，可能是確認的密碼輸入和新密碼不同。")
          }
        })
      }else{
        alert("新密碼輸入的格式不正確唷~")
      }
        
    },
    dismissEdPassword(){
      this.edp=false;
    },
    delectMyIcon(){
      var c= confirm('確定要刪除大頭照？');
      if (c) { // 確定刪除
      deleteUserIcon(this.userIdd)
        .then(res=>{
          this.userData.userHeadShotPath="";
          console.log(res);
        })
      this.reload()
      }else{return}
    },
    },
    watch:{
      '$route'(to, from) {
        this.$router.go(0);
      },
       newPassword: function () {   //檢查密碼
            var isText = /^[a-zA-Z0-9]+$/;
            var include = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
            if (!isText.test(this.newPassword)) {
                this.passwordError = true;
                this.passErrMsg = '請勿包含特殊字元';
                console.log(this.passwordError)
            }
            else if (this.newPassword.length < 6) {
                this.passwordError = true;
                this.passErrMsg = '請勿少於6個字';
                console.log(this.passwordError)
            }
            else if (this.newPassword.length > 15) {
                this.passwordError = true;
                this.passErrMsg = '請勿超過15個字';
                console.log(this.passwordError)
            }
            else if (!include.test(this.newPassword)) {
                this.passwordError = true;
                this.passErrMsg = '至少包括一個大小寫字母或數字';
                 console.log(this.passwordError)
            }
            else {
                this.passwordError = false;
                 console.log(this.passwordError)
            }
        },
        email: function () {    //檢查email
            var isMail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
            if (!isMail.test(this.email)) {
                this.emailError = true;
                this.emailErrMsg = 'email格式錯誤';
                console.log(this.emailError)
            }
            else {
                this.emailError = false;
            }
        }
        },
  }
</script>
<style lang="scss">
%mlr-center{
  margin-left: auto;
  margin-right: auto;
}
.deMyinfo{
  position: absolute;
  background-color: white;
  z-index:99;
}
.user-pD{
  margin-right: 15px;
  margin-left: 15px;
}
.cp{
  position: absolute;
  left:-5%;
  top:0%;
  z-index:10;
}
.popDiscoust-container{
  overflow-y: auto;
  height: 100vh;
}
.ps{
  position: absolute;
  left:15%;
  top:98%;
  z-index:10;
}
.User-body{
  height:100vh;
  border-top:1px solid black;
  padding-top: 20px;
}
.UserMain{
  width:1200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  border-top:1px solid black;
  .UserMain-header-nav{
    width:80%;
    margin-left: auto;
    margin-right: auto;
  .UserMain-header-nav-ul{
    display: flex;
    text-decoration: none;
    margin-left: 0;
    li{
      color:gray;
      font-size: 1.2rem;
      cursor: pointer;
      margin-right: 72px;
      margin-left: 72px;
    }
  }
  }
}
.error{
    color: red;
    margin: 0;
}
.userInfo-header{
  height:500px;
  position: relative;
  display: flex;
  padding:40px 20px;
  max-width:1200px;
  @extend %mlr-center;
  box-sizing: border-box;
  .userInfo-header-icon{
    margin-right: 50px;
  }
  .userInfo-header-main-up{
    display: flex;
  }
}
.userNameP{
  display: flex;
  font-size: 2rem;
}
.line{
  width:300px;
  border: 1px solid black;

}
.userInfo-header-main-down{
  display: flex;
}
.myproductItem-container{
      height:100vh ;
      display: flex;
      flex-wrap: wrap;
      margin-left: auto;
      margin-right: auto;
      overflow-y:auto ;
  }
.titleBborder-bottom{
  border-bottom:5px solid #024E65;
  margin-bottom: 20px;
}
.icon{
  width:300px;
  height:300px;
  background-color: #BFBAB0;
  border-radius: 100px;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 0px 3px #252526;
  overflow: hidden;
}
.userInfo-header-main-up3{
  max-height:165px;
  border-left: 2px solid black;
  border-radius: 3px;
  padding-left: 10px;
}
  .upimg-h3{
    margin: 0;
  }
.info1,.info2{
  margin-left: 40px;
}
.userinfo{
  width:600px;
  word-wrap: break-word;
}
.delectUserIcon{
  margin-left: 20px;
}
.popDiscoust-container{
    max-width:1200px;
    margin-left: auto;
    margin-right: auto;
    .popDiscoust-item:hover{
      transform: scale(0.95);
    }
  }
.account{
  text-align: left;
  margin-right: auto;
}
.pen,.file,.design,.upimg{
   box-shadow: 0px 0px 10px #024E66;
   border-radius: 5px;
}
.pen{
    width:24px;
    height:24px;
    background-image: url("../assets/icon.png");
    background-position: -24px 0;
    margin-left: 50%;
    // border: 1px solid black;
   
  }
  .pen:hover{
    transform: scale(0.8);
  }
  .file{
    width:24px;
    height:24px;
    background-image: url("../assets/icon.png");
    background-position: -48px 0;
  }
  .file:hover{
    transform: scale(0.8);
  }
  .design{
    width:24px;
    height:24px;
    background-image: url("../assets/icon.png");
   
  }
  .design:hover{
    transform: scale(0.8);
  }
  .upimg{
    width:24px;
    height:24px;
    background-image: url("../assets/icon.png");
    background-position: -72px 0;
   
  }
  .upimg:hover{
    transform: scale(0.8);
  }
   .changeIconimg{
     width:50px;
    opacity: 0;
    position: absolute;
    left:65px;
    bottom:25%;
  }
  .abposition{
   display: flex;
   position: absolute;
   bottom:25%;
   left:65px;
    .upimg{
      margin-right: 10px ;
    }
  }
.name{
  display: flex;
}
.edPassword{
  display: flex;
}
.edPfrom{
  margin-right: auto;
}
.creatProduct-btn{
  margin-bottom: 20px;
}
.usermsg{
  text-align: left;
}
.usermsg-editor{
  // height:100px;
  background-color: white;
  // position: absolute;
  width:600px;
}
.colorpicker{
  position: absolute;
  display: flex;
  right:0;
  bottom:0;
}
.colorpicker p{
  margin: 0;
}
.input{
  height:30px;
  margin-top: auto;
  margin-bottom: auto;
}
.inputerr{
  color: #F23E16;
}
.creatProduct{
  margin-left: auto;
  display: flex;
}
//工具區
//文字編輯器的
.display-flex{
  display: flex;
}
.user-EditInput{
  width:280px;
  height:30px;
}
.onColickSection{
  color:green !important;
  font-weight: bold;
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
.isSelectMeber{
  background-color: red;
  color:white;
}
 .seemore{
       cursor: pointer;
       border-radius: 5px;
       background-color: brown;
       color:white;
       width:200px;
       height:50px;
       margin-left: auto;
       margin-right: auto;
       padding-top: 15px;
       box-sizing: border-box;
        a{color:white;}
        p{margin: 0;}
     }
     .seemore:hover{
       background-color: gray;
     }
  .newBtnSlect{
  width:150px;
  border-radius: 100px;
  border:0.5px solid palevioletred;
  padding: 5px 10px;
  color: black;
  text-align: center;
}
.newBtnSlect:hover{
  transform: scale(0.9);
  cursor: pointer;
}
.newBtnSlect{
  width:150px;
  border-radius: 100px;
  border:0.5px solid palevioletred;
  padding: 5px 10px;
  color: black;
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
//響應式
@media screen and (max-width:1200px) {

}
@media screen and (max-width:1024px) {
  .UserMain{
  width:1024px;
   .User-body{
    .MyPD{
      .myproductItem-container{
        .user-pD{
          margin-right: 10px;
        }
      }
    }
    .MyFPD{
      .myproductItem-container{
        .user-pD{
          margin-right: 10px;
        }
      }
    }
  }
  .UserMain-header-nav{
    // width:80%;
  .UserMain-header-nav-ul{
    margin-left: 0;
    li{
      font-size: 1.2rem;
      margin-right: 52px;
      margin-left: 52px;
    }
  }
  }
}
.userinfo{
  width:450px;
}
}
@media screen and (max-width:768px) {
  .UserMain{
  width:768px;
   .User-body{
    .MyPD{
      .myproductItem-container{
        .user-pD{
          margin-left: 45px;
        }
      }
    }
    .MyFPD{
      .myproductItem-container{
        .user-pD{
          margin-left: 45px;
        }
      }
    }
  }
  .UserMain-header-nav{
    // width:80%;
  .UserMain-header-nav-ul{
    margin-left: 0;
    li{
      font-size: 1.2rem;
      margin-right: 25px;
      margin-left: 25px;
    }
  }
  }
}
.userinfo{
  width:450px;
}
.userInfo-header{
  .userInfo-header-main-up{
    display: block;
  }
}
}
.followed-RWD{
  position: absolute;
  z-index: 9999;
}
.follow-RWD{
  position: absolute;
  z-index: 99;
}
</style>