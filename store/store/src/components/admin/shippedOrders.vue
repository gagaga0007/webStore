<template>
  <div class="wrap">
    <div>待发货订单</div>
    <div class="ordersList">

      <div class="orderItem" v-for="item in shippedOrders">
        <el-card class="box-card">
          <div slot="header" class="clearfix head">
            <span>{{item.date}}</span>
            <span style="color: orangered">总价：￥{{item.price}}</span>
            <label>用户名：{{item.username}}</label>
            <div class="buttonGroup">
              <el-button style="padding: 3px 0" type="text"
                         v-if="item.status==='未发货'" @click="setOrder(item, '进行中')"
              >
                发货
              </el-button>
            </div>
          </div>
          <div v-for="(goods, inx) in item.names" :key="inx" class="item">
            <label><img :src="item.imgs[inx]"></label>
            <i>{{item.names[inx]}}</i>
            <em>× {{item.nums[inx]}}</em>
          </div>
        </el-card>
      </div>

    </div>

    <div v-if="this.shippedOrders.length<=0" class="txt">暂无待发货订单</div>
  </div>
</template>

<script>
  import axios from 'axios';
  import API_LIST from '../../APIList.config.js';
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: "shippedOrders",
    data() {
      return {}
    },
    created() {
      this.getOrders();
    },
    computed: {
      ...mapGetters(['shippedOrders'])
    },
    methods: {
      ...mapActions(['getOrders']),

      //对订单的操作
      setOrder(item, _txt) {
        this.$confirm('确认操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let _obj = {
            username: item.username,
            date: item.date,
            txt: _txt
          };

          axios.post(API_LIST.setOrder, _obj)
            .then(_d => {

              if (_d.data.reg_code === 19) {
                this.$message.success(_d.data.regInfo);
                this.getOrders();
              } else {
                this.$message.error('操作失败');
              }
            });
        }).catch(() => {
        });

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
  }

  .ordersList {
    width: 100%;
    margin-top: 20px;
  }

  .orderItem {
    margin: 10px auto;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .head {
    display: flex;
  }

  .head span, .head label {
    display: block;
  }

  .head span {
    margin-right: 30px;
  }

  .buttonGroup {
    margin-left: auto;
  }

  .item {
    min-width: 32%;
    display: flex;
    border: 1px solid #eee;
    box-sizing: border-box;
    margin: 0 5px 5px 0;
    border-radius: 10px;
    padding: 6px;
    position: relative;
  }

  .item em, .item i, .item b, .item label {
    display: block;
  }

  .item label {
    width: 70px;
    height: 70px;
    position: relative;
    overflow: hidden;
  }

  .item img {
    height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .item i {
    font-weight: 500;
    margin-left: 10px;
  }

  .item em {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .txt {
    width: 100%;
    margin: auto;
    text-align: center;
    color: #999;
  }
</style>
