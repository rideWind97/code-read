# Vue3 响应式原理

## 核心原理
Vue3 的响应式基于 ES6 的 `Proxy` 和 `Reflect`，相比 Vue2 的 `Object.defineProperty` 有显著改进。

### 1. Proxy 代理
Vue3 使用 `Proxy` 创建对象的代理，可以拦截对象的各种操作（get、set、delete 等）。

### 2. 依赖收集
当访问响应式对象的属性时，会触发 `get` 拦截器，此时收集当前正在执行的副作用函数作为依赖。

### 3. 触发更新
当修改响应式对象的属性时，会触发 `set` 拦截器，通知所有相关的副作用函数重新执行。

## 代码示意
```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key) // 收集依赖
      return Reflect.get(target, key, receiver) // 使用 Reflect 获取值
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver) // 使用 Reflect 设置值
      if (oldValue !== value) {
        trigger(target, key) // 触发更新
      }
      return result
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const result = Reflect.deleteProperty(target, key) // 使用 Reflect 删除属性
      if (result && hadKey) {
        trigger(target, key) // 触发更新
      }
      return result
    }
  })
}
```

```js
function effect(fn) {
  activeEffect = fn
  fn() // 执行时收集依赖
  activeEffect = null
}
```

## track 和 trigger 实现
```js
// 存储依赖关系的 Map
const targetMap = new WeakMap()
// 存储当前正在执行的副作用函数
let activeEffect = null

function track(target, key) {
  if (!activeEffect) return
  
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  
  dep.add(activeEffect) // 收集当前副作用函数
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  
  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect() // 执行所有相关的副作用函数
    })
  }
}
```

### track 作用
- 在访问响应式对象属性时调用
- 将当前正在执行的副作用函数（activeEffect）添加到该属性的依赖集合中
- 建立"属性 -> 副作用函数"的映射关系

### trigger 作用
- 在修改响应式对象属性时调用
- 找到该属性对应的所有副作用函数
- 执行这些副作用函数，实现响应式更新

### Reflect 的作用
- `Reflect.get(target, key, receiver)`：获取目标对象的属性值，支持继承链
- `Reflect.set(target, key, value, receiver)`：设置目标对象的属性值，返回布尔值表示是否成功
- `Reflect.deleteProperty(target, key)`：删除目标对象的属性，返回布尔值表示是否成功
- 相比直接操作对象，Reflect 提供了更规范、更安全的对象操作方式

## 优势
- 支持数组和对象的新增/删除操作（Vue2 不支持）
- 更好的性能（懒收集，按需触发）
- 支持 Map、Set 等数据结构
- 更精确的依赖收集

## 总结
Vue3 响应式通过 Proxy 实现数据劫持，在 get 时收集依赖，set 时触发更新，相比 Vue2 功能更强大、性能更好。
