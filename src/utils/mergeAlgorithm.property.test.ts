import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { mergeTwoLists } from './mergeAlgorithm';
import { arrayToList, listToArray, resetNodeIdCounter } from './listNode';

/**
 * **Feature: leetcode-21-visualization, Property 6: Merge Result Correctness**
 * **Validates: Requirements 5.4**
 * 
 * For any two sorted input arrays l1 and l2, the final merged result SHALL be 
 * a sorted array containing all elements from both inputs.
 */
describe('Property 6: Merge Result Correctness', () => {
  it('merged result contains all elements from both inputs in sorted order', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 }),
        (arr1, arr2) => {
          resetNodeIdCounter();
          
          // 对输入数组排序（模拟有序链表）
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          // 转换为链表
          const l1 = arrayToList(sorted1, 'l1');
          const l2 = arrayToList(sorted2, 'l2');
          
          // 执行合并
          const merged = mergeTwoLists(l1, l2);
          
          // 转换回数组
          const result = listToArray(merged);
          
          // 期望结果：两个数组合并后排序
          const expected = [...sorted1, ...sorted2].sort((a, b) => a - b);
          
          // 验证结果
          expect(result).toEqual(expected);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('merged result preserves all elements (length property)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 }),
        (arr1, arr2) => {
          resetNodeIdCounter();
          
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const l1 = arrayToList(sorted1, 'l1');
          const l2 = arrayToList(sorted2, 'l2');
          
          const merged = mergeTwoLists(l1, l2);
          const result = listToArray(merged);
          
          // 合并后的长度应该等于两个输入的长度之和
          expect(result.length).toBe(arr1.length + arr2.length);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('merged result is sorted in non-decreasing order', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 }),
        (arr1, arr2) => {
          resetNodeIdCounter();
          
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const l1 = arrayToList(sorted1, 'l1');
          const l2 = arrayToList(sorted2, 'l2');
          
          const merged = mergeTwoLists(l1, l2);
          const result = listToArray(merged);
          
          // 验证结果是有序的
          for (let i = 1; i < result.length; i++) {
            expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
