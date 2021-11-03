<template>
 <div class="hello">
    <h1>討論區</h1>
    <header class="Diss-header">
       <div class="createdDis" @click="canCreatDis">
        <h3>+發起討論</h3>
      </div>
    </header>
    <section class="diplay">
      <div class="seachBar">
        <div class="wroper">
          <input class="searchBar-input" type="text" placeholder="關鍵字搜尋" v-model="keyWord" @keyup.enter="filter">
          <select class="searchBar-select" v-model="filterValue">
            <option value="作者名稱" >依作者帳號搜尋</option>
            <option value="文章標題" selected>依文章標題搜尋</option>
          </select>
        </div>
           <h2>文章標籤搜尋</h2>
          <div class="Diss-existedTag">
                <!-- 這裡會顯示已經有的標籤 樣式為#標籤 -->
                <div class="Dis-tag">
                <div class="Diss-existedTag-item" v-for="i,index in disAllExTag" :key="index" 
                @click="clickExitTag(i)">
                    <p>#{{i}}</p>
                </div>
                </div>
            </div>
      </div>
    <h2>熱門討論主題</h2>
        <section class="popDiscoust-container">
          <Article class="A"
            v-for="i,index in discustArticles" :key="index"
            :article="i"
          />
        </section>
        <div class="article-seemore" @click="clickExitTag('pop')">
            <p>看更多熱門討論</p>
        </div>
    <h2>最新討論主題</h2>
     <section class="popDiscoust-container">
          <Article class="A"
            v-for="i,index in sortByDateDis" :key="index"
            :article="i"
          />
          <creatArticle v-if="isCreatDis" class="CA" 
        @close="isCreatDis=false"
       />
        </section>
        <div class="article-seemore" @click="clickExitTag('new')">
            <p>看更多最新討論</p>
        </div>
    </section>
  </div>
</template>

