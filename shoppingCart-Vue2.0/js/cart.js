var vm = new Vue({
  el: '#app',
  data: {
    totalMoney:0,
    productList:[],
    checkAllFlag: false,
    delFlag: false,
    curProduct: ''
  },
  filters: { //局部的过滤器
    //在真正的开发过程中，其实我们的商品金额不应该由前端来进行格式化的，应该由后端直接把2位小数进行返回，因为前端js是有精度丢失的
    //如果我们toFixed(2)之后,它会进行四舍五入，假如说后端返回5.48，那就回四舍五入成5.50，下面这个例子直接用toFixed(2)只是举个例子进行学习
    formatMoney: function (value) {
      return "¥"+value.toFixed(2);
    }
  },
  mounted: function () {  //
    this.$nextTick(function() {
      //this跟vm其实是同一个东西,那为什么我们用vm替换this会报错呢？是因为官方文档把vue1.0用的read替换成了mounted，而mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted
      //this.cartView();
      vm.cartView();
    })
  },
  methods: {
    cartView: function () {

      var _this = this;  //在vue实例方法中，所有this都是指向vue实例，但是在某一个函数内部，this的作用域会发上变化，我们就不能再直接使用this了。
      this.$http.get('data/cartData.json',{"id":123}).then(function (res) {
      //vue-resoure插件返回的并不是直接是我们请求的接送数据的，它里面还封装了一层，到浏览器上打断点调试,然后可以在控制台直接输出res，看看里面的结构
      _this.productList = res.body.result.list; //把接口返回的list保存到data的productList里面
      });
    },
    changeMoney: function(product,way) { //product是操作商品项，way是操作的是加还是减
      if(way==-1) {
        product.productQuantity--;
        if(product.productQuantity<1) {
          product.productQuantity = 1;
        }
      } else {
        product.productQuantity++;
      }
      this.calcTotalPrice();
    },
    selectedProduct: function(item) {
      //需要判断item.checked是否存在,用typeof来判断
      if(typeof item.checked == 'undefined') {
        //如果item.checked == 'undefined'，说明这个item对象里面是不存在checked这个属性的，不存在应该怎么办呢？
        //有2种方式，第一种方式就是全局注册，第二种方式就是局部注册，vm.$set(object,key,value)方法，设置一个不存在的变量，来让vue监听
        //Vue.set(item,'checked',true); //通过vue全局注册，往item这个变量里面注册check这个属性，它的值是true，然后我们在class绑定中就可以使用这个值了
        this.$set(item,'checked',true); //局部注册
      }else{
        item.checked = !item.checked;
      }
      this.calcTotalPrice();
    },
    checkAll: function(flag) { //加flag参数来区分是全选还是取消全选
      this.checkAllFlag = flag;
      var _this = this;
      //全选按钮选中了以后呢，我们需要遍历商品列表，把商品列表里面的每一个商品的item.checked都给选中
      this.productList.forEach(function(item,index) { //循环商品列表
          //因为我们很有可以没有点击选择单个是商品，就直接点击全选按钮，这个时候商品的checked属性还没有被注册，所以我们需要进行以下判断
          if(typeof item.checked == 'undefined') { //判断商品的checked属性是否注册
            _this.$set(item,'checked',_this.checkAllFlag); //局部注册商品的属性
          }else{
            item.checked = _this.checkAllFlag; //如果注册了，直接把商品的checked属性设置为true
          }
        });
      this.calcTotalPrice();
    },
    calcTotalPrice: function() { //计算结账总金额的方法，需要点击加减，点击单选，点击全选的时候都去调用这个方法
      var _this = this;
      this.totalMoney = 0; //计算之前先把总金额清零
      this.productList.forEach(function(item,index) {
        if(item.checked) {
          _this.totalMoney += item.productPrice*item.productQuantity
        }
      })
    },
    delConfirm: function(item) {
      this.delFlag=true;
      this.curProduct = item; //点击删除某个商品，把这个商品存起来，这样删除确认的时候，我们就知道应该删除哪一个对象
    },
    delProduct: function() {
      var index = this.productList.indexOf(this.curProduct);//通过indexof去搜索当前选中的商品，可以找到它的索引
      this.productList.splice(index,1); //splice()是一个删除的方法，参数一是从某一个位置开始删，参数二是删除的个数
      this.delFlag=false;
      //真正的开发中，这个删除应该是调后台接口的this.$http...,理论上应该是吧这个要删除的商品的id传到后台，后台进行删除，删除成功后返回我们一个字段，告诉我们删除成功
    }
  }
});
//全局过滤器，可以在任何一个地方使用
Vue.filter('money',function (value,type) { //money是过滤器的名字
  return "¥"+value.toFixed(2) + type;
})
