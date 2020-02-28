<template>
  <div>
    <div class="top cls">
      <div class="top-l">
        <span>移动商城——平台端</span>
      </div>
      <div class="top-r">
        <el-link href="/#/userAccount" :underline="false" type="primary">返回用户端</el-link>
      </div>
    </div>

    <el-row type="flex" justify="space-between">
      <!--左侧导航部分-->
      <el-col :span="6">
        <div class="grid-content bg-purple index-l">
          <el-col>
            <!--navOpens：默认打开的菜单index。router：子菜单的index设置为路由跳转。-->
            <el-menu
              class="el-menu-vertical-demo"
              router
              :default-openeds="navOpens"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#1989fa">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>商品管理</span>
                </template>
                <el-menu-item-group title="大类管理">

                  <el-menu-item index="/categorySetting">
                    <span>添加大类</span>
                  </el-menu-item>
                  <el-menu-item index="/updateCategory">
                    <span>修改大类</span>
                  </el-menu-item>

                </el-menu-item-group>
                <el-menu-item-group title="商品管理">

                  <el-menu-item index="/addGoods">
                    <span>添加商品</span>
                  </el-menu-item>
                  <el-menu-item index="/updateGoods">
                    <span>修改商品</span>
                  </el-menu-item>
                  <el-menu-item index="/delGoods">
                    <span>删除商品</span>
                  </el-menu-item>

                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>订单管理</span>
                </template>

                <el-menu-item index="/allOrders">
                  <span>全部订单</span>
                </el-menu-item>
                <el-menu-item index="/shippedOrders">
                  <span>待发货订单</span>
                  <el-badge :value="shippedNum" v-if="shippedNum > 0"></el-badge>
                </el-menu-item>
                <el-menu-item index="/returnedOrders">
                  <span>待退货订单</span>
                  <el-badge :value="returnedNum" v-if="returnedNum > 0"></el-badge>
                </el-menu-item>

              </el-submenu>
            </el-menu>
          </el-col>
        </div>
      </el-col>

      <!--右侧部分-->
      <el-col>
        <div class="grid-content bg-purple index-r">
          <router-view/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: "index",
    data() {
      return {
        //默认打开的路由
        navOpens: ["1", "2"]
      }
    },
    created() {
      //用来获取待发货待退货订单数量
      this.getOrders();
    },
    computed: {
      ...mapGetters(['shippedNum', 'returnedNum'])
    },
    methods: {
      ...mapActions(['getOrders'])
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-align: left;
  }

  .top {
    height: 50px;
    line-height: 49px;
    padding: 0 20px;
    background: linear-gradient(#ccc, #fff);
  }

  .top-l {
    float: left;
    font-size: 20px;
    font-weight: 500;
  }

  .top-r {
    float: right;
  }

  .index-l {
    height: calc(100vh - 50px);
    overflow: auto;
    background-color: rgb(84, 92, 100);
  }

  .index-r {
    border-top: 1px solid #ccc;
    height: calc(100vh - 51px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .cls:before, .cls:after {
    content: '';
    display: table;
  }

  .cls:after {
    clear: both;
  }

  .cls {
    *zoom: 1
  }

  .el-menu {
    border: none;
  }
</style>
