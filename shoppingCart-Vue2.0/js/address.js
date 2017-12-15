new Vue({
  el:'.address',
  data: {
    limitNum: 3,
    addressList: [],
    currentIndex: 0,
    shippingMethod: 1,
    delFlag: false,
    editFlag: false,
    editUserName: '',
    editStreetName: '',
    editTel: ''
  },
  computed: {
    filterAddress: function() {
      return this.addressList.slice(0,this.limitNum); //用slice()方法截取0-3个数据，然后返回一个全新的数组
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getAddressList()
    });
  },
  methods: {
    getAddressList: function() {
      this.$http.get('data/address.json').then(response => { //用箭头函数，this会只想现在的作用域
        var res = response.data;
        if(res.status == '0') {
          this.addressList = res.result;
        }
      })
    },
    setDefault: function(addressId) { //addressId是唯一的
      this.addressList.forEach(function(address,index) { //遍历addressList数组，默认传入2个参数，参数一是遍历的项，参数二是遍历项的索引值
        if(address.addressId == addressId) { //如果当前的addressId与遍历的那个address.addressId相同，说明我们要设置为默认地址的就是当前的卡片
          address.isDefault = true; //当前选中的卡片改成true
        }else{
          address.isDefault = false; //其他卡片改成false
        }
      })
    },
    addressDelConfirm: function(item) {
      this.delFlag=true;
      this.curAddress = item; //点击删除某个地址，把这个地址存起来，这样删除确认的时候，我们就知道应该删除哪一个对象
    },
    delAddress: function() {
     var index = this.addressList.indexOf(this.curAddress); //通过indexof去搜索当前选中的地址，可以找到它的索引
     this.addressList.splice(index,1); //splice()是一个删除的方法，参数一是从某一个位置开始删，参数二是删除的个数
     this.delFlag=false;
    },
    addressEditConfirm: function(item) {
      this.editFlag = true;
      this.editAddress = item;
      this.editUserName = this.editAddress.userName;
      this.editStreetName = this.editAddress.streetName;
      this.editTel = this.editAddress.tel;
    },
    editConfirms: function() {
      this.editAddress.userName = this.editUserName;
      this.editAddress.streetName = this.editStreetName;
      this.editAddress.tel = this.editTel;
      this.editFlag = false;
    }
  }
});