var express = require('express');
var app = express();
//引入MongoDB，获得客户端对象
var MongoClient = require('mongodb').MongoClient;
//MongoDB连接字符串
var DB_CONN_STR = 'mongodb://localhost:27017/';

//解决跨域代码
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Max-Age", "3600");
    next();
});

//用来查询一共有多少个大类的函数
// function getGoodsCategoryCount() {
//
//     var _num;
//
//     MongoClient.connect(DB_CONN_STR, function (err, db) {
//         // 数据库名：store
//         var _dbo = db.db('store');
//         // 商品栏目集合名：goodsCategory
//         var _collection = _dbo.collection('goodsCategory');
//
//         _collection.find().toArray(function (err, result) {
//             if (err) throw err;
//
//             _num = result.length;
//             console.log(_num);      //正常执行
//
//             //关闭连接
//             db.close();
//         })
//     })
//
//     return _num;    //undefined
// }
//
// console.log(getGoodsCategoryCount());

//NodeJS测试接口
app.get('/test', function (req, res) {
    let _result = filter(req.query.a);
    _flfterResult = _result.length !== 0 ? _result : [{id: 'xxx', name: 'no result'}];
    res.end();
});

app.get('/test2', function (req, res) {
    res.send(_flfterResult);
})


//注册提交
app.post('/register_post', function (req, res) {
    let _allData = '';
    req.on('data', function (_d) {
        _allData += _d;
    });
    req.on('end', function () {
        //_allData是字符串，要改为对象存入数据库
        let _registerMsg = JSON.parse(_allData);
        //查询是否有重名
        findSameNameFn(_registerMsg, res);
    })
})

//注册时查找同名fn，看用户名是否重名
function findSameNameFn(_registerMsg, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名：userInfo
        var _collection = _dbo.collection('userInfo');

        //查找数据库，如果无重名调用插入新用户数据函数
        _collection.findOne({'username': _registerMsg.username}, {}, function (err, result) {
            if (err) throw err;
            if (result === null) {
                insertNewUserFn(_registerMsg, res);
            } else if (result.username === _registerMsg.username) {
                //重名的话返回给页面的信息
                res.send({
                    regInfo: '用户名已存在',
                    reg_code: 2
                })
            }
            //关闭连接
            db.close();
        })
    })
}

//注册时插入新用户数据fn
function insertNewUserFn(_registerMsg, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名：userInfo
        var _collection = _dbo.collection('userInfo');

        _collection.insertOne(_registerMsg, function (err, result) {
            if (err) throw err;
            //返回给页面的
            res.send({
                regInfo: '注册成功',
                reg_code: 1
            })
            //关闭连接
            db.close();
        })
    })
}


//登录
app.post('/login_post', function (req, res) {
    var _loginData = '';
    req.on('data', function (_d) {
        _loginData += _d;
    })
    req.on('end', function () {
        let _temp = JSON.parse(_loginData);

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名：userInfo
            var _collection = _dbo.collection('userInfo');

            _collection.findOne({'username': _temp.username}, {}, function (err, result) {
                if (err) throw err;

                if (result === null) {
                    return res.send({
                        regInfo: '用户不存在',
                        reg_code: 5
                    })
                } else if (result.password !== _temp.password) {
                    return res.send({
                        regInfo: '密码错误',
                        reg_code: 4
                    })
                } else if (result !== null && result.password === _temp.password) {
                    return res.send({
                        regInfo: result,
                        reg_code: 3
                    })
                }
                //关闭连接
                db.close();
            })
        })
    })
})


//批量新增商品大类（前台暂被注释，未用）
app.post('/insert_goods', function (req, res) {
    var _dataObj = '';
    req.on('data', function (_d) {
        _dataObj += _d;
    })
    req.on('end', function () {
        let _insertGoodsArrsObj = JSON.parse(_dataObj);

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 商品栏目集合名：goodsCategory
            var _collection = _dbo.collection('goodsCategory');

            _collection.insertMany(_insertGoodsArrsObj, function (err, result) {
                if (err) throw err;
                //返回给页面的
                res.send({
                    regInfo: '商品录入成功',
                    reg_code: 5
                })
                //关闭连接
                db.close();
            })
        })
    })
})


/*
新增大类部分
 */
//提交，查询插入大类是否重复
app.get('/insertCategory', function (req, res) {
    //新大类的信息
    var _dataObj = {
        _name: req.query.name,
        _i: req.query.img
    }
    //调用查询所有大类的函数
    getAllCategoryFn(res, 3, _dataObj);
})

