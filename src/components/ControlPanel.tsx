import { useEffect, useCallback } from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onReset: () => void;
}

export function ControlPanel({
  isPlaying,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPlayPause,
  onReset
}: ControlPanelProps) {
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 防止在输入框中触发
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        onPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onNext();
        break;
      case ' ':
        e.preventDefault();
        onPlayPause();
        break;
    }
  }, [onPrevious, onNext, onPlayPause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const canGoPrevious = currentStep > 0;
  const canGoNext = currentStep < totalSteps - 1;

  return (
    <div className="control-panel">
      <div className="control-buttons">
        <button 
          className="control-btn"
          onClick={onReset}
          title="重置"
        >
          ⟲ 重置
        </button>
        <button 
          className="control-btn"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          title="上一步 (←)"
        >
          ◀ 上一步 <span className="shortcut">←</span>
        </button>
        <button 
          className="control-btn play-btn"
          onClick={onPlayPause}
          title={isPlaying ? '暂停 (Space)' : '播放 (Space)'}
        >
          {isPlaying ? '⏸ 暂停' : '▶ 播放'} <span className="shortcut">Space</span>
        </button>
        <button 
          className="control-btn"
          onClick={onNext}
          disabled={!canGoNext}
          title="下一步 (→)"
        >
          下一步 ▶ <span className="shortcut">→</span>
        </button>
      </div>
      <div className="step-info">
        步骤: {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
}
