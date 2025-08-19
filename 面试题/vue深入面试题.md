当然可以！以下是一份专为资深前端开发者整理的 Vue.js 面试高频问题与参考答案（Markdown 格式），涵盖核心原理、性能优化、组件通信、响应式系统、Vue 3 新特性、生态工具等，适合中高级前端面试准备。

---

# 🌟 Vue.js 高频面试题整理（资深前端向）

> 适用于 Vue 2 / Vue 3，重点突出原理与深度理解

---

## 🔹 一、Vue 核心原理

### 1. Vue 的响应式原理是什么？（Vue 2 vs Vue 3）

**Vue 2：**
- 基于 `Object.defineProperty` 实现数据劫持。
- 在 `data` 中的每个属性被 `defineProperty` 劫持 `getter` 和 `setter`。
- `getter` 中收集依赖（Watcher），`setter` 中触发更新。
- 缺点：无法监听数组索引变化、对象新增/删除属性需 `Vue.set`。

**Vue 3：**
- 使用 `Proxy` 代理整个对象，拦截 `get`、`set`、`has`、`deleteProperty` 等。
- 可监听数组索引变化、对象属性的增删改。
- 结合 `Reflect` 实现更完整的代理。
- 依赖收集通过 `effect` 和 `track` 实现，更新通过 `trigger` 触发。

```js
// Vue 3 简化示例
const reactive = (obj) => {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // 收集依赖
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // 触发更新
      return result;
    }
  });
};
```

---

### 2. 为什么 Vue 3 使用 Proxy 而不是 defineProperty？

- **defineProperty 的局限性**：
  - 无法监听数组索引变化（如 `arr[0] = newVal`）。
  - 无法监听对象属性的动态添加或删除。
  - 需要递归遍历对象所有属性进行劫持，性能开销大。
- **Proxy 的优势**：
  - 拦截整个对象，无需递归。
  - 支持更多操作（如 `in`、`delete`、`apply` 等）。
  - 更好的性能和扩展性。

---

### 3. Vue 的虚拟 DOM 是什么？diff 算法如何工作？

- **虚拟 DOM**：用 JS 对象模拟真实 DOM 结构，减少直接操作 DOM 的开销。
- **diff 算法**（Vue 2 / 3 均采用双端 diff）：
  - 比较新旧 VNode 的 `key` 和标签。
  - 采用双指针（头头、尾尾、头尾、尾头）进行比对。
  - 尽量复用节点，减少 DOM 操作。
  - Vue 3 引入 `patchFlag` 标记动态节点，跳过静态节点 diff。

---

### 4. Vue 的生命周期钩子有哪些？（Vue 2 & Vue 3）

| 钩子 | 说明 |
|------|------|
| `beforeCreate` | 实例初始化后，数据观测前 |
| `created` | 实例创建完成，可访问 data、methods，但未挂载 |
| `beforeMount` | 挂载前，VNode 已创建 |
| `mounted` | 挂载完成，可操作 DOM |
| `beforeUpdate` | 数据更新前，视图未更新 |
| `updated` | 视图更新后 |
| `beforeUnmount` (Vue 3) / `beforeDestroy` (Vue 2) | 实例销毁前 |
| `unmounted` / `destroyed` | 实例销毁后 |

> ⚠️ 注意：`beforeDestroy` 和 `destroyed` 在 Vue 3 中更名为 `beforeUnmount` 和 `unmounted`。

---

## 🔹 二、组件通信

### 5. Vue 中组件通信的方式有哪些？

1. **Props / $emit**：父子组件通信。
2. **$attrs / $listeners**（Vue 2） / `v-bind="$attrs"`（Vue 3）：透传属性和事件。
3. **provide / inject**：祖先向后代注入依赖（跨层级）。
4. **$parent / $children**：父子组件直接访问（不推荐）。
5. **$refs**：访问子组件实例。
6. **Event Bus**（Vue 2） / mitt / tiny-emitter（Vue 3）：事件总线。
7. **Vuex / Pinia**：状态管理（全局通信）。
8. **localStorage / sessionStorage**：持久化通信（非响应式）。

---

### 6. provide / inject 是响应式的吗？

