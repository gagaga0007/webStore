<template>
  <div>
    <van-nav-bar
      title="个性签名"
      left-text="返回"
      left-arrow
      right-text="完成"
      @click-left="goBackFn"
      @click-right="submitFn"
    />

    <van-cell-group>
      <van-field
        v-model="describe"
        rows="2"
        autosize
        label="个性签名"
        type="textarea"
        maxlength="30"
        placeholder="请输入个性签名"
        show-word-limit
        input-align="right"
        clearable
      />
    </van-cell-group>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "updateDescribe",
    data() {
      return {
        describe: ''
      }
    },
    created() {
      this.getUserDescribe(localStorage.username);
    },
    methods: {
      goBackFn() {
        this.$router.go(-1);
      },
      //获取个性签名
      getUserDescribe(username) {
        axios.get(API_LIST.getDescribe, {params: {username: username}})
          .then(_d => {
            this.describe = _d.data;
          })
      },
      //完成提交
      submitFn() {
        axios.get(API_LIST.setDescribe, {params: {username: localStorage.username, describe: this.describe}})
          .then(_d => {
            if (_d.data.reg_code === 13) {
              this.$toast.success(_d.data.regInfo);
            } else {
              this.$toast.fail('修改失败');
            }
          })
      }
    }
  }
</script>

<style scoped>

</style>
