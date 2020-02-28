<template>
  <div class="main">
    <van-nav-bar title="收货信息"
                 left-text="返回"
                 left-arrow
                 @click-left="goBack"
    />

    <div class="userInfo">
      <span>当前收货信息</span>
      <div class="userInfo-t">
        <span>{{realName}}</span>
        <label>{{phone}}</label>
      </div>
      <div class="userInfo-b">
        <span>{{address}}</span>
      </div>
    </div>

    <div class="setInfo">
      <span>修改收货信息</span>
      <van-address-edit
        :area-list="areaList"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
      />
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';
  import areaList from '../js/area';

  export default {
    name: "userInfo",
    data() {
      return {
        userName: '',
        realName: '',
        phone: '',
        address: '',
        areaList: areaList

      }
    },
    created() {
      //获取用户名
      this.userName = localStorage.username;

      //获取用户收货信息
      this.getUserInfo();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      //获取用户收货信息
      getUserInfo() {
        axios.post(API_LIST.getUserInfo, this.userName)
          .then(_d => {
            this.realName = _d.data.realName;
            this.phone = _d.data.phone;
            this.address = _d.data.address;
          })
      },
      //保存
      onSave(content) {
        //地址
        let address = content.province + content.city + content.county + content.addressDetail;

        //收货信息
        var _infoObj = {
          userName: localStorage.username,
          realname: content.name,
          phone: content.tel,
          address: address
        };

        axios.post(API_LIST.setUserInfo, _infoObj)
          .then(_d => {
            if (_d.data.reg_code === 17) {
              this.$toast.success(_d.data.regInfo);
              this.getUserInfo();
            } else {
              this.$toast.fail('保存失败');
            }
          })

      }
    }
  }
</script>

<style scoped>
  .userInfo {
    text-align: left;
    box-sizing: border-box;
    width: 95%;
    background-color: #eee;
    margin: 10px auto;
    padding: 10px;
    border-radius: 10px;
  }

  .userInfo > span {
    color: #999999;
    font-size: 14px;
    display: block;
    margin-bottom: 5px;
  }

  .userInfo-t span {
    display: inline-block;
    margin-right: 10px;
  }

  .userInfo-t {
    font-size: 18px;
    font-weight: 500;
  }

  .userInfo-b {
    font-size: 16px;
  }

  .setInfo {
    margin-top: 30px;
    width: 100%;
  }

  .setInfo span {
    display: block;
    color: #999999;
    font-size: 14px;
    width: 96%;
    text-align: left;
    margin-left: 4%;
  }

  .van-address-edit {
    padding: 0;
  }
</style>
