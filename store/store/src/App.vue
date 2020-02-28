<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  /*购物车页面复选框label的样式*/
  .van-checkbox__label {
    width: 100%;
  }

  /*购物车确认地址界面*/
  .van-dialog__message {
    text-align: left;
  }

  /*订单页面的小红线*/
  .van-tabs__line {
    z-index: 0;
  }

  /*平台端订单盒子*/
  .el-card__body {
    display: flex;
    flex-wrap: wrap;
  }
</style>
