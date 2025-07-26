# wujie 微前端框架原理

wujie 是基于 Web Components + iframe 的微前端框架，通过 iframe 实现应用隔离，通过 Web Components 实现应用通信。

## 核心原理

### 1. iframe 隔离机制
- 为每个子应用创建独立的 iframe 环境
- 通过 iframe 实现 JS、CSS、DOM 的完全隔离
- 避免应用间的相互污染

### 2. 实现流程
```js
// 1. 创建新的 iframe
const iframe = document.createElement('iframe');

// 2. 设置 iframe 属性
iframe.src = '主应用域名'; // 同源状态下的状态共享
iframe.style.display = 'none';

// 3. 插入到 body 中
document.body.appendChild(iframe);

// 4. 停止 iframe 加载
stopIframeLoading(iframe);
```

## 关键技术点

### 1. 同源 iframe 设计
**为什么子应用的 iframe 地址和主应用一样？**

- **目的**：解决 iframe 之间的通信问题
- **原理**：同源状态下可以共享 localStorage、sessionStorage 等状态
- **实现**：主应用域名为 a.com，子应用 iframe 的 src 也指向 a.com
- **资源加载**：子应用的 JS、CSS 资源在别的域名下（如 b.com）

### 2. 跨域处理
**开发环境**：
```js
// vue.config.js
module.exports = {
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
}
```

**生产环境**：
```nginx
# nginx 配置
add_header Access-Control-Allow-Origin "主应用域名";
```

### 3. 停止 iframe 加载
**为什么要调用 stopIframeLoading 函数？**

- **问题**：iframe 会执行主应用的代码，造成变量污染
- **解决**：通过判断 `iframeWindow.document` 是否存在，调用 `iframeWindow.stop()` 停止加载
- **效果**：只保留空的 iframe 环境，不执行主应用代码

## 常见问题与解决方案

### 问题：下拉选择等定位不准

**原因**：
- wujie 将 DOM 元素放在子应用的 shadow DOM 中
- 弹窗的 `position: fixed` 是相对于整个窗口定位
- 导致偏移位置正好是主应用占据的距离

**解决方案**：
```css
/* 修改定位为 absolute */
.el-popper {
  position: absolute !important;
}

.el-tooltip_popper {
  position: absolute !important;
}
```

## 优势特点

1. **完全隔离**：通过 iframe 实现应用间的完全隔离
2. **通信简单**：基于 Web Components 的通信机制
3. **兼容性好**：支持所有现代浏览器
4. **性能优秀**：iframe 隔离性能开销小

## 总结

wujie 通过 iframe + Web Components 的组合，实现了简单高效的微前端架构，特别适合需要强隔离性的场景。