- **默认不是响应式**：如果注入的是普通值，修改不会触发更新。
- **实现响应式**：
  - 注入 `reactive` 或 `ref` 对象。
  - 或使用 `computed` 包装。

```js
// 祖先组件
provide('theme', ref('dark'));

// 后代组件
const theme = inject('theme');
```

---

## 🔹 三、Vue 3 新特性

### 7. Composition API 与 Options API 的区别？

| 对比项 | Options API | Composition API |
|--------|-------------|-----------------|
| 逻辑组织 | 按选项（data、methods）组织 | 按逻辑功能组织 |
| 逻辑复用 | Mixins（命名冲突、难以追踪） | 自定义 Hook（函数式、可组合） |
| 类型推导 | 一般 | 更好（TS 支持强） |
| 适用场景 | 小型组件 | 复杂逻辑、大型项目 |

> ✅ 推荐：复杂逻辑使用 Composition API，简单组件可用 Options。

---

### 8. setup() 函数的执行时机？有哪些参数？

- **执行时机**：在 `beforeCreate` 之前执行，此时 `this` 不可用。
- **参数**：
  - `props`：父组件传递的 props。
  - `context`：包含 `emit`、`attrs`、`slots`、`expose`。

```js
setup(props, { emit, attrs, slots, expose }) {
  // 逻辑
  return { /* 暴露给模板的变量和方法 */ }
}
```

---

### 9. ref 和 reactive 的区别？

| 特性 | `ref` | `reactive` |
|------|-------|------------|
| 适用类型 | 基本类型、对象 | 仅对象（包括数组） |
| 访问方式 | `.value` | 直接访问 |
| 解构后是否响应 | 否（需 `toRefs`） | 是 |
| 内部实现 | `RefImpl` 类 | `Proxy` 代理对象 |

```js
const count = ref(0);
const state = reactive({ name: 'Vue' });

// 解构 reactive 需 toRefs
const { name } = toRefs(state);
```

---

### 10. Vue 3 中的 Teleport、Suspense 是什么？

- **Teleport**：
  - 将组件渲染到 DOM 树外（如弹窗、modal）。
  - 使用 `<Teleport to="#modal">...</Teleport>`。

- **Suspense**：
  - 异步组件的加载状态管理。
  - 包裹异步组件，提供 `#default` 和 `#fallback` 插槽。

```vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

---

## 🔹 四、性能优化

### 11. 如何优化 Vue 项目的性能？

1. **组件懒加载**：`defineAsyncComponent` 或 `() => import()`。
2. **v-if vs v-show**：频繁切换用 `v-show`，条件渲染用 `v-if`。
3. **keep-alive 缓存组件**：避免重复渲染。
4. **避免 v-for 和 v-if 同时使用**（v-if 优先级更高）。
5. **使用 key 提升 diff 效率**。
6. **使用 computed 缓存计算结果**。
7. **减少响应式数据层级过深**。
8. **使用 SSR 或静态站点生成（Nuxt.js）**。

---

### 12. 什么是 keep-alive？它的生命周期钩子有哪些？

- **作用**：缓存组件实例，避免重复渲染。
- **include / exclude**：控制缓存哪些组件。
- **生命周期钩子**：
  - `activated`：组件被激活时调用。
  - `deactivated`：组件被缓存时调用。

```vue
<keep-alive include="UserComponent">
  <component :is="currentComponent" />
</keep-alive>
```

---

## 🔹 五、状态管理

### 13. Vuex 和 Pinia 的区别？

| 特性 | Vuex | Pinia |
|------|------|-------|
| 模块化 | 需 modules | 天然模块化（每个 store 独立） |
| TS 支持 | 一般 | 优秀 |
| API | `commit` / `dispatch` | 直接调用 action |
| 状态修改 | 必须通过 mutation | 可直接修改（action 内） |
| 体积 | 较大 | 更小 |
| Vue 3 推荐 | ❌ | ✅ |

> ✅ Pinia 是 Vue 3 官方推荐的状态管理库。

---

### 14. 如何在 Pinia 中实现持久化存储？

使用 `pinia-plugin-persistedstate` 插件：

```js
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 在 store 中
export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'John'
  }),
  persist: true // 或配置 localStorage 等
});
```

---

## 🔹 六、高级问题

### 15. 如何实现一个自定义指令（directive）？

```js
// 全局注册
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

