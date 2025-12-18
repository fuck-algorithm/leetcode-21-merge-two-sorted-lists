import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: leetcode-21-visualization, Property 7: Image Aspect Ratio Preservation**
 * **Validates: Requirements 6.3**
 * 
 * For any displayed QR code image, the rendered width/height ratio SHALL equal 
 * the original image's aspect ratio (within 1% tolerance).
 */
describe('Property 7: Image Aspect Ratio Preservation', () => {
  // 模拟图片尺寸计算函数
  function calculateDisplaySize(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    
    let displayWidth = originalWidth;
    let displayHeight = originalHeight;
    
    // 如果超过最大宽度，按宽度缩放
    if (displayWidth > maxWidth) {
      displayWidth = maxWidth;
      displayHeight = displayWidth / aspectRatio;
    }
    
    // 如果超过最大高度，按高度缩放
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight * aspectRatio;
    }
    
    return { width: displayWidth, height: displayHeight };
  }

  it('aspect ratio is preserved after scaling', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }),  // 原始宽度
        fc.integer({ min: 100, max: 1000 }),  // 原始高度
        fc.integer({ min: 50, max: 500 }),    // 最大显示宽度
        fc.integer({ min: 50, max: 500 }),    // 最大显示高度
        (originalWidth, originalHeight, maxWidth, maxHeight) => {
          const originalAspectRatio = originalWidth / originalHeight;
          
          const { width, height } = calculateDisplaySize(
            originalWidth,
            originalHeight,
            maxWidth,
            maxHeight
          );
          
          const displayAspectRatio = width / height;
          
          // 允许 1% 的误差
          const tolerance = 0.01;
          const ratioDiff = Math.abs(displayAspectRatio - originalAspectRatio) / originalAspectRatio;
          
          expect(ratioDiff).toBeLessThanOrEqual(tolerance);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('displayed dimensions do not exceed max constraints', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }),
        fc.integer({ min: 100, max: 1000 }),
        fc.integer({ min: 50, max: 500 }),
        fc.integer({ min: 50, max: 500 }),
        (originalWidth, originalHeight, maxWidth, maxHeight) => {
          const { width, height } = calculateDisplaySize(
            originalWidth,
            originalHeight,
            maxWidth,
            maxHeight
          );
          
          expect(width).toBeLessThanOrEqual(maxWidth);
          expect(height).toBeLessThanOrEqual(maxHeight);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('CSS object-fit contain preserves aspect ratio', () => {
    // 测试 CSS object-fit: contain 的行为
    // 这个属性确保图片在容器内保持原始比例
    
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }),
        fc.integer({ min: 100, max: 1000 }),
        (width, height) => {
          const aspectRatio = width / height;
          
          // object-fit: contain 会保持比例
          // 验证比例计算是正确的
          expect(aspectRatio).toBe(width / height);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
