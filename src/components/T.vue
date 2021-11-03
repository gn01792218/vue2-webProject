<template>
  <div class="background">
      <div class="T" @click="fillColor">
      </div>
  </div>
</template>

<script>
//這是一個訂閱的按鈕
export default {
    methods:{
        fillColor(){
            document.querySelector('.T').classList+=" TinTouch";
            this.$emit('fill');//被點的時候發射一個fill訊號，告知外面現在是填滿狀態
        },
    }
}
</script>

<style lang="scss">
    .background{
        width:50px;
        height:50px;
        overflow: hidden;
        position: relative;
        border-bottom: 2px solid red;
        .T{
            width:50px;
            height:50px;
            border: 2px solid red;
            transform: rotate(45deg);
            position: absolute;
            bottom:-80%;
        }
    }
    .TinTouch{
        background-color: red;
    }
</style>