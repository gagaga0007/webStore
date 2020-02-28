<template>
  <div class="wrap">
    <div>修改商品</div>
    <div class="searchBox">

      <!--查找修改商品部分-->
      <div class="inputTxt">
        <el-input v-model="searchName"
                  placeholder="请输入商品名称"
                  clearable
                  maxlength="10"
                  show-word-limit
        ></el-input>
      </div>

      <div class="inputTxt selectBox">
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
        <el-button type="primary" @click="searchBtn">查找</el-button>
      </div>
    </div>

    <!--查找到的商品-->
    <div class="goodsBox" v-if="goodsShow">
      <div>查找到的商品信息：</div>
      <div class="goods">
        <label><img :src=goodsObj.img></label>
        <div>
          <span>商品名称：{{goodsObj.name}}</span>
          <i>商品价格：￥{{goodsObj.price}}</i>
          <b>商品描述：{{goodsObj.describe}}</b>
        </div>
        <div class="goodsBtn">
          <el-button type="primary" @click="updateBtn">修改</el-button>
        </div>
      </div>
    </div>

    <!--修改区-->
    <div class="updateBox" v-if="updateShow">
      <div>修改信息：</div>
      <div class="update">
        <div class="inputTxt">
          <el-input v-model="price"
                    placeholder="请修改商品价格"
                    clearable
          ></el-input>
        </div>
        <div class="inputTxt">
          <el-input v-model="img"
                    placeholder="请修改商品图片"
                    clearable
          ></el-input>
        </div>
        <div class="inputTxt">
          <el-input v-model="describe"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请修改商品描述"
                    clearable
                    maxlength="30"
                    show-word-limit
          ></el-input>
        </div>
        <div class="button">
          <el-button type="primary" @click="submitBtn">提交</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../../APIList.config.js';

  export default {
    name: "updateGoods",
    data() {
      return {
        searchName: '',

        //大类数组，保存大类的信息
        categoryArr: [],
        value: '',

        goodsShow: false,
        updateShow: false,

        //查找的商品信息
        goodsObj: '',

        //商品信息
        id: '',
        price: '',
        img: '',
        describe: '',
        category: ''
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

      //查找商品信息
      searchBtn() {
        this.goodsShow = false;
        this.updateShow = false;
        if (this.searchName === '' || this.value === '') {
          this.$message.error('请填写商品信息');
        } else {
          //查找商品的对象
          var _dataObj = {
            name: this.searchName,
            category: this.value
          };
          //发送请求
          axios.get(API_LIST.getGoods, {params: _dataObj})
            .then(_d => {
              //未查找到商品的情况
              if (_d.data.reg_code === 20) {
                this.$message.warning(_d.data.regInfo);
                this.goodsShow = false;
              } else if (_d.data.reg_code === 21) {
                //查找到的商品保存在变量中
                this.goodsObj = _d.data.result;
                //把显示商品的盒子显示
                this.goodsShow = true;
                //商品修改框赋值
                this.id = this.goodsObj._id;
                this.name = this.goodsObj.name;
                this.price = this.goodsObj.price;
                this.img = this.goodsObj.img;
                this.describe = this.goodsObj.describe;
                this.category = this.goodsObj.category;
              } else {
                this.$message.error('未知的错误');
              }
            })
        }
      },

      //修改按钮
      updateBtn() {
        this.updateShow = true;
      },

      //提交
      submitBtn() {
        if (this.price === '' || this.img === '' || this.describe === '') {
          this.$message.error('商品信息未填写完毕');
        } else {
          let _dataObj = {
            _id: this.id,
            price: this.price,
            img: this.img,
            describe: this.describe,
            category: this.category
          };
          axios.post(API_LIST.updateGoods, _dataObj)
            .then(_d => {
              if (_d.data.reg_code === 22) {
                this.$message.success(_d.data.regInfo);
                this.goodsShow = false;
                this.updateShow = false;
                this.searchName = '';
                this.value = '';
              } else if (_d.data.reg_code === 9) {
                this.$message.warning(_d.data.regInfo);
              } else {
                this.$message.error('修改失败');
              }
            })
        }
      }
    }
  }
</script>

<style scoped>
  * {
    font-style: normal;
    font-weight: normal;
  }

  .wrap {
    width: 85%;
    margin: 20px auto;
    height: 100vh;
  }

  .inputTxt {
    width: 300px;
    margin: 10px 20px 0 0;
  }

  .selectBox {
    width: auto;
  }

  .searchBox {
    display: flex;
  }

  .button {
    margin-top: 10px;
  }

  .goodsBox {
    width: 100%;
    margin-top: 30px;
  }

  .goods {
    border: 1px solid #ccc;
    display: flex;
    padding: 10px;
    border-radius: 10px;
    position: relative;
    margin-top: 10px;
  }

  .goods label {
    display: block;
    width: 120px;
    height: 120px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    margin-right: 20px;
  }

  .goods label img {
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .goods span, .goods i, .goods b {
    display: block;
    margin: 5px;
    font-size: 14px;
  }

  .goodsBtn {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .updateBox {
    margin-top: 30px;
    width: 100%;
  }
</style>