//查询大类是否重复
function insertCategoryFn(result, res, _dataObj) {
    //获取大类的数量（即数组长度）
    var _count = result.length;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名：goodsCategory
        var _collection = _dbo.collection('goodsCategory');

        _collection.findOne({'n': _dataObj._name}, {}, function (err, result) {
            if (err) throw err;
            if (result === null) {
                // 如果无重名调用插入新用户数据函数
                insertCategory(_dataObj, _count, res);
            } else if (result.n === _dataObj._name) {
                //重名的话返回给页面的信息
                res.send({
                    regInfo: '大类已存在',
                    reg_code: 7
                })
            }
            //关闭连接
            db.close();
        })
    })
}

//新增大类不重复，新增大类函数
function insertCategory(_dataObj, _count, res) {
    var _d = 'goodsList_' + (Number(_count) + 1);

    //新大类对象。设置大类名以及自动生成描述(d)，并新增一个集合
    var _newObj = {
        n: _dataObj._name,
        d: _d,
        i: _dataObj._i
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名：goodsCategory
        var _collection = _dbo.collection('goodsCategory');

        //向goodsCategory中新增大类
        _collection.insertOne(_newObj, function (err, result) {
            if (err) throw err;
            //返回给页面的
            res.send({
                regInfo: '添加大类成功',
                reg_code: 8
            })
        })
        //不必新增数据库集合，向不存在的集合中新增数据，会自动生成这个集合

        //关闭连接
        db.close();
    })
}

/*
修改大类
 */
app.post('/updateCategory', function (req, res) {
    var _data = '';
    req.on('data', function (_d) {
        _data += _d;
    });
    req.on('end', function () {
        var _dataObj = JSON.parse(_data);

        if (_dataObj.categoryName === _dataObj.updateName) {
            //如果新旧大类名相等，就是只更新图片
            updateCategoryImg(_dataObj, res);
        } else if (_dataObj.categoryName !== _dataObj.updateName) {
            //如果新旧大类名不同，则是更新名字和图片
            updateCategoryAll(_dataObj, res);
        }
    })
})

//名称和以前不一样的更新
function updateCategoryAll(_obj, res) {
    var _id = _obj.id;
    var _name = _obj.updateName;
    var _img = _obj.updateImg;

    var ObjectID = require('mongodb').ObjectID;
    var _updateId = ObjectID.createFromHexString(_id);

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名：goodsCategory
        var _collection = _dbo.collection('goodsCategory');

        _collection.findOne({'n': _name}, {}, function (err, result) {
            if (err) throw err;

            if (result === null) {
                // 如果无重名则修改大类
                _collection.updateOne({"_id": _updateId},
                    {$set: {"n": _name, "i": _img}},
                    function (err, result) {
                        if (err) throw err;
                        if (result) {
                            res.send({
                                reg_code: 26,
                                regInfo: '修改成功'
                            })
                        }
                    })

            } else if (result.n === _name) {
                //重名的话返回给页面的信息
                res.send({
                    regInfo: '大类名称重复',
                    reg_code: 25
                })
            }
            //关闭连接
            db.close();
        })
    })
}

//名称和以前一样的更新
function updateCategoryImg(_obj, res) {
    var _id = _obj.id;
    var _img = _obj.updateImg;

    var ObjectID = require('mongodb').ObjectID;
    var _updateId = ObjectID.createFromHexString(_id);

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection("goodsCategory");

        _collection.updateOne({"_id": _updateId},
            {$set: {"i": _img}},
            function (err, result) {
                if (err) throw err;
                if (result) {
                    res.send({
                        reg_code: 24,
                        regInfo: '修改成功'
                    })
                }
                //关闭连接
                db.close();
            })
    })
}


/*
商品操作部分
 */
//新增商品
//获取所有的大类的信息，返回给前台的选择插入大类的框(分类页导航栏也用到此接口)
app.get('/getAllCategoryName', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名 goodsCategory
        var _collection = _dbo.collection('goodsCategory');

        _collection.find().toArray(function (err, result) {
            if (err) throw err;
            //返回给页面的
            res.send(result);
            //关闭连接
            db.close();
        })
    })
})

//新增商品
app.post('/insertGoodsToCategory', function (req, res) {
    var _dataObj = '';
    req.on('data', function (_d) {
        _dataObj += _d;
    })
    req.on('end', function () {
        // 将字符串转换为对象
        var _insertObj = JSON.parse(_dataObj);

        //新商品的对象
        var _newObj = {
            name: _insertObj.name,
            price: _insertObj.price,
            category: _insertObj.category,
            img: _insertObj.img,
            describe: _insertObj.describe,
            saled: 0
        };

        //查看是否重复
        doubleGoods(_newObj, 1, res);
    })
})