// 局部注册
directives: {
  focus: {
    mounted(el) {
      el.focus();
    }
  }
}
```

常用钩子：`created`、`mounted`、`updated`、`unmounted`。

---

### 16. Vue 中如何监听路由变化？（Vue Router）

- **Vue 2**：`watch: $route` 或 `beforeRouteUpdate` 守卫。
- **Vue 3 + Composition API**：

```js
import { onBeforeRouteUpdate } from 'vue-router';
onBeforeRouteUpdate((to, from) => {
  // 处理路由变化
});
```

或使用 `watch` 监听 `useRoute()`：

```js
import { watch } from 'vue';
import { useRoute } from 'vue-router';

watch(useRoute(), (to) => {
  console.log(to.path);
});
```

---

### 17. Vue 3 中的 fragment、teleport、suspense 对编译器有何影响？

- **Fragment**：模板支持多个根节点，无需包裹 `div`。
- **Teleport**：编译时将内容移动到目标 DOM。
- **Suspense**：编译为异步加载的占位结构。
- 这些特性使模板更灵活，减少不必要的包装元素。

---

### 18. 如何处理 Vue 中的内存泄漏？

- 及时清理定时器、事件监听器（在 `beforeUnmount` 中）。
- 避免在闭包中持有组件实例引用。
- 使用 `weakMap` / `weakSet` 存储弱引用。
- 避免在全局变量中存储组件数据。

```js
onMounted(() => {
  timer = setInterval(() => {}, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
```

---

## 🔚 总结

| 类别 | 关键点 |
|------|--------|
| 原理 | 响应式（Proxy）、diff、生命周期 |
| 通信 | props/emit、provide/inject、Pinia |
| Vue 3 | Composition API、ref/reactive、Teleport、Suspense |
| 性能 | 懒加载、keep-alive、v-show、computed |
| 状态管理 | Pinia 优于 Vuex（Vue 3） |
| 最佳实践 | 合理使用 key、避免内存泄漏、TS 配合 |

---

> 💡 建议：结合项目经验，准备 1-2 个实际优化或架构设计案例（如：如何用 Pinia 重构状态层、如何实现可复用的 Composition API Hook）。

---

✅ **祝你面试顺利，斩获 Offer！** 🎉

--- 

如需导出为 PDF 或打印，可使用 VS Code + Markdown Preview Enhanced 插件。  
需要我帮你生成 PDF 或补充某一部分（如：Vue Router、SSR、TypeScript 集成等），欢迎继续提问！


当然可以！以下是针对 **资深前端开发者** 的 **Vue.js 面试进阶深度补充版**，在原有基础上进一步深入底层原理、源码机制、性能边界、编译优化、响应式系统设计、框架对比与架构思想等维度，帮助你在高级/专家级面试中脱颖而出。

---

# 🚀 Vue.js 深度面试题补充（资深 / 专家级）

> 适用于 Vue 2 / Vue 3，聚焦 **原理剖析、源码实现、性能边界、架构设计**

---

## 🔹 一、响应式系统深度剖析

### 1. Vue 3 响应式系统是如何实现依赖收集和触发更新的？（手写简化版）

Vue 3 使用 `effect` + `track` + `trigger` 构建响应式核心。

```js
// 简化版响应式系统
const targetMap = new WeakMap(); // target -> depsMap
let activeEffect = null;

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return typeof result === 'object' ? reactive(result) : result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return result;
    }
  });
}

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => {
      effect();
    });
  }
}

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn;
    fn();
    activeEffect = null;
  };
  effectFn();
  return effectFn;
}
```

> ✅ 这是 Vue 3 响应式核心的极简实现，`track` 收集依赖，`trigger` 触发执行。

---

### 2. Vue 3 中的 `effect` 和 `computed` 是如何关联的？

- `computed` 本质是一个 **带缓存的 effect**。
- 它内部使用 `effect` 包装 getter，并标记为 `lazy: true`，不会立即执行。
- 第一次读取时执行，后续依赖未变则返回缓存值。
- 通过 `dirty` 标志控制是否需要重新计算。

```js
function computed(getter) {
  let value;
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      dirty = true; // 依赖变化时标记为脏
      trigger(owner, 'value'); // 触发 computed 属性更新
    }
  });

  const computedRef = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(computedRef, 'value'); // 收集对 computed.value 的依赖
      return value;
    }
  };

  return computedRef;
}
```

> 💡 `computed` 是“懒执行 + 缓存 + 响应式依赖追踪”的组合。

---

### 3. 为什么 `ref` 在模板中不需要 `.value`？编译器做了什么？

- **模板编译阶段**，Vue 的编译器（`@vue/compiler-dom`）会自动展开 `ref`。
- 在生成的 `render` 函数中，`ref` 被自动解包（unwrap）。

```vue
<!-- 模板 -->
<div>{{ count }}</div>
```

```js
// 编译后（简化）
render() {
  return createVNode("div", null, String(count.value));
}
```

- **条件**：只有在顶层属性（如 `setup` 返回的 `count`）才会自动解包。
- 如果是嵌套对象中的 `ref`，不会自动解包（需手动 `.value`）。

> ✅ 编译器通过静态分析识别 `ref` 并自动解包，提升开发体验。

---

## 🔹 二、编译原理与优化

### 4. Vue 3 的编译优化：`patchFlag` 是什么？如何工作？

- `patchFlag` 是 Vue 3 编译器在 VNode 上添加的 **动态标记**，用于跳过静态节点 diff。
- 在 `render` 函数中，只有带 `patchFlag` 的节点才参与 diff。

| patchFlag | 含义 |
|----------|------|
| `1` | 文本内容动态 |
| `2` | class 动态 |
| `4` | style 动态 |
| `8` | props 动态（非 class/style） |
| `16` | 动态插槽 |
| `32` | key 改变导致的全量更新 |

```js
// 编译前
<div :class="cls" @click="onClick">{{ text }}</div>

