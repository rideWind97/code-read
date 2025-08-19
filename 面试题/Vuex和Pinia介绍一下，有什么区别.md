# Vuex 和 Pinia 介绍及区别

## Vuex 简介

Vuex 是 Vue.js 官方提供的状态管理库，适用于 Vue2 和 Vue3，采用集中式管理所有组件的状态，数据流动单向，适合大型复杂项目。

## Pinia 简介

Pinia 是 Vue3 生态下的新一代状态管理库，API 更加简洁，类型推导更好，支持模块化和组合式用法，体积更小，易于维护。

## 区别

- 设计理念：Pinia 更贴近组合式 API，Vuex 偏向传统选项式。
- 语法简洁：Pinia 代码更少，API 更直观。
- 类型支持：Pinia 对 TypeScript 支持更好。
- 模块拆分：Pinia 支持更灵活的模块拆分和复用。
- 生态兼容：Vuex 兼容 Vue2/3，Pinia 主要面向 Vue3。
- 插件支持：Pinia 插件机制更简单。

## 总结

新项目推荐使用 Pinia，老项目或 Vue2 项目可继续使用 Vuex。



## Pinia 源码简要分析

### 1. defineStore 的实现

`defineStore` 返回一个工厂函数，每次调用返回同一个响应式 store 实例。

```js
function defineStore(id, options) {
  let store
  return function useStore() {
    if (!store) {
      store = createStoreInstance(id, options)
    }
    return store
  }
}
```

### 2. store 实例创建

- 用 `reactive` 包装 state
- 用 `computed` 包装 getters
- actions 直接挂载

```js
function createStoreInstance(id, options) {
  const state = reactive(options.state ? options.state() : {})
  const getters = {}
  for (let key in options.getters) {
    getters[key] = computed(() => options.getters[key].call(store))
  }
  const actions = {}
  for (let key in options.actions) {
    actions[key] = options.actions[key].bind(store)
  }
  const store = { ...toRefs(state), ...getters, ...actions }
  return store
}
```

### 3. 响应式与依赖注入

Pinia 利用 Vue3 的响应式系统（`reactive`、`computed`、`toRefs`），并通过 `provide/inject` 机制让组件获取 store。

### 4. 插件机制

插件是函数，store 创建时会被调用，可扩展 store。

```js
function applyPlugins(store, plugins) {
  plugins.forEach(plugin => plugin({ store }))
}
```

### 5. 类型推导

Pinia 利用 TypeScript 泛型和类型推断，提升开发体验。

### 总结

Pinia 核心实现简洁，主要依赖组合式 API 和 Vue3 响应式系统，支持插件和类型推导，易于维护和扩展。
