<template>
  <div>
    
      <div class="dialog-wrap" v-if="isShow" @click="closeMyself">
        <div class="dialog-cover"></div>
        <!-- transition是定义动画的 -->
        <transition name="drop">
            <div class="dialog-content">
                <!-- 点击右上角的X的时候，关闭弹窗 -->
                <p class="dialog-close" @click="closeMyself">x</p>
                <!-- 这是一个插槽，在App.vue使用dialog.vue组件的时候,可以在标签中写内容，内容就会显示在插槽中，如果没有在标签中写内容，就会显示默认值“empty” -->
                <slot>empty</slot> 
            </div>
        </transition>
      </div>
  </div>
</template>

<script>
export default {
  props: {
      isShow:{
          type: Boolean,
          default: false
      }
  },
  data() {
      return {
          
      }
  },
  methods:{
      closeMyself() {
          this.$emit('on-close')
      }
  }
}
</script>

<style>
.drop-enter-active {
    transition: all .5s ease;
}
.drop-leave-active {
    transition: all .3s ease;
}
.drop-enter {
    transform: translateY(-500px);
}
.drop-leave-active {
    transform: translateY(-500px);
}
.dialog-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
}
.dialog-cover {
  background: #000;
  opacity: .3;
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialog-content {
  width: 50%;
  position: fixed;
  max-height: 50%;
  overflow: auto;
  background: #fff;
  top: 20%;
  left: 50%;
  margin-left: -25%;
  z-index: 10;
  border: 2px solid #464068;
  padding: 2%;
  line-height: 1.6;
}
.dialog-close {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  text-align: center;
  cursor: pointer;
}
.dialog-close:hover {
  color: #4fc08d;
}
</style>


