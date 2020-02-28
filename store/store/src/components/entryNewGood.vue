<template>
  <div class="wrapDiv">
    <input type="text" v-model="name"
           class="goodEntry" placeholder="名称">
    <input type="text" v-model="price"
           class="goodEntry" placeholder="价格">
    <input type="text" v-model="img"
           class="goodEntry" placeholder="图片">
    <input type="text" v-model="describe"
           class="goodEntry" placeholder="描述">

    <br>
    请选择一个大类：
    <van-picker :columns="categoryArr" :default-index="0" @change="onChange"/>


    <van-button plain type="primary" @click="submitBtn">提交商品</van-button>

  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../APIList.config';

  export default {
    name: "entryNewGood",
    data() {
      return {
        //商品的信息
        name: '',
        price: '',
        img: '',
        describe: '',

        //所有大类名字的arr，用于展示在页面
        categoryArr: [''],
        //所有大类的d的数字，用于传递回服务端生成商品的category
        categoryNumArr: [''],

        //选择的大类的d的数字
        categoryInx: '',
        //新商品的对象
        goodObj: {}
      }
    },
    created() {
      this.getCategory();
    },

    methods: {
      //获取所有大类的名字，添加到categoryArr中
      getCategory() {
        axios.get(API_LIST.getAllCategoryName)
          .then(_d => {
            for (let i = 0; i < _d.data.length; i++) {
              this.categoryArr.push(_d.data[i].n);
            }
          });
      },
      //选择器改变时，给categoryInx赋值
      onChange(picker, value, inx) {
        this.categoryInx = inx;
      },
      //提交
      submitBtn() {
        if (this.name === '' || this.price === '' || this.img === '' || this.categoryInx === 0 || this.categoryInx === '' || this.describe === '') {
          this.$dialog.alert({message: '商品未填写完毕'});
        } else {
          this.goodObj = {
            name: this.name,
            price: this.price,
            img: this.img,
            describe: this.describe,
            inx: this.categoryInx
          };
          axios.post(API_LIST.insertGoodsToCategory, this.goodObj)
            .then(_d => {
              if (_d.data.reg_code === 9) {
                this.$dialog.alert({
                  message: _d.data.regInfo
                })
              } else if (_d.data.reg_code === 10) {
                this.$dialog.alert({
                  message: _d.data.regInfo
                })
              }
            })
        }
      }
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .wrapDiv {
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
    margin: 10px;
    border-radius: 10px;
    border: 1px solid #999;
    text-align: center;
    font-size: 16px;
  }
</style>
