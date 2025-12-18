import { ListNode } from '../types';
import { createNode } from './listNode';

/**
 * 合并两个有序链表
 * LeetCode 21. Merge Two Sorted Lists
 * 
 * 将两个升序链表合并为一个新的升序链表并返回。
 * 新链表是通过拼接给定的两个链表的所有节点组成的。
 */
export function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // 创建哨兵节点
  const dummy = createNode(-1);
  dummy.id = 'dummy';
  let current = dummy;
  
  // 遍历两个链表，比较节点值
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  // 连接剩余节点
  if (l1 !== null) {
    current.next = l1;
  } else {
    current.next = l2;
  }
  
  return dummy.next;
}
