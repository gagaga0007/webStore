<template>
  <div class="main">
    <div>添加大类</div>
    <div class="inputTxt">
      <el-input v-model="insertCategoryName"
                placeholder="请输入大类名称"
                clearable
                maxlength="10"
                show-word-limit
      ></el-input>
    </div>
    <div class="inputTxt">
      <el-input v-model="insertCategoryImg"
                placeholder="请添加大类图片"
                clearable
      ></el-input>
    </div>
    <div class="button">
      <el-button type="primary" @click="submitBtn">提交</el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../../APIList.config.js';

  export default {
    name: "addCategory",
    data() {
      return {
        msg: 'categorySetting',
        insertCategoryName: '',
        insertCategoryImg: ''
      }
    },
    methods: {
      submitBtn() {
        if (this.insertCategoryName === '' || this.insertCategoryImg === '') {
          this.$message.error('大类信息未输入完毕');
        } else {
          axios.get(API_LIST.insertCategory,
            {params: {name: this.insertCategoryName, img: this.insertCategoryImg}})
            .then(_d => {
              //success
              if (_d.data.reg_code === 8) {
                this.$message({
                  message: _d.data.regInfo,
                  type: 'success'
                });
                this.insertCategoryImg = '';
                this.insertCategoryName = '';
              } else if (_d.data.reg_code === 7) {
                //有相同大类
                this.$message({
                  message: _d.data.regInfo,
                  type: 'warning'
                });
                this.insertCategoryImg = '';
                this.insertCategoryName = '';
              } else {
                //其他错误
                this.$message.warning('未知的错误');
              }
            })
        }
      }
    }
  }
</script>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 85%;
    margin: 20px auto;
  }

  .inputTxt {
    width: 300px;
    margin: 10px 20px 0 0;
  }

  .button {
    margin-top: 10px;
  }

</style>
