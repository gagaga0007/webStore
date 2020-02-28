<template>
  <div style="display: flex;flex-direction: column;">

    <div style="height: 46px;">
      <van-nav-bar title="用户中心">
        <span slot="right" v-if="!isNoLogin" @click="logOut" style="color:#1989fa;">退出登录</span>
      </van-nav-bar>
    </div>

    <div style="flex: 1;">

      <div class="userPane">
        <div v-if="isNoLogin" class="userLogin">
          <van-button round color="linear-gradient(to right, #63B8FF, #87CEFF)"
                      @click="loginBtn" style="margin-right: 10%">
            登 录
          </van-button>
          <van-button round color="linear-gradient(to right, #87CEFF, #63B8FF)" @click="registerBtn">
            注 册
          </van-button>
        </div>

        <div v-if="!isNoLogin" class="userInfo">
          <h2>欢迎您， {{userName}} 。</h2>
          <span>个性签名：{{describe}}</span>
        </div>

        <div v-if="!isNoLogin" class="userData">
          <div class="userData-l userDataItem" @click="goToUserOrder">
            <span><van-icon name="send-gift-o"/> 我的订单</span>
          </div>
          <div class="userData-r userDataItem" @click="goToUserInfo">
            <span><van-icon name="orders-o"/> 收货信息</span>
          </div>
        </div>
      </div>

      <div class="userSetting" v-if="!isNoLogin">
        <van-cell-group>
          <van-cell value="修改个性签名" is-link to="/updateDescribe"/>
          <van-cell value="修改登录密码" is-link to="/oldPassword"/>
        </van-cell-group>

        <div style="margin-top: 50px;">
          <van-cell-group>
            <van-cell value="跳转至平台端" is-link to="/adminIndex"/>
          </van-cell-group>
        </div>
      </div>

      <div v-if="isNoLogin" class="noLoginTxt">
        <span>登 录 体 验 更 精 彩</span>
      </div>

    </div>

    <div style="height: 50px;">
      <footerbar></footerbar>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';
  import footerbar from './footerbar';

  export default {
    name: "userAccount",
    data() {
      return {
        userName: 's',
        describe: '',

        isNoLogin: true
      }
    },
    components: {footerbar},
    created() {
      //设置底部栏的状态
      localStorage.setItem('inxState', 3);

      //是否登录，获取浏览器保存的用户名
      if (localStorage.username) {
        this.userName = localStorage.username;
        this.isNoLogin = false;
        //获取用户的个性签名
        this.getUserDescribe(localStorage.username);
      }


    },
    methods: {
      //LOGOUT
      logOut() {
        this.$dialog.confirm({
          title: '退出登录？'
        }).then(() => {
          localStorage.username = '';
          this.isNoLogin = true;
          localStorage.cartDataInfo = '';
          this.$toast.success('已退出');
        }).catch(() => {
        })
      },
      //Login
      loginBtn() {
        this.$router.push({path: '/login'})
      },
      //Register
      registerBtn() {
        this.$router.push({path: '/register'})
      },
      //获取个性签名
      getUserDescribe(username) {
        axios.get(API_LIST.getDescribe, {params: {username: username}})
          .then(_d => {
            this.describe = _d.data;
          })
      },
      goToUserInfo() {
        this.$router.push('/userInfo');
      },
      goToUserOrder() {
        this.$router.push('/userOrders');
      }
    }
  }
</script>

<style scoped>
  .van-button {
    width: 28%;
  }

  .userPane {
    height: 230px;
    width: 95%;
    margin: 10px auto 50px auto;
    background-color: dodgerblue;
    border-radius: 20px;
    padding: 10px 20px 5px 20px;
    box-sizing: border-box;
    background-image: linear-gradient(#104E8B, #B0E2FF);
    position: relative;
  }

  .userLogin {
    width: 100%;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%);
  }

  .userInfo {
    color: #FFEFDB;
    text-align: left;
  }

  .userInfo h2 {
    margin: 0 0 10px 0;
    padding: 0;
    color: azure;
  }

  .userInfo span {
    display: block;
    width: 100%;
    font-size: 14px;
    color: #F8F8FF;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .userData {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    border-top: 1px solid #999999;
  }

  .userDataItem {
    width: 49%;
    height: 100%;
    display: inline-block;
    position: relative;
  }

  .userDataItem span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    vertical-align: middle;
    color: #696969;
    font-size: 14px;
  }

  .userData-l {
    border-right: 1px solid #999999;
  }

  .noLoginTxt {
    color: #999999;
    font-size: 18px;
    position: absolute;
    left: 50%;
    bottom: 30%;
    transform: translateX(-50%);
  }
</style>
