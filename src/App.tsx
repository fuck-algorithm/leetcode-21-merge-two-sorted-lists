import { Header } from './components/Header';
import { DataInput } from './components/DataInput';
import { CodePanel } from './components/CodePanel';
import { ControlPanel } from './components/ControlPanel';
import { Visualization } from './components/Visualization';
import { FloatingBall } from './components/FloatingBall';
import { useAlgorithmState } from './hooks/useAlgorithmState';
import './App.css';

const LEETCODE_URL = 'https://leetcode.cn/problems/merge-two-sorted-lists/';
const GITHUB_URL = 'https://github.com/fuck-algorithm/leetcode-21-merge-two-sorted-lists';

function App() {
  const {
    currentStep,
    isPlaying,
    steps,
    currentStepData,
    goToNext,
    goToPrevious,
    togglePlayPause,
    reset,
    setInputArrays
  } = useAlgorithmState([1, 2, 4], [1, 3, 4]);

  return (
    <div className="app">
      <Header 
        title="21. 合并两个有序链表"
        leetcodeUrl={LEETCODE_URL}
        githubUrl={GITHUB_URL}
      />
      <DataInput onDataChange={setInputArrays} />
      
      <main className="main-content">
        <div className="left-panel">
          <CodePanel 
            currentLine={currentStepData?.currentLine ?? 0}
            variables={currentStepData?.variables ?? []}
          />
        </div>
        
        <div className="right-panel">
          <Visualization 
            l1={currentStepData?.l1State ?? null}
            l2={currentStepData?.l2State ?? null}
            merged={currentStepData?.mergedState ?? null}
            pointers={currentStepData?.pointers ?? { p1: null, p2: null, current: null }}
            highlightedNodeId={currentStepData?.highlightedNodeId ?? null}
            description={currentStepData?.description ?? ''}
          />
          
          <ControlPanel 
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onPlayPause={togglePlayPause}
            onReset={reset}
          />
        </div>
      </main>
      
      <FloatingBall />
    </div>
  );
}

export default App;
