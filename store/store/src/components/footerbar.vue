<template>
  <div>

    <van-tabbar v-model="tabbarActive" @change="switchColumnBtn">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="send-gift-o">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "footerbar",
    data() {
      return {
        msg: 'footerbar',
        tabbarActive: 0
      }
    },
    mounted() {
      this.tabbarActive = Number(localStorage.getItem('inxState'));
    },
    methods: {
      switchColumnBtn() {
        let _inx = this.tabbarActive;
        switch (_inx) {
          case 0:
            this.$router.push({path: '/'}, () => {
              localStorage.setItem('inxState', 0);
            });
            break;
          case 1:
            this.$router.push({path: '/goodsType'}, () => {
              localStorage.setItem('inxState', 1);
            });
            break;
          case 2:
            this.$router.push({path: '/cart'}, () => {
              localStorage.setItem('inxState', 2);
            });
            break;
          case 3:
            this.$router.push({path: '/userAccount'}, () => {
              localStorage.setItem('inxState', 3);
            })
        }
      }
    }
  }
</script>

<style scoped>
  .wrapDiv {
    width: 85%;
    overflow: hidden;
    border: 1px solid #666;
    background-color: #eee;
    border-radius: 10px;
    margin: 10px auto;
  }

  .leftDiv {
    float: left;
    width: 40%;
    margin: 10px;
    border-radius: 10px;
    height: 30px;
    border: 1px solid #999;
    padding: 10px;
    line-height: 30px;
    text-align: center;
    font-size: 22px;
  }

  .rightDiv {
    float: right;
    width: 40%;
    margin: 10px;
    border-radius: 10px;
    height: 30px;
    border: 1px solid #999;
    padding: 10px;
    background-color: #fff;
    line-height: 30px;
    text-align: center;
    font-size: 22px;
  }

  .goodEntry {
    margin: 10px auto;
    border-radius: 10px;
    border: 1px solid #999;
    text-align: center;
    font-size: 16px;
    padding: 10px;
  }

  .cls:before, .cls:after {
    content: '';
    display: table;
  }

  .cls:after {
    clear: both;
  }

  .cls {
    *zoom: 1
  }

  .goodsCategory {
    clear: both;
    margin: 10px 0;
  }

  .goodsCategory li {
    float: left;
  }

  .goodsCategory li img {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    border: 1px solid #666;
  }
</style>
