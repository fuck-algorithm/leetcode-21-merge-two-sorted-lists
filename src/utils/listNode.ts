import { ListNode } from '../types';

let nodeIdCounter = 0;

/**
 * 创建一个新的链表节点
 */
export function createNode(val: number, next: ListNode | null = null): ListNode {
  return {
    val,
    next,
    id: `node-${nodeIdCounter++}`,
  };
}

/**
 * 重置节点ID计数器（用于测试）
 */
export function resetNodeIdCounter(): void {
  nodeIdCounter = 0;
}

/**
 * 将数组转换为链表
 */
export function arrayToList(arr: number[], prefix: string = 'node'): ListNode | null {
  if (arr.length === 0) return null;
  
  const head = createNode(arr[0]);
  head.id = `${prefix}-0`;
  let current = head;
  
  for (let i = 1; i < arr.length; i++) {
    const newNode = createNode(arr[i]);
    newNode.id = `${prefix}-${i}`;
    current.next = newNode;
    current = newNode;
  }
  
  return head;
}

/**
 * 将链表转换为数组
 */
export function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  
  return result;
}

/**
 * 深拷贝链表
 */
export function cloneList(head: ListNode | null): ListNode | null {
  if (head === null) return null;
  
  const newHead = createNode(head.val);
  newHead.id = head.id;
  let current = head.next;
  let newCurrent = newHead;
  
  while (current !== null) {
    const newNode = createNode(current.val);
    newNode.id = current.id;
    newCurrent.next = newNode;
    newCurrent = newNode;
    current = current.next;
  }
  
  return newHead;
}

/**
 * 获取链表长度
 */
export function getListLength(head: ListNode | null): number {
  let length = 0;
  let current = head;
  
  while (current !== null) {
    length++;
    current = current.next;
  }
  
  return length;
}

/**
 * 获取链表中指定索引的节点
 */
export function getNodeAtIndex(head: ListNode | null, index: number): ListNode | null {
  let current = head;
  let i = 0;
  
  while (current !== null && i < index) {
    current = current.next;
    i++;
  }
  
  return current;
}
