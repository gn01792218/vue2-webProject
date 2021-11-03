<template>
  <div class="MeberBar" @click="passUserId">
      <div class="MeberBar-IMG">
          <img  :src="`${baseURL}${userHeadShot}`" :alt="userAccount" width="50" height="50">
      </div>
      <div class="MeberBar-Account">
          <p>{{userAccount}}</p>
      </div>
  </div>
</template>
<script>
export default {
    props:['userHeadShot','userAccount','userId'],
    created(){
    },
    data() {
        return {
            baseURL: 'http://34.80.165.225/'
        };
    },
    methods:{
        passUserId(){
            this.$router.push({
          path: `/userInfo/${this.userId}`,
        })
        },
    },
      watch:{
          userHeadShot:function(){
          },
        '$route'(to, from) {
          this.$router.go(0);
          },
        },
}
</script>

<style lang="scss">
    .MeberBar{
        display: flex;
        cursor: pointer;
        .MeberBar-IMG{
            width:50px;
            height:50px;
            border-radius: 100%;
            overflow: hidden;
            margin-right: 10px;
        }
        .MeberBar-Account{
            p{
                margin: 0;
                padding-top:15px;
            }
        }
    }
</style>