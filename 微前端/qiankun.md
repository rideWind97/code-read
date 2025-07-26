# qiankun 微前端框架实现原理

qiankun 是蚂蚁金服开源的一款基于 single-spa 的微前端实现库，用于构建大型微前端应用。

## 核心原理

### 1. 应用注册与加载
- 主应用通过 `registerMicroApps` 注册子应用
- 子应用通过 `start` 启动，实现应用间的隔离和通信
- 支持多种框架（React、Vue、Angular 等）

### 2. 沙箱隔离
- **JS 沙箱**：通过 Proxy 代理 window 对象，隔离全局变量
- **CSS 沙箱**：动态添加/移除样式，避免样式冲突
- **DOM 沙箱**：隔离 DOM 操作，防止相互影响

### 3. 应用通信
- **全局状态管理**：通过 `initGlobalState` 实现应用间状态共享
- **事件通信**：支持应用间的事件发布订阅
- **Props 传递**：主应用向子应用传递数据

### 4. 资源加载
- 支持子应用的 JS、CSS 资源动态加载
- 实现资源预加载，提升用户体验
- 支持子应用的独立部署和版本管理

## 核心技术：import-html-entry + JS 沙箱隔离

### import-html-entry 原理

#### 作用
- 解析 HTML 文件，提取其中的 JS、CSS 资源
- 动态加载这些资源，实现子应用的按需加载

#### 核心流程
```js
// 1. 获取 HTML 内容
const html = await fetch('http://sub-app.com/index.html').then(res => res.text());

// 2. 解析 HTML，提取资源
const { scripts, styles, entry } = importEntry(html);

// 3. 动态加载 CSS
styles.forEach(style => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = style;
  document.head.appendChild(link);
});

// 4. 动态执行 JS
scripts.forEach(script => {
  const scriptElement = document.createElement('script');
  scriptElement.src = script;
  document.head.appendChild(scriptElement);
});
```

### JS 沙箱隔离实现

#### Proxy 代理机制
```js
class ProxySandbox {
  constructor() {
    const fakeWindow = {};
    const proxy = new Proxy(fakeWindow, {
      get: (target, key) => {
        // 优先返回沙箱内的值，否则返回真实 window 的值
        return target[key] || window[key];
      },
      set: (target, key, value) => {
        // 所有修改都记录在沙箱内，不影响真实 window
        target[key] = value;
        return true;
      }
    });
    
    this.proxy = proxy;
  }
  
  activate() {
    // 激活沙箱，将 proxy 赋值给全局变量
    window.proxyWindow = this.proxy;
  }
  
  deactivate() {
    // 停用沙箱
    delete window.proxyWindow;
  }
}
```

#### 沙箱切换
```js
// 子应用 A 运行时
sandboxA.activate();
// 此时子应用 A 的所有全局变量修改都在沙箱 A 内

// 切换到子应用 B
sandboxA.deactivate();
sandboxB.activate();
// 子应用 B 有自己的沙箱环境
```

### 完整工作流程

1. **HTML 解析**：import-html-entry 解析子应用的 HTML 文件
2. **资源提取**：提取 JS、CSS 资源链接
3. **沙箱创建**：为子应用创建独立的 JS 沙箱环境
4. **资源加载**：在沙箱环境下加载和执行 JS、CSS
5. **应用渲染**：子应用在隔离环境中运行
6. **沙箱切换**：应用切换时，切换对应的沙箱环境

## 主要特性

1. **基于 single-spa**：继承 single-spa 的生态和特性
2. **HTML Entry**：支持子应用以 HTML 形式接入
3. **沙箱隔离**：完善的 JS、CSS、DOM 隔离机制
4. **预加载**：支持子应用预加载，提升性能
5. **全局状态**：内置全局状态管理
6. **通信机制**：完善的应用间通信方案

## 工作流程

1. **注册阶段**：主应用注册子应用配置
2. **启动阶段**：调用 `start()` 启动微前端框架
3. **路由匹配**：根据当前路由匹配对应的子应用
4. **加载阶段**：动态加载子应用的资源
5. **渲染阶段**：在指定容器中渲染子应用
6. **通信阶段**：处理应用间的状态同步和事件通信

## 优势

- **资源隔离**：每个子应用有独立的资源加载环境
- **全局变量隔离**：通过 Proxy 实现全局变量的完全隔离
- **样式隔离**：CSS 资源独立加载，避免样式冲突
- **按需加载**：只加载当前需要的子应用资源

## 总结

qiankun 通过 import-html-entry 实现资源动态加载，通过 JS 沙箱隔离实现应用间环境隔离，这种设计让多个独立的应用能够在同一个页面中安全运行，是微前端架构的核心技术基础。