// 编译后（简化）
createElementVNode("div", {
  class: _ctx.cls,
  onClick: _ctx.onClick
}, _ctx.text, 7 /* TEXT | CLASS | PROPS */)
```

> ✅ `patchFlag = 7` 表示该节点只需对比文本、class、props，跳过 children diff。

---

### 5. Vue 的模板编译流程是怎样的？

1. **parse**：将模板字符串解析为 AST（抽象语法树）。
2. **transform**：遍历 AST，应用转换插件（如 `v-if`、`v-for` 转换）。
3. **generate**：将 AST 转为可执行的 `render` 函数字符串。
4. **compile**：通过 `new Function()` 生成 `render` 函数。

```js
const { compile } = require('@vue/compiler-dom');
const { render } = compile(`<div>{{ msg }}</div>`);
```

> ⚠️ 在运行时编译版本（如 `vue.js`）中，模板在浏览器中编译；  
> 在构建时（如 `vue-loader`），模板在打包阶段编译为 `render` 函数。

---

### 6. 为什么 Vue 推荐使用 `key`？`key` 的 diff 策略是什么？

- `key` 是 VNode 的唯一标识，用于 **复用和排序 DOM 元素**。
- Vue 使用 **双端 diff** 算法比较新旧节点列表：
  - 头头比、尾尾比、头尾比、尾头比。
  - 若 `key` 相同，尝试复用节点。
  - 若 `key` 不同，则创建新节点。

```js
// 无 key：可能导致错误复用
list: [A, B, C] → [D, A, B, C]
// 有 key：精准复用 A、B、C
```

> ✅ `key` 应使用稳定唯一值（如 `id`），避免使用 `index`（可能导致状态错乱）。

---

## 🔹 三、Composition API 高级用法

### 7. 如何实现一个可复用的 `useMouse` Hook？

```js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(e) {
    x.value = e.clientX;
    y.value = e.clientY;
  }

  onMounted(() => {
    window.addEventListener('mousemove', update);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });

  return { x, y };
}
```

> ✅ 这是典型的 **逻辑复用模式**，避免 Mixin 的命名冲突问题。

---

### 8. `watch` vs `watchEffect` 的区别？

| 特性 | `watch` | `watchEffect` |
|------|--------|---------------|
| 依赖声明 | 显式指定源（ref、getter、数组） | 自动追踪依赖（执行时收集） |
| 执行时机 | 懒执行（默认） | 立即执行一次 |
| 适用场景 | 监听特定数据变化 | 副作用自动追踪 |
| 清理机制 | `onInvalidate` 回调 | 支持 `onInvalidate` |

```js
watch(count, (newVal, oldVal) => {
  console.log(newVal);
});