//查看商品是否重复的函数(新增、修改)
//obj：商品对象，inx：接口标识，res：响应
function doubleGoods(obj, inx, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection(String(obj.category));

        _collection.findOne({"name": obj.name}, {}, function (err, result) {
            if (err) throw err;
            if (result === null) {
                //添加商品的
                if (inx === 1) {
                    //无结果，则调用新增到大类中的函数，参数：新商品对象，所属大类名，res
                    insertGoodToCategory(obj, obj.category, res);
                } else if (inx === 2) {
                    updateGoods(obj, res);
                }
            } else {
                //有结果则是存在该商品，返回给页面
                res.send({
                    regInfo: '商品已存在',
                    reg_code: 9
                })
            }
            //关闭连接
            db.close();
        })
    })
}

//新增商品到大类的函数
function insertGoodToCategory(_newObj, category, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection(category);

        //向对应大类的集合中新增商品
        _collection.insertOne(_newObj, function (err, result) {
            if (err) throw err;
            //返回给页面的
            res.send({
                regInfo: '添加商品成功',
                reg_code: 10
            })
        })

        //关闭连接
        db.close();
    })
}

//后台查找商品的接口
app.get('/getGoods', function (req, res) {
    //根据指定大类查找指定商品
    var _data = req.query;
    var _name = _data.name;
    var _c = _data.category;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // collecion
        var _collection = _dbo.collection(_c);

        _collection.findOne({"name": _name}, function (err, result) {
            if (err) throw err;

            //未查找到
            if (result === null) {
                res.send({
                    reg_code: 20,
                    regInfo: '未查找到指定商品'
                })
            } else {
                //查找到了，返回
                res.send({
                    reg_code: 21,
                    result: result
                });
            }

            db.close();
        })
    })
})

//修改商品的接口
app.post('/updateGoods', function (req, res) {
    var _data = '';
    req.on('data', function (_d) {
        _data += _d;
    });
    req.on('end', function () {
        //前台的对象
        var _dataObj = JSON.parse(_data);

        //看名字是否重复
        doubleGoods(_dataObj, 2, res);
    })
})

//修改商品的函数
function updateGoods(_dataObj, res) {
    //商品信息
    var _id = _dataObj._id;
    var _price = _dataObj.price;
    var _img = _dataObj.img;
    var _describe = _dataObj.describe;
    var _c = _dataObj.category

    // 引入 mongoDB的id对象
    var ObjectID = require('mongodb').ObjectID;
    var _updateId = ObjectID.createFromHexString(_id);

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection(_c);

        _collection.updateOne({"_id": _updateId},
            {$set: {"price": _price, "img": _img, "describe": _describe}},
            function (err, result) {
                if (err) throw err;
                if (result) {
                    res.send({
                        reg_code: 22,
                        regInfo: '修改成功'
                    })
                }
                //关闭连接
                db.close();
            })
    })
}

//删除商品
app.get('/delGoods', function (req, res) {
    var _id = req.query._id;
    var _c = req.query.category;

    // 引入 mongoDB的id对象
    var ObjectID = require('mongodb').ObjectID;
    var _delId = ObjectID.createFromHexString(_id);

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection(_c);

        _collection.deleteOne({"_id": _delId}, function (err, result) {
            if (err) throw err;
            if (result) {
                res.send({
                    reg_code: 23,
                    regInfo: '删除成功'
                })
            }
            db.close();
        })

    })
})


/*
所有商品大类以及大类所对应的商品
 */
app.get('/getGoodsCategoryCount', function (req, res) {
    //调用获取商品大类个数的函数
    getAllCategoryFn(res, 1);
})

//获取商品大类的工具函数
function getAllCategoryFn(res, inx, data) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection('goodsCategory');

        //连表查询的方法
        _collection.find().toArray(function (err, result) {
            if (err) throw err;

            if (inx === 1) {
                //调用获取所有大类和商品数据的函数
                getGoodsCategory(result, res);
            } else if (inx === 2) {
                //调用搜索功能的函数
                searchFn(result, res, data);
            } else if (inx === 3) {
                //调用新增大类的函数
                insertCategoryFn(result, res, data);
            }

            db.close();
        })
    })
}

