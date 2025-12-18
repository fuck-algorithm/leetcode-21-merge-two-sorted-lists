import { useState, useCallback, useEffect, useRef } from 'react';
import { AlgorithmStep } from '../types';
import { generateSteps } from '../utils/stepGenerator';

interface UseAlgorithmStateReturn {
  currentStep: number;
  isPlaying: boolean;
  steps: AlgorithmStep[];
  currentStepData: AlgorithmStep | null;
  goToNext: () => void;
  goToPrevious: () => void;
  togglePlayPause: () => void;
  reset: () => void;
  setInputArrays: (l1: number[], l2: number[]) => void;
  seekTo: (step: number) => void;
}

export function useAlgorithmState(
  initialL1: number[] = [1, 2, 4],
  initialL2: number[] = [1, 3, 4]
): UseAlgorithmStateReturn {
  const [l1, setL1] = useState(initialL1);
  const [l2, setL2] = useState(initialL2);
  const [steps, setSteps] = useState<AlgorithmStep[]>(() => generateSteps(initialL1, initialL2));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<number | null>(null);

  // 生成步骤
  useEffect(() => {
    const newSteps = generateSteps(l1, l2);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [l1, l2]);

  // 自动播放
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = window.setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, steps.length]);

  const goToNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const goToPrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const setInputArrays = useCallback((newL1: number[], newL2: number[]) => {
    setL1(newL1);
    setL2(newL2);
  }, []);

  const seekTo = useCallback((step: number) => {
    const clampedStep = Math.max(0, Math.min(step, steps.length - 1));
    setCurrentStep(clampedStep);
  }, [steps.length]);

  return {
    currentStep,
    isPlaying,
    steps,
    currentStepData: steps[currentStep] || null,
    goToNext,
    goToPrevious,
    togglePlayPause,
    reset,
    setInputArrays,
    seekTo
  };
}

// 导出用于测试的纯函数
export function navigateStep(
  currentStep: number,
  totalSteps: number,
  direction: 'next' | 'previous'
): number {
  if (direction === 'next') {
    return Math.min(currentStep + 1, totalSteps - 1);
  } else {
    return Math.max(currentStep - 1, 0);
  }
}

export function togglePlay(isPlaying: boolean): boolean {
  return !isPlaying;
}
