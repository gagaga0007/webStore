const port = 5678;
const BASEURL = 'http://localhost:' + port;

const API_LIST = {
  //测试接口
  test: BASEURL + '/test',
  test2: BASEURL + '/test2',
  //提交注册信息
  register_post: BASEURL + '/register_post',
  //提交登录信息
  login_post: BASEURL + '/login_post',
  //提交新增商品
  insert_goods: BASEURL + '/insert_goods',
  //新增大类
  insertCategory: BASEURL + '/insertCategory',
  //获取所有的大类信息
  getAllCategoryName: BASEURL + '/getAllCategoryName',
  //向某一大类中添加商品
  insertGoodsToCategory: BASEURL + '/insertGoodsToCategory',
  //获得商品大类的个数
  getGoodsCategoryCount: BASEURL + '/getGoodsCategoryCount',
  //根据Id获取商品的详情
  getGoodsInfo: BASEURL + '/getGoodsInfo',
  //购物车提交
  submitCart: BASEURL + '/submitCart',
  //获取个性签名
  getDescribe: BASEURL + '/getDescribe',
  //设置个性签名
  setDescribe: BASEURL + '/setDescribe',
  //查询旧密码是否一致
  getOldPassword: BASEURL + '/getOldPassword',
  //提交新密码
  setNewPassword: BASEURL + '/setNewPassword',
  //查询用户的收货信息
  getUserInfo: BASEURL + '/getUserInfo',
  //更新用户收货信息
  setUserInfo: BASEURL + '/setUserInfo',
  //获取用户的订单
  getOrders: BASEURL + '/getOrders',
  //删除用户某个订单
  delOrder: BASEURL + '/delOrder',
  //对订单的操作（退货、确认收货、取消退货）
  setOrder: BASEURL + '/setOrder',
  //获取大类所对应的商品
  getGoodsItems: BASEURL + '/getGoodsItems',
  //搜索功能
  search: BASEURL + '/search',
  //后台查找操作的商品
  getGoods: BASEURL + '/getGoods',
  //修改商品信息
  updateGoods: BASEURL + '/updateGoods',
  //删除商品
  delGoods: BASEURL + '/delGoods',
  //获取全部订单-平台端
  adminGetOrders: BASEURL + '/adminGetOrders',
  //修改大类
  updateCategory: BASEURL + '/updateCategory'
};

module.exports = API_LIST;