//返回给首页的所有大类和商品的数据
function getGoodsCategory(result, res) {
    var _goods = result
    var _count = result.length;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection('goodsCategory');

        //对所有大类动态的进行连表查询
        /*
        首先获取所有有关集合的数量，因为数据库名后半部分为数字，故通过一个for循环，对所有有关集合进行连表查询，返回结果
        数据库中的集合名为goodsList_1、goodsList_2…………
        查询之后的结果名设置为goodsList_100、goodsList_200…………
         */
        let _str = 'goodsList_';    //设置一个字符串，用来保存集合名的前半部分
        let _arr = [];      //数组用来保存所有的连表查询
        for (let i = 0; i < _count; i++) {
            //通过一个for循环，对当前数据库集合(当前集合为大类，名称为goodsCategory，即变量_collection)以及符合条件的其它集合进行连表查询
            _arr.push({
                $lookup: {
                    localField: 'd',        //goodsCategory集合(大类集合)的d
                    from: _str + (i + 1),   //从这一集合查询
                    foreignField: 'category',   //查询这一集合的这一项
                    as: _str + (i + 1) * 100    //查询的结果名保存为这个
                }
            })
        }
        //连表查询的方法
        _collection.aggregate(_arr).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        })

    })

}


/*
  搜索功能
*/
app.get('/search', function (req, res) {
    //获取搜索的值
    var _data = req.query.data;
    getAllCategoryFn(res, 2, _data);
})

//过滤搜索的值，看返回大类的所有商品还是指定商品
function searchFn(result, res, data) {
    //标识，如果搜索值是大类名，会被置为false
    var _is = true;
    //遍历result里的每一项(里面是大类数组)
    result.map(_d => {
        if (_d.n === data) {
            // 如果搜索值等于大类名，则是查询大类的所有商品，
            // 第一个参数是大类数组,第二个参数是搜索的字符串，第四个参数为大类描述(d)
            searchGoodsFn(result, data, res, _d.d);
            _is = false;
            return;
        }
    })
    //_is为true，则是查询某一指定商品，第四个参数置为空
    if (_is) {
        searchGoodsFn(result, data, res, '');
    }
}

//具体商品，返回给前台
//resultData：大类信息数组，data：搜索的字符串，res：响应，_d：大类描述
function searchGoodsFn(resultData, data, res, _d) {
    //返回的是某一指定商品
    if (_d === '') {
        // 保存大类的描述(d)，即对应的商品表
        var _categoryArr = [];
        resultData.map((_item, inx) => {
            _categoryArr.push(_item.d);
        });

        //保存的搜索的商品的信息
        var _goodsArr = [];

        _categoryArr.map((_item, inx) => {

                MongoClient.connect(DB_CONN_STR, function (err, db) {
                    // 数据库名：store
                    var _dbo = db.db('store');
                    // 集合名
                    var _collection = _dbo.collection(String(_item));

                    _collection.findOne({"name": data}, function (err, result) {
                        if (err) throw err;

                        //如果有对应商品，添加到搜索结果的数组
                        if (result !== null) {
                            _goodsArr.push(result);
                        }
                        //最后一次循环，返回给前台搜索结果的数组
                        if (inx === _categoryArr.length - 1) {
                            res.send(_goodsArr);
                        }

                        db.close();
                    })

                })

            }
        )

    } else {
        //返回的是指定大类的商品
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection(String(_d));

            _collection.find().toArray(function (err, result) {
                if (err) throw err;
                //返回大类对应的商品
                res.send(result);
                db.close();
            })

        })
    }
}


/*
分类页，点击大类返回所对应的大类商品
 */
app.get('/getGoodsItems', function (req, res) {
    var _category = req.query.d;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection(String(_category));

        _collection.find().toArray(function (err, result) {
            if (err) throw err;
            //返回大类对应的商品
            res.send(result);
            db.close();
        })

    })
})


/*
点击某一商品，获取商品详情
 */
//根据商品id获取商品详情
app.get('/getGoodsInfo', function (req, res) {
    // 传进来的是商品的id和所属的集合
    var _findId = req.query._id;
    var _c = req.query._c;

    // 引入 mongoDB的id对象
    var ObjectID = require('mongodb').ObjectID;
    var _findObjId = ObjectID.createFromHexString(_findId);

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection(_c);

        _collection.findOne({"_id": _findObjId}, {}, function (err, result) {
            if (err) throw err;
            //返回给页面的
            res.send(result)
            //关闭连接
            db.close();
        })
    })
})


