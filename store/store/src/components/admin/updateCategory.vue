<template>
  <div class="main">
    <div>修改大类</div>
    <div style="display: flex;">
      <div class="inputTxt">
        <el-input v-model="categoryName"
                  placeholder="请填写大类名称"
                  clearable
        ></el-input>
      </div>
      <div class="button">
        <el-button type="primary" @click="searchBtn">查找</el-button>
      </div>
    </div>

    <div class="update" v-if="updateShow">
      <div>修改大类信息：</div>
      <div class="inputTxt">
        <el-input v-model="updateName"
                  placeholder="请填写大类名称"
                  clearable
        ></el-input>
      </div>
      <div class="inputTxt">
        <el-input v-model="updateImg"
                  placeholder="请填写大类图片"
                  clearable
        ></el-input>
      </div>
      <div class="button">
        <el-button type="primary" @click="submitBtn">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../../APIList.config.js';

  export default {
    name: "updateCategory",
    data() {
      return {
        categoryName: '',
        categoryId: '',

        updateName: '',
        updateImg: '',

        updateShow: false,

        categoryArr: []
      }
    },
    created() {
      this.getCategory();
    },
    methods: {
      getCategory() {
        axios.get(API_LIST.getAllCategoryName)
          .then(_d => {
            //添加到大类数组中
            for (let i = 0; i < _d.data.length; i++) {
              this.categoryArr.push(_d.data[i]);
            }
          });
      },

      //search
      searchBtn() {
        this.updateShow = false;
        //先设置一个标识，判断是否有这个大类
        let _is = false;
        this.categoryArr.map(_d => {
          if (_d.n === this.categoryName) {
            //如果有，标识置为true
            _is = true;
            //将修改的变量赋值
            this.updateName = _d.n;
            this.updateImg = _d.i;
            this.categoryId = _d._id;
            this.updateShow = true;
          }
        });
        //如果标识为false，即没有这个大类
        if (!_is) {
          this.$message.error('未找到大类');
        }
      },

      //submit
      submitBtn() {
        let _obj = {
          id: this.categoryId,
          categoryName: this.categoryName,
          updateName: this.updateName,
          updateImg: this.updateImg
        };

        axios.post(API_LIST.updateCategory, _obj)
          .then(_d => {
            if (_d.data.reg_code === 26 || _d.data.reg_code === 24) {
              //修改成功，提示
              this.$message.success(_d.data.regInfo);
              //并将所有变量重置
              this.categoryId = '';
              this.categoryName = '';
              this.updateName = '';
              this.updateImg = '';
              this.updateShow = false;
              this.categoryArr = [];
              //调用函数，刷新大类相关信息
              this.getCategory();
            } else if (_d.data.reg_code === 25) {
              //名称重复的情况，提示
              this.$message.warning(_d.data.regInfo);
            } else {
              this.$message.error('未知的错误');
            }
          })
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

  .update {
    margin-top: 30px;
  }
</style>
