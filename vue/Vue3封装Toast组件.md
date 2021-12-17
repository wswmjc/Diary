### 前言
最近在用vue3重构老的项目，遇到了toast组件重写，顺便探索了一番，主要学习了Vant和Element-ui的ui封装方法

### 准备需求
1. 希望构建一个可以api调用，并挂载到Vue实例上，可以在SFC中使用this.$toast进行调用
2. 编写一个Toast.vue模板，以供渲染
3. 编写一个toast.ts导出toast方法，提供给Vue进行挂载
4. 在main.ts中引用，进行全局挂载

### 进一步细化
##### 1. 模板

*   提供一个message参数为弹窗内容
*   需要一个淡出淡入的特效，所以需要transition和一个showToast的state

##### 2. 导出方法
*   根据模板**生成实例**
*   将实例挂载到dom
*   提供一个duration 并设置一个时长为duration的定时器 
*   定时器执行完毕后删除dom中的实例
*   最终导出一个可挂载的对象

##### 3.生成实例
*   编写一个通用的composition api
*   导出挂载的实例
*   导出对应实例的卸载方法

### 代码
##### 1. 模板 Toast.vue
```javascript
<style lang="less">
.toast {
  position: fixed;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin: auto;
  padding: 0.1rem;
  max-width: 80%;
  border-radius: 0.05rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  font-size: 0.28rem;
  z-index: 99999;
  transition: opacity 0.3s linear;
}

.toast-wrapper-enter-from,
.toast-wrapper-leave-to {
  opacity: 0;
}
</style>
<template>
  <transition name="toast-wrapper">
    <div class="toast" v-show="showToast">{{ message }}</div>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // 消息内容
  props: ['message'],
  data() {
    return {
      // state
      showToast: false
    }
  }
})
</script>
```

##### 2. 生成实例 useMountComponent.ts
```javascript

import { Component, createApp } from 'vue'
export function useMountComponent(rootComponent: Component) {
  const app = createApp(rootComponent);
  const root = document.createElement('div');
  document.body.appendChild(root);
  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}

```

##### 3. 导出方法 index.ts
```javascript
import ToastConstructor from './Toast.vue'
import { nextTick, createVNode, App } from 'vue';
import { useMountComponent } from '../../lib/utils/useMountComponent'
interface ToastOption {
  message: string,
  duration: number
}

const toast = (options: ToastOption | string) => {
  const duration = typeof options !== 'string' ? options.duration : 3000
  const { instance, unmount } = useMountComponent(createVNode(
    ToastConstructor,
    {
      message: typeof options === 'string' ? options : options.message
    }
  ));
  
  // 获取实例的代理和data 代理可以拿到dom对象 data可以设置state
  const { proxy, data } = instance.$
  const RemoveSelf = function (event: TransitionEvent) {
    unmount()
  }
  
  // 在toast实例挂载到dom上之后执行 展示与消失
  nextTick(() => {
    data.showToast = true
    proxy?.$el.removeEventListener('transitionend', RemoveSelf)
    ~duration && (setTimeout(function () {
      data.showToast = false
      proxy?.$el.addEventListener('transitionend', RemoveSelf)
    }, duration));
  });
  return instance;
}


export default {
  // 挂载对象需要提供 install方法
  install: (app: App) => {
    app.config.globalProperties.$toast = toast
  }
}
```

##### 4. 全局挂载 main.ts
```javascript

import { createApp } from 'vue'
import Toast from './components/toast/index'

const app = createApp(App)
app.use(Toast)
```

##### 5. 调用
```javascript

export default defineComponent({
  name: "TestToast",
  setup() { 
     const { proxy } = getCurrentInstance() as ComponentInternalInstance
     proxy?.$toast('test in setup'); 
   },
   methods:{
    TestToast() {
       this.$toast('test in method')
    }
   }
});

```

### 总结
Vue3中获取实例与修改实例的属性等操作感觉有点奇怪 并没有vue2中那么方便 这也许就是proxy带来的一点小的副作用吧 