/*
购物车提交之后的
 */
//获取用户的收货信息
app.post('/getUserInfo', function (req, res) {
    var _userName = '';
    req.on('data', function (_d) {
        _userName += _d;
    });
    req.on('end', function () {

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userInfo");

            _collection.findOne({"username": _userName}, {}, function (err, result) {
                if (err) throw err;

                // 返回收货信息
                let _sendObj = {
                    realName: result.realname,
                    phone: result.phone,
                    address: result.address
                }

                res.send(_sendObj);

                //关闭连接
                db.close();
            })
        })

    })
})

//先获取用户名对应的真实姓名、电话号码、地址
app.post('/submitCart', function (req, res) {
    var _dataObj = '';
    req.on('data', function (_d) {
        _dataObj += _d;
    });
    req.on('end', function () {
        //转化为对象
        var _userName = JSON.parse(_dataObj).userName;  //用户名
        var _cartObj = JSON.parse(_dataObj)._orderObj;  //购物车（订单）信息

        //调用 添加订单的函数
        insertOrder(_userName, _cartObj, res);
    })
})

//然后向用户集合和订单集合中添加这个订单
function insertOrder(_userName, _cartObj, res) {
    //订单的状态，0——进行中
    _cartObj.status = "未发货";

    // 先向该用户的数据中增加这个订单
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名 userInfo
        var _collection = _dbo.collection('userInfo');

        _collection.updateOne({"username": _userName}, {$push: {orders: _cartObj}}, function (err, result) {
            if (err) throw err;

        })
        db.close();
    })

    //向订单对象中插入该用户的用户名
    _cartObj.username = _userName;

    //再向订单集合中添加数据
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名 userInfo
        var _collection = _dbo.collection('userOrders');

        _collection.insertOne(_cartObj, function (err, result) {
            if (err) throw err;
            if (result) {
                // 调用购物车商品销量+1的函数
                goodsSaledUpdate(_cartObj);
                res.send({
                    regInfo: '订单已提交',
                    reg_code: 11
                })
            }
        })
        db.close();
    })
}

//最后更新购物车数组里所对应的商品的销量
function goodsSaledUpdate(_cartObj) {
    //初始化几个数组
    var _names = _cartObj.names;
    var _nums = _cartObj.nums;
    var _collections = _cartObj.collections;

    //保存查询的销量用的数组
    var _saled = [];

    //设置一个索引,下方代码使用函数调用用来代替for循环，因为for循环当次循环未完毕就继续循环了
    var _inx = 0;
    //调用下面的函数
    fn();

    function fn() {
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名 当前的collection，并通过String()改为string格式
            var _collection = _dbo.collection(String(_collections[_inx]));

            //先获取每个商品的信息，取结果的saled（销量）
            _collection.findOne({"name": _names[_inx]}, {}, function (err, result) {
                if (err) throw err;

                // 将获取的销量 + _nums对应的数量，添加到_saled中
                if (result) {
                    _saledNum = result.saled + _nums[_inx];
                    _saled.push(_saledNum);
                    // 再更新对应商品的销量
                    _collection.updateOne({"name": _names[_inx]}, {$set: {"saled": _saled[_inx]}}, function (err, result) {
                        if (err) throw err;
                        if (result) {
                            if (_inx < _collections.length) {
                                db.close();
                                _inx++;
                                fn();
                            } else {
                                db.close();
                            }
                        }
                    })
                }
            })
        })
    }
}

/*
个人中心部分
 */
//获取用户的个性签名
app.get('/getDescribe', function (req, res) {
    var _userName = req.query.username;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection("userInfo");

        _collection.findOne({"username": _userName}, {}, function (err, result) {
            if (err) throw err;

            res.send(result.describe);

            //关闭连接
            db.close();
        })
    })
})

//修改个性签名
app.get('/setDescribe', function (req, res) {
    var _userName = req.query.username;
    var _describe = req.query.describe;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection("userInfo");

        _collection.updateOne({"username": _userName}, {$set: {"describe": _describe}}, function (err, result) {
            if (err) throw err;

            res.send({
                regInfo: '修改成功！',
                reg_code: 13
            });

            //关闭连接
            db.close();
        })
    })

})

