// 简易 watch 实现
import { observe } from "../reactive.js";
import { watch } from "./watch.js";

const state = { a: 1 };
observe(state);

watch(state, "a", (newVal, oldVal) => {
  console.log("a变化了", oldVal, "=>", newVal);
});

state.a = 2; // 控制台输出：a变化了 1 => 2