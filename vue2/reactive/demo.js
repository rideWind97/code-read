import { observe, Watcher } from "./reactive.js";

// 创建一个普通对象
const data = { count: 0 };

// 让对象变为响应式
observe(data);

// 创建一个Watcher，监听count属性变化
new Watcher(data, "count", (val) => {
  console.log("count变化了:", val);
});

// 修改数据，触发响应
data.count = 1; // 控制台输出：count变化了: 1
data.count = 2; // 控制台输出：count变化了: 2