<script>
import ArticleShow from '@/components/ArticleShow'
import Article from'@/view/Article'
import creatArticle from'./creatArticle.vue'
import {getAllDis} from '../Allapi'
import{getDisFFllowerNum} from '../Allapi'
import{getUserInfo} from '../Allapi'
import{getDisBycategory} from '../Allapi'
export default {
  components:{
    ArticleShow,Article,creatArticle,
  },
  created(){
     getAllDis().then(async(res) => {
      var temp = res.data;//取得所有文章
      const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
      const newList=await Promise.all(apiList);
      temp.forEach((item,index)=>{
        item.subscribeCount=newList[index].data.subscribeCount;
      })
      //依照人氣排序的文章
      temp=await this.sortKey(temp,'subscribeCount');
      //順便處理標籤
       temp.forEach((item,index)=>{ 
         if(index<20){ //只取前20則熱門留言的標題
           this.disExitTagTemp+=item.discusstonCategory;
           if(index<5){ //並且只有前五則熱門的會在首頁
                this.discustArticles.push(item);
            }
           }else{return}
        })
        this.disAllExTag=this.disExitTagTemp.split("#");
        this.disAllExTag=[...(new Set(this.disAllExTag))];
      // //依照日期排序的文章，拿上面選出的5則來另外排序
      // var temp2=this.discustArticles.slice(0,this.discustArticles.length) //要用淺拷貝，才不會影響到原本的
      // this.sortByDateDis=await this.sortKey(temp2,'discusstionDateTime')
    });
    getAllDis().then(async(res) => {
      var temp = res.data;//取得所有文章
      const apiList=temp.map(async(item)=>await getDisFFllowerNum(item.discusstionId))
      const newList=await Promise.all(apiList);
      temp.forEach((item,index)=>{
        item.subscribeCount=newList[index].data.subscribeCount;
      })
      temp=await this.sortKey(temp,'discusstionDateTime');
      temp.forEach((item,index)=>{ 
         if(index<5){ //只取前5則最新留言的標題
                this.sortByDateDis.push(item);
           }
        })
    });
    getAllDis().then(async(res) => {
        this.allDis=res.data;//為了給篩選用的
        const getUserAccountList=this.allDis.map(async(item)=>await getUserInfo(item.userId));
        const getNewList=await Promise.all(getUserAccountList);
        this.allDis.forEach((item,index)=>{
            item.userAccount=getNewList[index].data.userAccount;
        })
    });

  },
  data () {
    return {
      disExitTagTemp:'',//用來裝所有的tag字串(為了set不重複用的)
      disAllExTag:[],//用來裝所有已存在的標籤(不重複唷~)
      isCreatDis:false,
      // isfilter:false,
      // isKeyWord:false,
      // onClickTag:'',
      filterValue:'',//篩選值
      keyWord:'',//關鍵字
      allDis:'',//拿來裝所有留言
      filterArticle:[],//拿來裝篩選過後的文章
      sortByDateDis:[],//裝依照日期排序的
      discustArticles:[],
      onClickarticlePk:'',
      onClickarticle:{
        author:'',title:'',date:'',upvote:'',img:'',content:''
      }
    }
  },
     watch:{
    '$route'(to, from) {
        this.$router.go(0);
      },
  },
  methods:{
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
        sortKeyDown(array,key){
            return array.sort(function(a,b){
              var x = a[key];
              var y = b[key];
            return ((x>y)?-1:(x<y)?0:1)
          })
        },
     sortKey(array,key){
    return array.sort(function(a,b){
     var x = a[key];
     var y = b[key];
     return ((x>y)?-1:(x<y)?1:0)
    })
   },
    filter(){
      switch(this.filterValue){
        case "文章標題":
          this.keyWord="文章標題*"+this.keyWord;
          this.passTag(this.keyWord);
          break
        case "作者名稱":
           this.keyWord="作者名稱*"+this.keyWord;
          this.passTag(this.keyWord);
          break
        case "": //預設情況
        this.keyWord="文章標題*"+this.keyWord;
          this.passTag(this.keyWord);
          break
      }
    },
    canCreatDis(){
      if(this.$cookies.get('token')!=null){
        this.isCreatDis=true;
      }else{
        alert("發表文章是會員專屬功能~請先登入或註冊唷~")
        this.$router.push('/login');
      }
    },
  }
}
</script>
<style lang="scss">
.Diss-header{
  width:1200px;
  margin-left: auto;
  margin-right: auto;
   background: linear-gradient(left, #024e66, #0793c5);
}
.createdDis{
  width:200px;
  margin-left: auto;
  background-color: orange;
  border-radius: 5px ;
}
.createdDis:hover{
  transform: scale(1.1);
  opacity: 0.8;
  transition: transform 0.5s ease ,opacity 1s ease;
  cursor: pointer;
}
.A{
  position: relative;
}
.CA{
  position: absolute;
  top:30%;
}
.test{
    height: 100vh;
}
.popDiscoust-container{
    max-width:1200px;
    margin-left: auto;
    margin-right: auto;
    border-top: 5px solid #024E65;
    margin-bottom: 40px;
    .popDiscoust-item:hover{
      transform: scale(0.95);
    }
  }
  .Diss-existedTag{
    width:1200px;
      display: flex;
    flex-wrap: wrap;
     margin-left: auto;
    margin-right: auto;
    justify-content: center; 
    align-items: center; 
    border-top:1px solid rgba(155,155,155,0.5);
    border-bottom:1px solid rgba(155,155,155,0.5);
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom:40px;
  .Dis-tag{
    display: flex;
  }
}
.Diss-existedTag-item{
    cursor: pointer;
    color: #42B983;
    margin-left: 5px;
    p{
        margin: 0;
    }
}
  //工具區
  .seachBar{
    width:1200px;
    margin-left: auto;
    margin-right: auto;
     .wroper{
       background-color: #f2f2f2;
       border:2px solid black;
       width:35%;
       margin-left: auto;
       padding: 0;
    .searchBar-input{
      background-color: #f2f2f2;
      width:210px;
      height:25px;
      font-size: 1.2rem;
      border-radius: 10px;
      border: 0px;
      }
      .searchBar-input:focus{
        border: none;
        outline: none;//清除聚焦時候的邊框
      }
    .searchBar-select{
      background-color: #f2f2f2;
      width:200px;
      height:25px;
      font-size: 1rem;
      border:0px;
    }
    .searchBar-select:focus{
      appearance: none;//隱藏下拉圖示
      border:none;
      outline: none;
    }
  }
  }
 .article-seemore{
       border-radius: 5px;
       background-color: brown;
       color:white;
       width:200px;
       height:50px;
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 40px;
       p{
         padding-top: 13px;
       }
        a{color:white;}
     }
     .article-seemore:hover{
       background-color: gray;
       cursor: pointer;
     }
//響應式
@media screen and (max-width:1024px) {
  .Diss-header{
  width:1024px;
}
.Diss-existedTag{
    width:1024px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom:40px;
  .Dis-tag{
    display: flex;
  }
}
 .seachBar{
    width:1024px;
     .wroper{
    margin-left: auto;
    margin-right: auto;
       width:80%;
    .searchBar-input{
      width:570px;
      height:25px;
      font-size: 1.2rem;
      border-radius: 10px;
      border: 0px;
      }
    .searchBar-select{
      width:190px;
    }
  }
  }
}
@media screen and (max-width:768px) {
  .Diss-header{
  width:768px;
}
.Diss-existedTag{
    width:768px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin-bottom:40px;
  .Dis-tag{
    display: flex;
  }
}
   .seachBar{
    width:768px;
     .wroper{
         margin-left: auto;
    margin-right: auto;
       width:90%;
    .searchBar-input{
      width:500px;
      height:25px;
      font-size: 1.2rem;
      border-radius: 10px;
      border: 0px;
      }
    .searchBar-select{
      width:150px;
    }
  }
  }
}
</style>