import { useState, useCallback } from 'react';
import './DataInput.css';

interface DataInputProps {
  onDataChange: (l1: number[], l2: number[]) => void;
}

// 预设数据样例
const PRESET_EXAMPLES = [
  { name: '示例1', l1: [1, 2, 4], l2: [1, 3, 4] },
  { name: '示例2', l1: [1, 3, 5, 7], l2: [2, 4, 6, 8] },
  { name: '示例3', l1: [], l2: [0] },
  { name: '示例4', l1: [5], l2: [1, 2, 4] },
];

// 验证输入是否为有效的有序链表数组
function validateInput(input: string): { valid: boolean; data: number[]; error?: string } {
  const trimmed = input.trim();
  
  // 空输入表示空链表
  if (trimmed === '' || trimmed === '[]') {
    return { valid: true, data: [] };
  }
  
  // 尝试解析为数组格式 [1,2,3] 或 1,2,3
  let numbers: number[];
  try {
    // 移除方括号（如果有）
    const cleaned = trimmed.replace(/^\[|\]$/g, '').trim();
    if (cleaned === '') {
      return { valid: true, data: [] };
    }
    
    // 分割并解析数字
    numbers = cleaned.split(/[,，\s]+/).map(s => {
      const num = parseInt(s.trim(), 10);
      if (isNaN(num)) {
        throw new Error(`"${s}" 不是有效数字`);
      }
      return num;
    });
  } catch (e) {
    return { valid: false, data: [], error: e instanceof Error ? e.message : '格式错误' };
  }
  
  // 检查是否为有序（非递减）
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < numbers[i - 1]) {
      return { valid: false, data: [], error: '链表必须是有序的（非递减）' };
    }
  }
  
  // 检查数值范围
  for (const num of numbers) {
    if (num < -100 || num > 100) {
      return { valid: false, data: [], error: '数值范围应在 -100 到 100 之间' };
    }
  }
  
  // 检查长度
  if (numbers.length > 50) {
    return { valid: false, data: [], error: '链表长度不能超过50' };
  }
  
  return { valid: true, data: numbers };
}

// 生成随机有序链表
function generateRandomSortedList(): number[] {
  const length = Math.floor(Math.random() * 6) + 1; // 1-6个元素
  const numbers: number[] = [];
  let current = Math.floor(Math.random() * 10) - 5; // 起始值 -5 到 4
  
  for (let i = 0; i < length; i++) {
    numbers.push(current);
    current += Math.floor(Math.random() * 5) + 1; // 每次增加 1-5
  }
  
  return numbers;
}

export function DataInput({ onDataChange }: DataInputProps) {
  const [l1Input, setL1Input] = useState('1, 2, 4');
  const [l2Input, setL2Input] = useState('1, 3, 4');
  const [l1Error, setL1Error] = useState<string | null>(null);
  const [l2Error, setL2Error] = useState<string | null>(null);

  const handleApply = useCallback(() => {
    const l1Result = validateInput(l1Input);
    const l2Result = validateInput(l2Input);
    
    setL1Error(l1Result.valid ? null : l1Result.error || '格式错误');
    setL2Error(l2Result.valid ? null : l2Result.error || '格式错误');
    
    if (l1Result.valid && l2Result.valid) {
      onDataChange(l1Result.data, l2Result.data);
    }
  }, [l1Input, l2Input, onDataChange]);

  const handlePresetClick = useCallback((l1: number[], l2: number[]) => {
    setL1Input(l1.length > 0 ? l1.join(', ') : '');
    setL2Input(l2.length > 0 ? l2.join(', ') : '');
    setL1Error(null);
    setL2Error(null);
    onDataChange(l1, l2);
  }, [onDataChange]);

  const handleRandom = useCallback(() => {
    const newL1 = generateRandomSortedList();
    const newL2 = generateRandomSortedList();
    setL1Input(newL1.join(', '));
    setL2Input(newL2.join(', '));
    setL1Error(null);
    setL2Error(null);
    onDataChange(newL1, newL2);
  }, [onDataChange]);

  return (
    <div className="data-input">
      <div className="input-row">
        <div className="input-group">
          <label className="input-label">L1:</label>
          <input
            type="text"
            className={`input-field ${l1Error ? 'error' : ''}`}
            value={l1Input}
            onChange={(e) => setL1Input(e.target.value)}
            placeholder="例: 1, 2, 4"
          />
          {l1Error && <span className="error-tip">{l1Error}</span>}
        </div>
        <div className="input-group">
          <label className="input-label">L2:</label>
          <input
            type="text"
            className={`input-field ${l2Error ? 'error' : ''}`}
            value={l2Input}
            onChange={(e) => setL2Input(e.target.value)}
            placeholder="例: 1, 3, 4"
          />
          {l2Error && <span className="error-tip">{l2Error}</span>}
        </div>
        <button className="apply-btn" onClick={handleApply}>应用</button>
        <button className="random-btn" onClick={handleRandom}>🎲 随机</button>
      </div>
      <div className="presets-row">
        <span className="presets-label">样例:</span>
        {PRESET_EXAMPLES.map((example, index) => (
          <button
            key={index}
            className="preset-btn"
            onClick={() => handlePresetClick(example.l1, example.l2)}
            title={`L1=[${example.l1.join(',')}], L2=[${example.l2.join(',')}]`}
          >
            {example.name}
          </button>
        ))}
      </div>
    </div>
  );
}
