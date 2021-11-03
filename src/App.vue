<template>
  <div id="app">
    <Header class="header"
     v-if="isShowRouter"
    />
    <router-view
    v-if="isShowRouter"
    />
    <footer class="fotter">
      <p>2021 © All rights reserved by Tsz</p>
      </footer>         
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Home from './view/Home'
export default {
  name: 'App',
  components:{
   Home,Header,
  },
   provide(){
    return{
      reload:this.reload   ,//提供這裡面的方法
      sortKey:this.sortKey, //排序方
    }
  },
  data(){
    return{
      isShowRouter:true, //這個狀態要v-if放在你想要讓他刷新的元件身上唷
    }
  },
   methods:{
    reload(){//重整的方法，會整個頁面全部重整
      this.isShowRouter = false;
      this.$nextTick(()=>{
        this.isShowRouter = true;
      })
    },
       sortKey(array, key) { //排序的方法
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
  }
}
</script>

<style lang="scss">
%mr-center{
  margin-left: auto;
  margin-right: auto;
}
body{
  margin: 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  /* color:#F23E16; */
  color: #42b983;
  text-decoration: none;
}
a:hover{
  color:#F241C3;
}
h1{
  color:#252526;
}
#app {
  /*
  微軟正黑體=Microsoft JhengHei
  新細明體 =PMingLiU
  細明體=MingLiU
  標楷體=DFKai-sb
   */
  font-family: "Microsoft JhengHei",Arial, Helvetica,'Avenir' , sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#app{
  // @extend %mr-center;
}
p{
   letter-spacing:1.2px;
}
h2{
  // letter-spacing:1.5px;
}
.fotter{
  height:85px;
  background-color: black;
  color:white;
  p{
   margin: 0;
   padding-top: 15px;
  }
}
    	::-webkit-scrollbar{
				width: 20px;/*竖向滚动条的宽度*/
				height: 20px;/*横向滚动条的高度*/
			}
			::-webkit-scrollbar-thumb{/*滚动条里面的小方块*/
      // background-color: gray;
				background: #025068ee;
				border-radius: 5px;
        box-shadow: 1px 1px 10px white;
			}
			::-webkit-scrollbar-track{/*滚动条轨道的样式*/
      //  background: linear-gradient(left, #024e66, #0793c5);
				background: #ccc;
				border-radius: 0px;
			}

</style>