//查询旧密码是否相等
app.post('/getOldPassword', function (req, res) {
    var _dataObj = '';
    req.on('data', function (_d) {
        _dataObj += _d;
    });
    req.on('end', function () {
        var _userName = JSON.parse(_dataObj).username;
        var _pwd = JSON.parse(_dataObj).password;

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userInfo");

            _collection.findOne({"username": _userName}, {}, function (err, result) {
                if (err) throw err;

                if (result.password !== _pwd) {
                    res.send({
                        regInfo: '密码错误',
                        reg_code: 14
                    })
                } else if (result.password === _pwd) {
                    res.send({
                        reg_code: 15
                    })
                }
                //关闭连接
                db.close();
            })
        })
    })

})

//提交新密码
app.post('/setNewPassword', function (req, res) {
    var _data = '';
    req.on('data', function (_d) {
        _data += _d;
    });
    req.on('end', function () {
        var _userName = JSON.parse(_data).username;
        var _pwd = JSON.parse(_data).password;

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userInfo");

            _collection.updateOne({"username": _userName}, {$set: {"password": _pwd}}, function (err, result) {
                if (err) throw err;
                if (result) {
                    res.send({
                        regInfo: '修改成功！',
                        reg_code: 16
                    });
                }
                //关闭连接
                db.close();
            })
        })
    })

})

//更新用户收货信息
app.post('/setUserInfo', function (req, res) {
    var _data = '';
    req.on('data', function (_d) {
        _data += _d;
    });
    req.on('end', function () {
        var _insertObj = JSON.parse(_data);

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userInfo");

            _collection.updateOne({"username": _insertObj.userName},
                {$set: {"realname": _insertObj.realname, "phone": _insertObj.phone, "address": _insertObj.address}},
                function (err, result) {
                    if (err) throw err;
                    if (result) {
                        res.send({
                            regInfo: '保存成功！',
                            reg_code: 17
                        });
                    }
                    //关闭连接
                    db.close();
                })
        })
    })

})

/*
订单部分
 */
//获取用户订单
app.post('/getOrders', function (req, res) {
    var _userName = '';
    req.on('data', function (_d) {
        _userName += _d;
    });
    req.on('end', function () {

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userInfo");

            _collection.find({"username": _userName}).toArray(function (err, result) {
                if (err) throw err;

                //把订单返回
                res.send(result[0].orders);

                //关闭连接
                db.close();
            })
        })
    })

})

//删除用户某一订单
app.post('/delOrder', function (req, res) {
    var _data = '';
    req.on('data', function (_d) {
        _data += _d;
    });
    req.on('end', function () {
        var _userName = JSON.parse(_data).username;
        var _date = JSON.parse(_data).date;

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userInfo");

            _collection.updateOne({"username": _userName}, {"$pull": {"orders": {"date": _date}}}, function (err, result) {
                if (err) throw err;
                if (result) {
                    res.send({
                        regInfo: '删除成功',
                        reg_code: 18
                    })
                }
                //关闭连接
                db.close();
            })
        })
    })
})

//对订单的各种操作（退货、确认收货、取消退货）
app.post('/setOrder', function (req, res) {
    var _data = '';
    req.on('data', function (_d) {
        _data += _d;
    });
    req.on('end', function () {
        var _dataObj = JSON.parse(_data);
        var _userName = _dataObj.username;
        var _date = _dataObj.date;
        var _txt = _dataObj.txt;

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userInfo");

            //找到username、orders的date符合条件的一项，然后把这一项的status改为txt(退货中、已完成、进行中)
            _collection.updateOne({"username": _userName, "orders": {$elemMatch: {"date": _date}}},
                {$set: {"orders.$.status": _txt}}, function (err, result) {
                    if (err) throw err;
                    // res.send({
                    //     regInfo: '操作成功',
                    //     reg_code: 19
                    // })
                    db.close();
                })
        })

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：store
            var _dbo = db.db('store');
            // 集合名
            var _collection = _dbo.collection("userOrders");

            //找到username、orders的date符合条件的一项，然后把这一项的status改为txt(退货中、已完成、进行中)
            _collection.updateOne({"username": _userName, "date": _date},
                {$set: {"status": _txt}}, function (err, result) {
                    if (err) throw err;
                    res.send({
                        regInfo: '操作成功',
                        reg_code: 19
                    })
                    db.close();
                })
        })

    })
})

//平台端获取订单
app.get('/adminGetOrders', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：store
        var _dbo = db.db('store');
        // 集合名
        var _collection = _dbo.collection("userOrders");

        _collection.find().toArray(function (err, result) {
            if (err) throw err;
            //把订单返回
            res.send(result);

            //关闭连接
            db.close();
        })
    })
})


app.listen(5678, function () {
    console.log('5678 runs successfully.');
})