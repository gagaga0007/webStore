<template>
  <div class="wrap">

    <div class="input">
      <div>添加商品</div>
      <div class="inputTxt">
        <el-input v-model="name"
                  placeholder="请输入商品名称"
                  clearable
                  maxlength="10"
                  show-word-limit
        ></el-input>
      </div>
      <div class="inputTxt">
        <el-input v-model="price"
                  placeholder="请输入商品价格"
                  clearable
        ></el-input>
      </div>
      <div class="inputTxt">
        <el-input v-model="img"
                  placeholder="请输入商品图片"
                  clearable
        ></el-input>
      </div>
      <div class="inputTxt">
        <el-input v-model="describe"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入商品描述"
                  clearable
                  maxlength="30"
                  show-word-limit
        ></el-input>
      </div>
      <div class="inputTxt">
        <el-select v-model="value" placeholder="请选择所属大类">
          <el-option
            v-for="item in categoryArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
    name: "addGoods",
    data() {
      return {
        name: '',
        price: '',
        img: '',
        describe: '',

        //大类数组，保存大类的信息
        categoryArr: [],
        value: ''
      }
    },
    created() {
      //获取所有大类信息，添加到选择框中
      this.getCategory();
    },
    methods: {
      //获取商品大类信息
      getCategory() {
        axios.get(API_LIST.getAllCategoryName)
          .then(_d => {
            //添加到大类数组中
            for (let i = 0; i < _d.data.length; i++) {
              this.categoryArr.push({
                value: _d.data[i].d,
                label: _d.data[i].n
              });
            }
          });
      },
      submitBtn() {
        if (this.name === '' || this.price === '' || this.img === '' || this.describe === '' || this.value === '') {
          this.$message.error('商品信息未输入完毕');
        } else {
          let _goodsObj = {
            name: this.name,
            price: this.price,
            img: this.img,
            describe: this.describe,
            category: this.value
          };
          axios.post(API_LIST.insertGoodsToCategory, _goodsObj)
            .then(_d => {
              if (_d.data.reg_code === 9) {
                this.$message.warning(_d.data.regInfo);
              } else if (_d.data.reg_code === 10) {
                this.$message.success(_d.data.regInfo);
                //reset
                this.name = '';
                this.price = '';
                this.img = '';
                this.describe = '';
                this.value = '';
              } else {
                this.$message.error('未知的错误');
              }
            })
        }
      }
    }
  }
</script>

<style scoped>
  .wrap {
    width: 85%;
    margin: 20px auto;
    height: 100vh;
  }

  .inputTxt {
    width: 300px;
    margin: 10px 20px 0 0;
  }

  .button {
    margin-top: 10px;
  }
</style>
