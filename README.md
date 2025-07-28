# code-read

本仓库用于解读主流前端框架（Vue2、Vue3、React）核心原理，并用简洁代码实现其关键机制。每个实现均配有详细中文说明和流程图，帮助你快速理解源码思想，适合前端进阶和面试准备。

## 📚 目录结构

### Vue2 核心原理
- `vue2/reactive/`
  - `reactive.js` - Vue2响应式核心实现
  - `reactive.md` - 详细原理说明与流程图
  - `demo.js` - 响应式系统使用示例
- `vue2/computed and watch/`
  - `computed.js` - 计算属性computed的简易实现，支持函数和对象两种写法
  - `watch.js` - 侦听器watch的简易实现
  - `readme.md` - computed和watch使用说明
- `vue2/diff/`
  - `diff.md` - Vue2虚拟DOM diff算法原理详解

### Vue3 核心原理
- `vue3/`
  - `vue3.md` - Vue3新特性与核心变化
  - `diff.md` - Vue3虚拟DOM diff算法优化
  - `vapor` - Vue3编译优化相关内容

### React 核心原理
- `react/`
  - `fiber` - React Fiber架构实现
  - `diff.md` - React虚拟DOM diff算法
  - `合成事件.md` - React事件系统原理
  - `批处理.md` - React批处理机制详解
  - `时间切片.md` - React时间切片实现
  - `如何知道函数执行时间是否足够.md` - React性能优化相关

### 微前端技术
- `微前端/`
  - `qiankun.md` - 乾坤微前端框架详解
  - `wujie.md` - 无界微前端框架详解

### 面试题与进阶
- `vue深入面试题.md` - Vue相关深度面试题
- `react深入面试题.md` - React相关深度面试题
- `react专家级面试题.md` - React专家级面试题
- `Vuex和Pinia介绍一下，有什么区别.md` - 状态管理对比

### 其他技术文档
- `ES6` - ES6语法特性总结
- `设计模式.md` - 前端常用设计模式详解
- `算法题.md` - 前端算法题集锦
- `package.json中的常见键名` - npm包配置详解
- `MCP.md` - Model Context Protocol相关

## 🎯 推荐学习方式

1. **循序渐进**：先阅读源码实现，再结合对应md文档理解原理
2. **对比学习**：对比vue2、vue3、react在响应式、依赖收集、虚拟DOM等方面的异同
3. **实践结合**：运行demo代码，修改参数观察效果
4. **面试准备**：结合面试题文档，检验理解程度

## 🚀 快速开始

```bash
# 克隆仓库
git clone [repository-url]

# 进入对应目录学习
cd vue2/reactive
node demo.js  # 运行响应式示例
```

## 📖 学习路径建议

1. **Vue2基础**：reactive → computed/watch → diff
2. **Vue3进阶**：vue3.md → diff.md → vapor
3. **React深入**：fiber → 合成事件 → 批处理 → 时间切片
4. **微前端扩展**：qiankun → wujie
5. **面试准备**：各框架面试题 → 设计模式 → 算法题

## 🤝 贡献指南

欢迎补充更多核心机制的简易实现，建议：
- 保持代码简洁易懂
- 提供详细的中文注释
- 配套原理说明文档
- 包含使用示例

## 📝 更新日志

- 完善Vue2响应式系统实现
- 添加React核心机制解析
- 补充微前端技术文档
- 整理面试题与进阶内容