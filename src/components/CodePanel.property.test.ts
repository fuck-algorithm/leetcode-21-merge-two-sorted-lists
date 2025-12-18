import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateSteps, CODE_LINES } from '../utils/stepGenerator';

/**
 * **Feature: leetcode-21-visualization, Property 3: Code Line Highlighting Consistency**
 * **Validates: Requirements 3.2**
 * 
 * For any algorithm step, the highlighted line number in the Code Panel SHALL match 
 * the `currentLine` value in the step's state.
 */
describe('Property 3: Code Line Highlighting Consistency', () => {
  it('currentLine is always within valid code line bounds', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          
          // 验证每个步骤的 currentLine 都在有效范围内
          for (const step of steps) {
            expect(step.currentLine).toBeGreaterThanOrEqual(0);
            expect(step.currentLine).toBeLessThan(CODE_LINES.length);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each step has a valid currentLine that corresponds to meaningful code', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          
          // 验证每个步骤都有有效的行号
          for (const step of steps) {
            const line = CODE_LINES[step.currentLine];
            expect(line).toBeDefined();
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: leetcode-21-visualization, Property 4: Variable Display Completeness**
 * **Validates: Requirements 3.3**
 * 
 * For any algorithm step with variables, all variables in the step's `variables` array 
 * SHALL be displayed with their correct values at their corresponding line positions.
 */
describe('Property 4: Variable Display Completeness', () => {
  it('all variables have valid line numbers within code bounds', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 10 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          
          for (const step of steps) {
            for (const variable of step.variables) {
              expect(variable.line).toBeGreaterThanOrEqual(0);
              expect(variable.line).toBeLessThan(CODE_LINES.length);
              expect(variable.name).toBeTruthy();
              expect(variable.value).toBeDefined();
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('variables have non-empty names and defined values', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 5 }),
        (arr1, arr2) => {
          const sorted1 = [...arr1].sort((a, b) => a - b);
          const sorted2 = [...arr2].sort((a, b) => a - b);
          
          const steps = generateSteps(sorted1, sorted2);
          
          for (const step of steps) {
            for (const variable of step.variables) {
              expect(variable.name.length).toBeGreaterThan(0);
              expect(typeof variable.value).toBe('string');
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
