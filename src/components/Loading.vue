<template>
  <div class="Loading"></div>
</template>

<script>
export default {
name: 'Loading' // 定义的组件名称 使用时写法：loading
}
</script>

<style lang="scss">

.Loading{
    position: fixed;
  left: 0;
  top: 0;
  background: url('~@/assets/loading.svg') center center no-repeat rgba(55, 55, 55, 0.5);
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

</style>