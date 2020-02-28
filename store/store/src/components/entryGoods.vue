<template>
  <div class="wrapDiv">
    <input type="text" v-model="name" @blur="nameBlurFn"
           class="goodEntry" placeholder="名称">
    <input type="text" v-model="price" @blur="priceBlurFn"
           class="goodEntry" placeholder="价格">
    <input type="text" v-model="describe" @blur="describeBlurFn"
           class="goodEntry" placeholder="描述">
    <input type="text" v-model="img" @blur="imgBlurFn"
           class="goodEntry" placeholder="图片">
  </div>
</template>

<script>
  export default {
    name: "entryGoods",
    data() {
      return {
        msg: '商品输入框',

        //输入框输入的商品信息
        name: '',
        price: '',
        describe: '',
        img: '',

        //新增商品的对象
        itemGoodsObj: {
          n: '',
          p: '',
          d: '',
          i: ''
        }
      }
    },
    methods: {
      nameBlurFn() {
        this.itemGoodsObj.n = this.name;
        this.isInputCheckFn();
      },
      priceBlurFn() {
        this.itemGoodsObj.p = this.price;
        this.isInputCheckFn();
      },
      describeBlurFn() {
        this.itemGoodsObj.d = this.describe;
        this.isInputCheckFn();
      },
      imgBlurFn() {
        this.itemGoodsObj.i = this.img;
        this.isInputCheckFn();
      },
      //检查四个输入框是否已经填完
      isInputCheckFn() {
        let _is = true;
        //遍历这个对象里面的每一属性
        for (let i in this.itemGoodsObj) {
          //如果有某一属性未填
          if (!this.itemGoodsObj[i]) {
            _is = false;
            break;
          }
        }
        //如果全填完了（_is为true）传给父组件
        if (_is) {
          this.$emit('pushGoodsInfo', this.itemGoodsObj);
        } else {
          //如果未填完
          this.$emit('isVoidFalse');
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
