// Max Heap for Skill Gap Priority

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  // Add a skill
  insert(skill) {
    this.heap.push(skill);
    this.heapifyUp();
  }

  // Move new element upward
  heapifyUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor(
        (index - 1) / 2
      );

      if (
        this.heap[parentIndex].priority >=
        this.heap[index].priority
      ) {
        break;
      }

      [
        this.heap[parentIndex],
        this.heap[index],
      ] = [
        this.heap[index],
        this.heap[parentIndex],
      ];

      index = parentIndex;
    }
  }

  // Remove highest priority skill
  extractMax() {
    if (this.heap.length === 0) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const max = this.heap[0];

    this.heap[0] = this.heap.pop();

    this.heapifyDown();

    return max;
  }

  // Move root element downward
  heapifyDown() {
    let index = 0;

    while (true) {
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;

      let largestIndex = index;

      if (
        leftIndex < this.heap.length &&
        this.heap[leftIndex].priority >
          this.heap[largestIndex].priority
      ) {
        largestIndex = leftIndex;
      }

      if (
        rightIndex < this.heap.length &&
        this.heap[rightIndex].priority >
          this.heap[largestIndex].priority
      ) {
        largestIndex = rightIndex;
      }

      if (largestIndex === index) {
        break;
      }

      [
        this.heap[index],
        this.heap[largestIndex],
      ] = [
        this.heap[largestIndex],
        this.heap[index],
      ];

      index = largestIndex;
    }
  }

  // Get all skills by priority
  getPrioritySkills() {
    const result = [];
    const tempHeap = new MaxHeap();

    tempHeap.heap = [...this.heap];

    while (tempHeap.heap.length > 0) {
      result.push(tempHeap.extractMax());
    }

    return result;
  }
}

module.exports = MaxHeap;