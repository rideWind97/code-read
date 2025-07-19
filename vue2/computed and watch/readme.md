# computed and watch 说明

本目录主要包含 vue2 计算属性（computed）和侦听器（watch）的简易实现。

## 功能说明
- computed：
  1. 支持传入函数，得到只读计算属性
  2. 支持传入对象，get/set，可读可写
  3. 支持依赖收集和缓存，依赖变更时自动更新
- watch：
  1. 支持监听对象属性变化，回调带新旧值

## 用法示例
```js
import { computed } from './computed.js';
import { watch } from './watch.js';

// 只读
const sum = computed(() => state.a + state.b);
console.log(sum.value);

// 可读可写
const plus = computed({
  get: () => state.a + state.b,
  set: val => { state.a = val - state.b; }
});
plus.value = 10;

// watch
watch(state, 'a', (newVal, oldVal) => {
  console.log('a变化了', oldVal, '=>', newVal);
});
```

## 原理简述
- computed：通过依赖收集，自动追踪依赖的响应式数据，缓存计算结果，只有依赖变更时才重新计算
- watch：通过Watcher订阅属性变化，属性变更时自动执行回调，回调参数为新旧值
