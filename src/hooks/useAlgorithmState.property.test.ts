import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { navigateStep, togglePlay } from './useAlgorithmState';

/**
 * **Feature: leetcode-21-visualization, Property 1: Step Navigation Consistency**
 * **Validates: Requirements 4.1, 4.2**
 * 
 * For any current step index and navigation action (previous/next), the resulting step index 
 * SHALL be within valid bounds [0, totalSteps-1] and change by exactly 1 in the expected 
 * direction (or remain unchanged at boundaries).
 */
describe('Property 1: Step Navigation Consistency', () => {
  it('navigating next increases step by 1 or stays at max', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        (currentStep, totalSteps) => {
          // 确保 currentStep 在有效范围内
          const validCurrentStep = Math.min(currentStep, totalSteps - 1);
          
          const newStep = navigateStep(validCurrentStep, totalSteps, 'next');
          
          // 结果应该在有效范围内
          expect(newStep).toBeGreaterThanOrEqual(0);
          expect(newStep).toBeLessThan(totalSteps);
          
          // 如果不在边界，应该增加 1
          if (validCurrentStep < totalSteps - 1) {
            expect(newStep).toBe(validCurrentStep + 1);
          } else {
            // 在边界时保持不变
            expect(newStep).toBe(validCurrentStep);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('navigating previous decreases step by 1 or stays at 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        (currentStep, totalSteps) => {
          const validCurrentStep = Math.min(currentStep, totalSteps - 1);
          
          const newStep = navigateStep(validCurrentStep, totalSteps, 'previous');
          
          // 结果应该在有效范围内
          expect(newStep).toBeGreaterThanOrEqual(0);
          expect(newStep).toBeLessThan(totalSteps);
          
          // 如果不在边界，应该减少 1
          if (validCurrentStep > 0) {
            expect(newStep).toBe(validCurrentStep - 1);
          } else {
            // 在边界时保持不变
            expect(newStep).toBe(0);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('step always stays within bounds after any navigation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        fc.oneof(fc.constant('next' as const), fc.constant('previous' as const)),
        (currentStep, totalSteps, direction) => {
          const validCurrentStep = Math.min(currentStep, totalSteps - 1);
          
          const newStep = navigateStep(validCurrentStep, totalSteps, direction);
          
          expect(newStep).toBeGreaterThanOrEqual(0);
          expect(newStep).toBeLessThanOrEqual(totalSteps - 1);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: leetcode-21-visualization, Property 2: Play/Pause Toggle Round-Trip**
 * **Validates: Requirements 4.3**
 * 
 * For any play state, toggling play/pause twice SHALL return to the original state.
 */
describe('Property 2: Play/Pause Toggle Round-Trip', () => {
  it('toggling twice returns to original state', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (initialState) => {
          const afterFirstToggle = togglePlay(initialState);
          const afterSecondToggle = togglePlay(afterFirstToggle);
          
          expect(afterSecondToggle).toBe(initialState);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('single toggle inverts the state', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (initialState) => {
          const afterToggle = togglePlay(initialState);
          
          expect(afterToggle).toBe(!initialState);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
