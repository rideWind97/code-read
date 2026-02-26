# React Fiber 详解

Fiber 是 React 16 引入的核心架构，用来重写协调（Reconciliation）过程。  
目标不是“让 React 变异步”这么简单，而是让渲染变成 **可调度、可中断、可恢复、可分优先级** 的工作流。

---

## 1. 为什么需要 Fiber

React 15 时代，更新基本是“递归 + 同步一把梭”：

- 一旦开始渲染，大任务会长时间占用主线程
- 无法在中途让出控制权给输入、动画、滚动
- 复杂页面更新时容易掉帧、卡顿

Fiber 的出现就是为了解决这个问题：  
把大任务拆成小任务，做一段停一段，让浏览器有机会处理更紧急的事情。

---

## 2. Fiber 的本质是什么

Fiber 既是“架构”，也是“数据结构”：

- 每个 React 元素都会对应一个 Fiber 节点
- Fiber 节点通过链表指针连接，便于暂停和恢复遍历
- 每个节点都带有“任务信息”和“调度信息”

常见字段（概念级）：

- `type` / `key`: 组件类型与身份标识
- `pendingProps` / `memoizedProps`: 新旧 props
- `memoizedState`: 当前状态
- `child` / `sibling` / `return`: 子、兄弟、父指针
- `alternate`: 指向另一棵树上的对应节点（双缓存关键）
- `flags` / `subtreeFlags`: 记录副作用（插入、更新、删除等）
- `lanes`: 当前节点涉及的优先级信息

---

## 3. 双缓存 Fiber 树（current / workInProgress）

Fiber 最重要的设计之一是“双树切换”：

- `current` 树：当前屏幕上已经显示的 UI
- `workInProgress` 树：本轮正在计算的新 UI

更新时，React 基于 current 创建或复用 workInProgress（通过 `alternate` 关联）。  
当 render 阶段完成后，在 commit 阶段一次性切换根指针，UI 就完成更新。

这带来两个好处：

- render 阶段可反复中断、重试，不影响已显示界面
- commit 时机集中，DOM 变更更可控

---

## 4. 两大阶段：Render vs Commit

### Render（调和）阶段

- 目标：找出哪些地方要变
- 特点：可中断、可恢复、可被高优任务打断
- 产物：带有 flags 的 workInProgress 树

### Commit（提交）阶段

- 目标：把 render 结果真正应用到宿主环境（DOM）
- 特点：同步、不可中断、执行很快
- 包含：DOM 变更、ref 处理、layout/effect 生命周期触发

一句话：  
**Render 负责“算”，Commit 负责“改”。**

---

## 5. 可中断与恢复是怎么做到的

Fiber 把遍历拆成一个个最小工作单元（unit of work）：

- 每处理完一个 Fiber，都会检查是否该让出主线程
- 若时间片用完或有更高优先级任务，先暂停
- 下次从中断点继续，而不是重头开始

在浏览器里，调度通常由 Scheduler + `MessageChannel` 驱动，  
通过 `performance.now()` 判断本轮预算是否用完（例如约 5ms）。

---

## 6. 优先级调度（Lane 模型）

React 18 里常用 Lane（车道）表达优先级：

- 不同更新会进入不同 lanes（如离散输入、过渡更新等）
- 调度器总是优先处理更紧急的 lanes
- 低优更新可延后，高优更新可插队

典型直觉：

- 点击输入（高优） > 列表大计算（低优）
- `startTransition` 可以把“可稍后完成”的更新降为过渡优先级

这就是“同一次交互感觉很跟手，但复杂内容稍后补齐”的基础。

---

## 7. Fiber 与 Diff 的关系

你可以这样理解两者分工：

- Diff（Reconciliation 策略）回答：哪些节点复用、插入、删除、移动
- Fiber（执行框架）回答：这些比较任务如何被分片、调度、暂停、恢复

所以 Fiber 不是替代 diff，而是给 diff 提供了更强的执行模型。

---

## 8. Fiber 与批处理、时间切片、合成事件的关系

- **批处理**：多个更新先合并，再进入调度与渲染流程
- **时间切片**：render 阶段按时间预算分段执行
- **合成事件**：事件是高频更新入口，更新会进入 Fiber 调度系统

把这几篇串起来就是：

**事件触发更新 -> 批处理归并 -> Fiber render（可中断）-> commit（同步落地）**

---

## 9. 常见误区

- “Fiber = 虚拟 DOM”  
  不准确。Fiber 是 VDOM 对应节点的增强执行单元和调度基础设施。

- “有 Fiber 就完全异步了”  
  不准确。只有 render 可中断；commit 仍然是同步的。

- “有 key 就不会重渲染”  
  不准确。key 主要用于身份识别和复用，不等于跳过 render。

---

## 10. 相关 API（和 Fiber 的联系）

- `startTransition`: 标记低优先级过渡更新
- `useDeferredValue`: 把某些值的更新延后，让高优交互先响应
- `Suspense`: 允许某部分 UI 等待异步结果并协调展示
- `useSyncExternalStore`: 并发场景下更安全地订阅外部状态

这些能力都依赖 Fiber 的调度与提交模型。

---

## 总结

Fiber 的价值在于把 React 渲染从“同步递归算法”升级为“可调度执行系统”：

- 通过双缓存树保证更新过程可控
- 通过 render/commit 分离实现可中断与稳定提交
- 通过 Lane 优先级保障交互响应性

理解 Fiber 后，你就能更清楚地解释 React 18 里的时间切片、批处理、过渡更新和 Suspense 为什么可行。
