import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import { VariableState } from '../types';
import { CODE_LINES } from '../utils/stepGenerator';
import './CodePanel.css';

interface CodePanelProps {
  currentLine: number;
  variables: VariableState[];
}

export function CodePanel({ currentLine, variables }: CodePanelProps) {
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightAllUnder(codeRef.current);
    }
  }, []);

  // 按行号分组变量
  const variablesByLine = variables.reduce((acc, v) => {
    if (!acc[v.line]) acc[v.line] = [];
    acc[v.line].push(v);
    return acc;
  }, {} as Record<number, VariableState[]>);

  // 计算缩进：将前导空格转换为不可断空格以保留缩进
  const getIndentedLine = (line: string) => {
    const match = line.match(/^(\s*)/);
    if (match && match[1]) {
      const indent = match[1];
      const rest = line.slice(indent.length);
      // 使用 &nbsp; 替代空格来保留缩进
      return { indent: indent.length, content: rest };
    }
    return { indent: 0, content: line };
  };

  return (
    <div className="code-panel" ref={codeRef}>
      <div className="code-header">
        <span className="code-lang">Java</span>
        <span className="code-title">算法代码</span>
      </div>
      <div className="code-content">
        {CODE_LINES.map((line, index) => {
          const { indent, content } = getIndentedLine(line);
          return (
            <div 
              key={index} 
              className={`code-line ${index === currentLine ? 'highlighted' : ''}`}
            >
              <span className="line-number">{index + 1}</span>
              <span className="line-indent" style={{ width: `${indent * 8}px` }}></span>
              <code className="line-code language-java">{content || ' '}</code>
              {variablesByLine[index] && (
                <span className="variable-values">
                  {variablesByLine[index].map(v => `${v.name}=${v.value}`).join(', ')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