watchEffect(() => {
  console.log(count.value); // 自动追踪 count
});
```

> ✅ `watch` 更精确，`watchEffect` 更简洁但可能过度执行。

---

## 🔹 四、性能边界与极限优化

### 9. Vue 的响应式系统有性能瓶颈吗？如何优化？

- **深层响应式劫持**：`reactive` 递归代理所有嵌套对象，大对象性能差。
- **解决方案**：
  - 使用 `shallowReactive` / `shallowRef`：仅代理第一层。
  - 对大型不可变数据使用 `readonly` 或普通对象。
  - 避免将大型数组/对象设为响应式（如表格数据可分页处理）。

```js
const largeData = shallowReactive(fetchHugeList());
```

---

### 10. 如何实现 Vue 组件的按需加载 + 预加载？

```js
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  delay: 200,
  timeout: 5000,
  errorComponent: ErrorComponent,
  loadingComponent: Loading,
  // 预加载
  suspensible: false,
  // 或结合路由 meta
});
```

- **路由级预加载**：在 `beforeEnter` 或 `meta` 中预加载。

```js
{
  path: '/heavy',
  component: () => import('./Heavy.vue'),
  meta: { preload: true }
}
```

---

## 🔹 五、框架对比与设计思想

### 11. Vue 和 React 的响应式机制本质区别？

| 维度 | Vue | React |
|------|-----|--------|
| 响应式类型 | **自动依赖追踪**（数据劫持） | **手动触发**（setState / useState） |
| 更新粒度 | 组件级 + 模板指令优化 | 组件级（需 useMemo/useCallback 优化） |
| 编译优化 | 模板编译 + patchFlag | JSX 运行时 + Fiber 调度 |
| 开发体验 | 模板 + 逻辑分离 | JSX 全 JS 控制 |

> ✅ Vue 是“**数据驱动自动更新**”，React 是“**状态驱动手动渲染**”。

---

### 12. Vue 为什么要保留模板（template）？JSX 不是更灵活吗？

- **模板优势**：
  - 更适合非程序员（如设计师、初级开发者）阅读。
  - 编译时优化空间大（如 `patchFlag`、静态提升）。
  - 更安全（防止 XSS，自动转义）。
- **JSX 优势**：
  - 完全 JS 表达能力。
  - 更适合复杂逻辑渲染。

> ✅ Vue 选择模板是 **为了性能优化和开发体验的平衡**，同时支持 JSX（通过 Babel）。

---

## 🔹 六、源码与架构设计

### 13. Vue 3 的模块化架构是怎样的？（核心包拆分）

Vue 3 将核心拆分为多个包：

- `@vue/reactivity`：响应式系统（可独立使用）
- `@vue/runtime-core`：虚拟 DOM、组件系统
- `@vue/runtime-dom`：平台特定 DOM 操作
- `@vue/compiler-dom`：模板编译
- `@vue/shared`：共享工具

> ✅ 这种设计支持 **目标平台扩展**（如 `@vue/runtime-test` 用于测试）、**tree-shaking** 更彻底。

---

### 14. Vue 的 `nextTick` 原理是什么？

- `nextTick` 利用 **微任务（microtask）** 实现异步更新队列。
- Vue 在数据变化后，将更新函数推入队列，等到同步代码执行完后统一刷新。

```js
const callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// 使用 Promise.then / MutationObserver / setImmediate
let timerFunc = () => {
  Promise.resolve().then(flushCallbacks);
};

