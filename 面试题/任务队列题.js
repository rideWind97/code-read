// 我想实现一段逻辑，要求如下：
// 1、我有多个任务tasks，但是主队列同时最多只能执行n个任务
// 2、主队列执行完成后，会从等待队列中取出下一个任务执行
// 用js实现一下

// 我想实现一段逻辑，要求如下：
// 1、我有多个任务tasks，但是主队列同时最多只能执行n个任务
// 2、主队列执行完成后，会从等待队列中取出下一个任务执行
// 用js实现一下

class TaskQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent; // 最大并发数
    this.running = 0; // 当前正在运行的任务数
    this.waiting = []; // 等待队列
    this.active = []; // 活跃任务队列
  }

  // 添加任务到队列
  add(task) {
    if (this.running < this.maxConcurrent) {
      // 如果还有空闲位置，直接执行
      this.runTask(task);
    } else {
      // 否则加入等待队列
      this.waiting.push(task);
    }
  }

  // 执行任务
  async runTask(task) {
    this.running++;
    this.active.push(task);

    try {
      await task();
      console.log("任务完成");
    } catch (error) {
      console.error("任务执行出错:", error);
    } finally {
      this.running--;
      this.removeFromActive(task);

      // 任务完成后，从等待队列取出下一个任务
      if (this.waiting.length > 0) {
        const nextTask = this.waiting.shift();
        this.runTask(nextTask);
      }
    }
  }

  // 从活跃队列中移除任务
  removeFromActive(task) {
    const index = this.active.indexOf(task);
    if (index > -1) {
      this.active.splice(index, 1);
    }
  }

  // 获取当前状态
  getStatus() {
    return {
      running: this.running,
      waiting: this.waiting.length,
      active: this.active.length,
    };
  }
}

// 创建测试任务
const createTask = (id, delay) => {
  return () =>
    new Promise((resolve) => {
      console.log(`开始执行任务 ${id}`);
      setTimeout(() => {
        console.log(`任务 ${id} 完成`);
        resolve();
      }, delay);
    });
};
ƒ;
const taskQueue = new TaskQueue(3); // 最多同时执行3个任务

// 添加任务
taskQueue.add(createTask(1, 2000));
taskQueue.add(createTask(2, 1500));
taskQueue.add(createTask(3, 1000));
taskQueue.add(createTask(4, 3000));
taskQueue.add(createTask(5, 2500));
taskQueue.add(createTask(6, 1800));
