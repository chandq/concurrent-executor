[![Node.js CI](https://github.com/chandq/concurrent-executor/actions/workflows/node.js.yml/badge.svg)](https://github.com/chandq/concurrent-executor/actions/workflows/node.js.yml)

[![license:MIT](https://img.shields.io/npm/l/vue.svg?sanitize=true)](https://github.com/chandq/concurrent-executor/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/chandq/concurrent-executor/graph/badge.svg?token=VZ6TERPGI9)](https://codecov.io/gh/chandq/concurrent-executor)

# ConcurrentExecutor

A production-ready concurrent task executor that supports controlled scheduling of synchronous/asynchronous tasks with complete task state management, result collection, and failure control capabilities.

## Quickstart

- Via CDN: `<script src="https://unpkg.com/concurrent-executor"></script>`
- Via npm:

  ```js
  npm i concurrent-executor
  ```

## Core Features

- **Concurrency Control** - Limit the number of concurrent tasks with concurrency option
- **Dynamic Task Addition** - Add tasks with add() and addAllWithMeta()
- **Task Metadata** - Associate business data with tasks via meta field
- **Failure Strategies** - Timeout and retry mechanisms with customizable failure handling
- **Execution Control** - Pause/resume/stop execution with fine-grained control
- **Ordered Results** - Results maintained in task addition order (by index)
- **Exception Handling** - Capture both sync and async errors
- **Cross-Environment** - Works in both browser and Node.js
- **Manual Start** - Support for manual start() trigger when autoStart = false
- **Resource Cleanup** - destroy() method for proper resource cleanup

## Examples

### Basic Usage

```typescript
import { ConcurrentExecutor } from 'concurrent-executor';

const executor = new ConcurrentExecutor<number>({ concurrency: 2 });

// Add synchronous task
executor.add(() => 1);

// Add asynchronous task with metadata
executor.add(
  async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return 2;
  },
  { id: 'async-task' }
);

// Handle completion
executor.onAllComplete = snapshot => {
  console.log(snapshot.results); // [1, 2]
  console.log(snapshot.successCount); // 2
};
```

### Advanced Usage with Timeout and Retry

```typescript
import { ConcurrentExecutor, DefaultFailureStrategy } from './concurrentExecutor';

const executor = new ConcurrentExecutor<string>({
  concurrency: 3,
  timeout: 5000, // 5 seconds timeout
  retry: 2, // retry failed tasks up to 2 times
  failureStrategy: new DefaultFailureStrategy(2),
  onProgress: (task, snapshot) => {
    console.log(`Task ${task.id} progress: ${task.progress * 100}%`);
  },
  onTaskComplete: (task, snapshot) => {
    console.log(`Task ${task.id} completed with status: ${task.status}`);
  }
});

// Add multiple tasks
executor.addAll([
  async () => {
    // Simulate some async work
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'result1';
  },
  () => 'sync-result',
  async () => {
    // This might fail and be retried
    if (Math.random() < 0.5) throw new Error('Random failure');
    return 'success';
  }
]);

// Start execution manually (if autoStart is false)
executor.start();
```

### Task with Progress Reporting

```typescript
const executor = new ConcurrentExecutor<number>({
  concurrency: 1,
  onProgress: (task, snapshot) => {
    console.log(`Task ${task.id} progress: ${task.progress * 100}%`);
  }
});

executor.add(async ctx => {
  // Simulate a task with progress updates
  for (let i = 0; i <= 100; i += 10) {
    ctx.reportProgress(i / 100);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return 42;
});
```

### Execution Control

```typescript
const executor = new ConcurrentExecutor({ concurrency: 2, autoStart: false });

executor.add(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'task1';
});

executor.add(async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return 'task2';
});

// Manually start execution
executor.start();

// Pause execution
setTimeout(() => executor.pause(), 500);

// Resume after a while
setTimeout(() => executor.resume(), 1500);

// Stop all execution
// setTimeout(() => executor.stop(), 3000);
```

## API

### Constructor Options

- concurrency - Number of concurrent tasks (default: 5)
- autoStart - Whether to start execution automatically (default: true)
- timeout - Task timeout in milliseconds
- retry - Number of retry attempts for failed tasks (default: 0)
- failureStrategy - Custom failure handling strategy
- onProgress - Callback for task progress updates
- onTaskComplete - Callback when individual task completes
- onAllComplete - Callback when all tasks complete

### Methods

- add(taskFn, meta?) - Add a single task and return its ID
- addAll(taskFns) - Add multiple tasks
- addAllWithMeta(tasks) - Add multiple tasks with metadata
- pause() - Pause execution
- resume() - Resume execution
- start() - Start execution (if autoStart is false)
- stop() - Stop all execution
- destroy() - Destroy executor and cleanup resources
- snapshot() - Get current execution snapshot
- isDestroyed() - Check if executor is destroyed

### Task Status

- `pending` - Task waiting to be executed
- `running` - Task currently executing
- `success` - Task completed successfully
- `error` - Task failed
- `timeout` - Task timed out
- `stopped` - Task was stopped
- `cancelled` - Task was cancelled

## License

MIT License (c) 2025-present chandq