export function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
```

> ✅ `nextTick` 保证在 DOM 更新后执行回调。

---

## 🔚 高级面试建议

| 场景 | 建议 |
|------|------|
| 被问“原理” | 手写简化版响应式 / diff / nextTick |
| 被问“优化” | 结合项目谈懒加载、keep-alive、编译优化 |
| 被问“架构” | 谈 Pinia 状态分层、Composition API 抽离逻辑 |
| 被问“对比” | Vue 自动响应 vs React 手动控制，模板 vs JSX |
| 被问“源码” | 说清 `effect`、`track`、`trigger` 三者关系 |

---

## 📚 推荐源码阅读路径

1. `@vue/reactivity`：`reactive`、`ref`、`effect`
2. `@vue/runtime-core`：`component`、`vnode`、`h`
3. `@vue/runtime-dom`：`patch`、`mount`、`renderer`
4. `@vue/compiler-dom`：`parse`、`transform`、`generate`

> GitHub：https://github.com/vuejs/core

---

✅ **终极建议**：准备一个 **真实项目中的深度优化案例**，例如：

> “我在某项目中使用 `shallowRef` + `triggerRef` 优化了 10w 行表格的渲染性能，FPS 从 12 提升到 58。”

---

如需我帮你 **生成 PDF 版**、**补充 Vue Router / Vite / SSR 深度问题**，或 **模拟面试问答**，欢迎继续提问！


# Vue.js 专家级面试题全集

> 🎯 适用于高级前端、技术专家、架构师  
> 📅 更新：2025 年 4 月  
> 📚 覆盖原理、源码、性能、编译、TS、SSR、架构设计

---

## 1. Vue 核心原理

### 1.1 响应式系统（Vue 2 vs Vue 3）

| 维度 | Vue 2 | Vue 3 |
|------|-------|-------|
| 实现方式 | `Object.defineProperty` | `Proxy` |
| 数组监听 | 不完全（需 `$set`） | 完全支持 |
| 新增属性 | 无法监听 | 可监听 |
| 性能 | 递归劫持，开销大 | 惰性代理，更高效 |

### 1.2 手写简化版 reactive + effect

```js
const targetMap = new WeakMap();
let activeEffect = null;

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return typeof result === 'object' ? reactive(result) : result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return result;
    }
  });
}

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) dep.forEach(effect => effect());
}

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn;
    fn();
    activeEffect = null;
  };
  effectFn();
  return effectFn;
}

2. 虚拟 DOM 与 Diff 算法
2.1 双端 Diff 算法示例
function diff(oldChildren, newChildren, parent) {
  let oldStart = 0, newStart = 0;
  let oldEnd = oldChildren.length - 1;
  let newEnd = newChildren.length - 1;

  while (oldStart <= oldEnd && newStart <= newEnd) {
    if (sameVNodeType(oldChildren[oldStart], newChildren[newStart])) {
      patch(oldChildren[oldStart], newChildren[newStart]);
      oldStart++; newStart++;
    } else if (sameVNodeType(oldChildren[oldEnd], newChildren[newEnd])) {
      patch(oldChildren[oldEnd], newChildren[newEnd]);
      oldEnd--; newEnd--;
    } else {
      // 头尾、尾头比对...
    }
  }
}

3. Vue 3 新特性
3.1 ref 在模板中为何不用 .value？
编译器在生成 render 函数时自动解包 ref。 
<!-- 模板 -->
<div>{{ count }}</div>

<!-- 编译后 -->
render() {
  return createVNode("div", null, String(count.value));
}

5 Composition API 高阶
5.1 useEventListener 实现

export function useEventListener(target, event, handler, options?) {
  const cleanup = ref<() => void>();

  watchEffect(onInvalidate => {
    const el = unrefElement(target);
    if (!el) return;

    el.addEventListener(event, handler, options);
    onInvalidate(() => el.removeEventListener(event, handler, options));

    cleanup.value = () => el.removeEventListener(event, handler, options);
  });

  return cleanup;
}

6. 性能优化
6.1 shallowReactive 使用场景
// 大型不可变嵌套结构
const schema = shallowReactive({
  fields: [/* 1000+ items */]
});

12. 高频面试题汇总
Q1: Vue 3 为什么用 Proxy？
答：支持数组索引监听、对象属性增删、性能更好、无需递归劫持。 

Q2: 如何实现 computed？
答：基于 effect + lazy + scheduler + dirty 标志实现缓存与自动更新。 

Q3: nextTick 原理？
答：利用 Promise.then 或 MutationObserver 将回调推入微任务队列，等待同步任务执行完后统一刷新。 

Q4: 如何设计一个响应式系统？
答：Proxy + WeakMap + effect + track + trigger + scheduler，支持嵌套与 cleanup。 