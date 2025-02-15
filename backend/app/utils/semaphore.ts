export class Semaphore {
  capacity: number;
  #currentTasks: number;
  #waitingTasks: (() => void)[];

  constructor(capacity: number) {
    this.capacity = capacity;
    this.#currentTasks = 0;
    this.#waitingTasks = [];
  }

  public get currentTasks(): number {
    return this.#currentTasks;
  }

  public async runTask<T>(task: () => Promise<T>): Promise<T> {
    // acquire the semaphore
    await this.acquire();
    try {
      // execute the task
      return await task();
    } finally {
      // don't forget to release
      this.release();
    }
  }

  private acquire(): Promise<void> {
    // if we're under capacity, bump the count and resolve immediately
    if (this.capacity > this.#currentTasks) {
      this.#currentTasks += 1;
      return Promise.resolve();
    }
    // otherwise add ourselves to the queue
    return new Promise((resolve) => this.#waitingTasks.push(resolve));
  }

  private release() {
    // try waking up the next task
    const nextTask = this.#waitingTasks.shift();
    if (nextTask === undefined) {
      // no task in queue, decrement task count
      this.#currentTasks -= 1;
    } else {
      // wake up the task
      nextTask();
    }
  }
}
