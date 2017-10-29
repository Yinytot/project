<template>
  <div class="slide-show"  @mouseover="clearInv()" @mouseout="runInv()">
    <div class="slide-img">
      <a :href="slides[nowIndex].href">
        <!-- transition是用来加动画的，要加动画就需要有两张图同时显示，一张从左边出去的图slide-trans-old，一张从右边进来的图slide-trans,用v-if来控制显示隐藏-->
        <transition name="slide-trans">
          <!-- 这个nowIndex代表的是要进入的图片的index -->
          <img v-if="isShow" :src="slides[nowIndex].src">
        </transition>
        <transition name="slide-trans-old">
          <!-- 这个nowIndex代表的是要离开的图片的index，与上面的是不一样的-->
          <img v-if="!isShow" :src="slides[nowIndex].src">
        </transition>
      </a>
    </div>
    <h2>{{ slides[nowIndex].title }}</h2>
    <ul class="slide-pages">
      <!-- 当点击前一个的时候，还是执行goto()函数，prevIndex在计算属性中实现返回index -->
      <li @click="goto(prevIndex)">&lt;</li>
      <li v-for="(item,index) in slides">
        <!-- 1.当index===nowIndex时，绑定给a标签绑定class属性on。2.点击a标签执行goto函数-->
        <a :class="{ on: index === nowIndex }" @click="goto(index)">
          {{ index + 1 }}
        </a>
      </li>
      <li @click="goto(nextIndex)">&gt;</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'slideShow',
  props: {  //访问父级组件的数据,把这些数据放到父组件中，会更好管理
    slides:{
      type: Array,
      default: []
    },
    inv: { //定时器的时间设置，默认值是1000ms
      type: Number,
      default: 1000
    }
  },
  computed: { //计算属性
    prevIndex() {
      if( this.nowIndex === 0 ) {
        return this.slides.length - 1;
      }else {
        return this.nowIndex - 1
      }
    },
    nextIndex() {
      if( this.nowIndex === this.slides.length - 1) {
        return 0
      }else {
        return this.nowIndex + 1;
      }
    }
  },
   data () {
    return {
      isShow: true,
      nowIndex: 0
    }
  },
  methods: {
    goto(index) {
      this.isShow = false;
      setTimeout(() => {  //延时器setTimeout只运行一次，也就是说设定的时间到后就触发运行指定代码，运行完后即结束。如果运行的代码中再次运行同样的setTimeout命令，则可循环运行。（即 要循环运行，需函数自身再次调用 setTimeout()）
        this.isShow = true
        this.nowIndex = index;
        this.$emit('onchange',index) //每次轮播图切换都触发一个自定义事件,并且把change过后的index传到自定义事件上
      }, 10)
    },
    runInv() {
      this.invId = setInterval(() => { //开启定时器，让图片自动切换
        this.goto(this.nextIndex)
      },this.inv)  //this.inv定时器的时间设置
    },
    clearInv() {
      clearInterval(this.invId)
    }
  },
  mounted() { //el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
    this.runInv();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slide-trans-enter-active { /*动画*/
  transition: all .5s;
}
.slide-trans-enter { /*动画*/
  transform: translateX(900px);
}
.slide-trans-old-leave-active { /*动画*/
  transition: all .5s;
  transform: translateX(-900px);
}
.slide-show {
  position: relative;
  margin: 15px 15px 15px 0;
  width: 900px;
  height: 500px;
  overflow: hidden;
}
.slide-show h2 {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #000;
  opacity: .5;
  bottom: 0;
  height: 30px;
  text-align: left;
  padding-left: 15px;
}
.slide-img {
  width: 100%;
}
.slide-img img {
  width: 100%;
  position: absolute;
  top: 0;
}
.slide-pages {
  position: absolute;
  bottom: 10px;
  right: 15px;
}
.slide-pages li {
  display: inline-block;
  padding: 0 10px;
  cursor: pointer;
  color: #fff;
}
.slide-pages li .on {
  text-decoration: underline;
}
</style>
