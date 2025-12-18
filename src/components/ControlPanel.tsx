import { useEffect, useCallback, useRef, useState } from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onSeek?: (step: number) => void;
}

export function ControlPanel({
  isPlaying,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPlayPause,
  onReset,
  onSeek
}: ControlPanelProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateStepFromPosition = useCallback((clientX: number) => {
    if (!progressRef.current) return currentStep;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(percentage * (totalSteps - 1));
  }, [totalSteps, currentStep]);

  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    if (onSeek) {
      const newStep = calculateStepFromPosition(e.clientX);
      onSeek(newStep);
    }
  }, [calculateStepFromPosition, onSeek]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    if (onSeek) {
      const newStep = calculateStepFromPosition(e.clientX);
      onSeek(newStep);
    }
  }, [calculateStepFromPosition, onSeek]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (onSeek) {
        const newStep = calculateStepFromPosition(e.clientX);
        onSeek(newStep);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, calculateStepFromPosition, onSeek]);

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
      
      <div 
        className={`progress-bar-container ${isDragging ? 'dragging' : ''}`}
        ref={progressRef}
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="progress-bar-track"
        >
          <div 
            className="progress-bar-fill"
            style={{ width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%` }}
          />
          <div 
            className="progress-bar-thumb"
            style={{ left: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
