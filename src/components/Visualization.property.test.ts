import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateSteps } from '../utils/stepGenerator';
import { listToArray } from '../utils/listNode';

/**
 * **Feature: leetcode-21-visualization, Property 5: Linked List Visualization State Consistency**
 * **Validates: Requirements 5.1, 5.3**
 * 
 * For any algorithm step, the visualization SHALL correctly render the current state of l1, l2, 
 * and merged lists, with the highlighted node matching `highlightedNodeId`.
 */
describe('Property 5: Linked List Visualization State Consistency', () => {
  it('l1State and l2State preserve original input values', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          
          // 第一步应该包含完整的原始链表
          const firstStep = steps[0];
          
          if (sorted1.length > 0) {
            expect(firstStep.l1State).not.toBeNull();
            expect(listToArray(firstStep.l1State)).toEqual(sorted1);
          }
          
          if (sorted2.length > 0) {
            expect(firstStep.l2State).not.toBeNull();
            expect(listToArray(firstStep.l2State)).toEqual(sorted2);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('merged list grows monotonically through steps', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          
          let prevMergedLength = 0;
          
          for (const step of steps) {
            const currentMergedLength = step.mergedState 
              ? listToArray(step.mergedState).length 
              : 0;
            
            // 合并链表长度应该单调递增或保持不变
            expect(currentMergedLength).toBeGreaterThanOrEqual(prevMergedLength);
            prevMergedLength = currentMergedLength;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('final merged state contains all elements from both inputs', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          const lastStep = steps[steps.length - 1];
          
          const mergedArray = lastStep.mergedState 
            ? listToArray(lastStep.mergedState) 
            : [];
          
          const expected = [...sorted1, ...sorted2].sort((a, b) => a - b);
          
          expect(mergedArray).toEqual(expected);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('highlightedNodeId is null or matches a valid node id', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          
          for (const step of steps) {
            if (step.highlightedNodeId !== null) {
              // 高亮的节点 ID 应该是有效的格式
              expect(step.highlightedNodeId).toMatch(/^(l1|l2|node|dummy)-\d+$/);
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
