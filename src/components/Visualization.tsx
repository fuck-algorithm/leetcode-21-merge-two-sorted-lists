import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ListNode, PointerState } from '../types';
import './Visualization.css';

interface VisualizationProps {
  l1: ListNode | null;
  l2: ListNode | null;
  merged: ListNode | null;
  pointers: PointerState;
  highlightedNodeId: string | null;
  description: string;
}

const NODE_WIDTH = 50;
const NODE_HEIGHT = 36;
const NODE_SPACING = 110; // 增大间距，让链表更清晰

// 计算链表长度
function getListLength(head: ListNode | null): number {
  let count = 0;
  let current = head;
  while (current) {
    count++;
    current = current.next;
  }
  return count;
}

// 获取链表值数组
function getListValues(head: ListNode | null): number[] {
  const values: number[] = [];
  let current = head;
  while (current) {
    values.push(current.val);
    current = current.next;
  }
  return values;
}

export function Visualization({
  l1,
  l2,
  merged,
  pointers,
  highlightedNodeId,
  description
}: VisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const l1Length = getListLength(l1);
  const l2Length = getListLength(l2);
  const mergedLength = getListLength(merged);
  const l1Values = getListValues(l1);
  const l2Values = getListValues(l2);
  const mergedValues = getListValues(merged);

  // 获取当前比较的值
  const currentL1Val = pointers.p1 !== null && l1Values[pointers.p1] !== undefined ? l1Values[pointers.p1] : null;
  const currentL2Val = pointers.p2 !== null && l2Values[pointers.p2] !== undefined ? l2Values[pointers.p2] : null;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // 定义箭头标记
    const defs = svg.append('defs');
    
    ['orange', 'green', 'purple', 'gray'].forEach(color => {
      defs.append('marker')
        .attr('id', `arrow-${color}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', color === 'orange' ? '#ffa116' : color === 'green' ? '#10b981' : color === 'purple' ? '#8b5cf6' : '#6b7280');
    });

    const startX = 100;
    const l1Y = 60;
    const l2Y = 160;  // 增大行间距
    const mergedY = 280; // 增大行间距

    // 绘制标签和统计信息
    drawLabelWithStats(svg, 20, l1Y, 'L1', '#ffa116', l1Length, pointers.p1);
    drawLabelWithStats(svg, 20, l2Y, 'L2', '#10b981', l2Length, pointers.p2);
    drawLabelWithStats(svg, 20, mergedY, '结果', '#8b5cf6', mergedLength, null);

    // 判断是否合并完成（两个指针都为null表示合并完成）
    const isL1Completed = pointers.p1 === null;
    const isL2Completed = pointers.p2 === null;
    
    // 绘制 L1 链表（如果L1已经遍历完，整个链表变灰）
    drawLinkedListHorizontal(svg, l1, startX, l1Y, '#ffa116', 'orange', pointers.p1, highlightedNodeId, pointers.current === 'l1', 'L1', isL1Completed);
    
    // 绘制 L2 链表（如果L2已经遍历完，整个链表变灰）
    drawLinkedListHorizontal(svg, l2, startX, l2Y, '#10b981', 'green', pointers.p2, highlightedNodeId, pointers.current === 'l2', 'L2', isL2Completed);
    
    // 绘制合并结果链表（带来源颜色）
    drawMergedListHorizontal(svg, merged, startX, mergedY, highlightedNodeId);
    
    // 绘制比较框
    if (pointers.p1 !== null && pointers.p2 !== null && currentL1Val !== null && currentL2Val !== null) {
      drawComparisonBox(svg, currentL1Val, currentL2Val, l1Y, l2Y, startX, pointers.p1, pointers.p2);
    }

    // 绘制比较指示器和数据流动箭头
    if (pointers.p1 !== null && pointers.p2 !== null && l1 && l2) {
      drawComparisonIndicator(svg, startX, l1Y, l2Y, pointers.p1, pointers.p2, currentL1Val, currentL2Val, mergedY, mergedLength);
    }

  }, [l1, l2, merged, pointers, highlightedNodeId, l1Length, l2Length, mergedLength, currentL1Val, currentL2Val]);

  return (
    <div className="visualization">
      <div className="visualization-header">
        <span className="viz-title">链表合并可视化</span>
        <span className="viz-description">{description}</span>
      </div>
      
      {/* 状态信息面板 */}
      <div className="viz-status-panel">
        <div className="status-item">
          <span className="status-label">L1 剩余:</span>
          <span className="status-value orange">{pointers.p1 !== null ? l1Length - pointers.p1 : 0} 个节点</span>
        </div>
        <div className="status-item">
          <span className="status-label">L2 剩余:</span>
          <span className="status-value green">{pointers.p2 !== null ? l2Length - pointers.p2 : 0} 个节点</span>
        </div>
        <div className="status-item">
          <span className="status-label">已合并:</span>
          <span className="status-value purple">{mergedLength} 个节点</span>
        </div>
        {currentL1Val !== null && currentL2Val !== null && (
          <div className="status-item comparison">
            <span className="status-label">比较:</span>
            <span className="compare-values">
              <span className="orange">{currentL1Val}</span>
              <span className="compare-op">{currentL1Val <= currentL2Val ? '≤' : '>'}</span>
              <span className="green">{currentL2Val}</span>
              <span className="compare-result">→ 选择 {currentL1Val <= currentL2Val ? 'L1' : 'L2'}</span>
            </span>
          </div>
        )}
      </div>

      <svg ref={svgRef} className="visualization-svg" />
      
      <div className="viz-footer">
        <div className="viz-legend">
          <span className="legend-item"><span className="dot orange"></span>L1 链表</span>
          <span className="legend-item"><span className="dot green"></span>L2 链表</span>
          <span className="legend-item"><span className="dot purple"></span>合并结果</span>
          <span className="legend-item"><span className="dot red"></span>当前比较</span>
          <span className="legend-item"><span className="dot processed"></span>已处理</span>
        </div>
        <div className="viz-arrays">
          <span className="array-display">L1=[{l1Values.join(',')}]</span>
          <span className="array-display">L2=[{l2Values.join(',')}]</span>
          <span className="array-display result">结果=[{mergedValues.join(',')}]</span>
        </div>
      </div>
    </div>
  );
}

function drawLabelWithStats(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  text: string,
  color: string,
  length: number,
  pointerIndex: number | null
) {
  // 绘制标签
  svg.append('text')
    .attr('x', x)
    .attr('y', y + 5)
    .attr('fill', color)
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(text);
  
  // 绘制指针位置信息
  if (pointerIndex !== null) {
    svg.append('text')
      .attr('x', x)
      .attr('y', y + 20)
      .attr('fill', '#6b7280')
      .attr('font-size', '10px')
      .text(`[${pointerIndex}/${length}]`);
  }
}

function drawLinkedListHorizontal(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  head: ListNode | null,
  startX: number,
  y: number,
  color: string,
  arrowColor: string,
  pointerIndex: number | null,
  highlightedNodeId: string | null,
  isCurrentList: boolean,
  listName: string = '',
  isListCompleted: boolean = false
) {
  if (!head) {
    svg.append('text')
      .attr('x', startX)
      .attr('y', y + 5)
      .attr('fill', '#6b7280')
      .attr('font-size', '14px')
      .attr('font-style', 'italic')
      .text('空链表');
    return;
  }

  const nodes: ListNode[] = [];
  let current: ListNode | null = head;
  while (current) {
    nodes.push(current);
    current = current.next;
  }

  nodes.forEach((node, index) => {
    const x = startX + index * NODE_SPACING;
    const isHighlighted = node.id === highlightedNodeId;
    const isPointed = pointerIndex === index;
    const isBeingCompared = isCurrentList && isPointed;
    const isProcessed = pointerIndex !== null && index < pointerIndex;
    // 如果整个链表已完成遍历，所有节点都显示为灰色
    const isGrayed = isListCompleted || isProcessed;

    // 绘制节点矩形
    const rect = svg.append('rect')
      .attr('x', x)
      .attr('y', y - NODE_HEIGHT / 2)
      .attr('width', NODE_WIDTH)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 6)
      .attr('fill', isHighlighted ? color : isGrayed ? '#1a1a2e' : '#2d2d3d')
      .attr('stroke', isBeingCompared ? '#ef4444' : isGrayed ? '#4b5563' : color)
      .attr('stroke-width', isBeingCompared ? 3 : 2)
      .attr('opacity', isGrayed ? 0.5 : 1);

    if (isHighlighted || isBeingCompared) {
      rect.style('filter', `drop-shadow(0 0 8px ${isBeingCompared ? '#ef4444' : color})`);
    }

    // 绘制节点值
    svg.append('text')
      .attr('x', x + NODE_WIDTH / 2)
      .attr('y', y + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', isHighlighted ? '#1a1a2e' : isGrayed ? '#6b7280' : '#fff')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('opacity', isGrayed ? 0.5 : 1)
      .text(node.val);

    // 绘制索引标签
    svg.append('text')
      .attr('x', x + NODE_WIDTH / 2)
      .attr('y', y + NODE_HEIGHT / 2 + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '10px')
      .text(`[${index}]`);

    // 绘制指针箭头到下一个节点
    if (index < nodes.length - 1) {
      svg.append('line')
        .attr('x1', x + NODE_WIDTH)
        .attr('y1', y)
        .attr('x2', x + NODE_SPACING - 4)
        .attr('y2', y)
        .attr('stroke', isGrayed ? '#4b5563' : color)
        .attr('stroke-width', 2)
        .attr('opacity', isGrayed ? 0.5 : 1)
        .attr('marker-end', `url(#arrow-${isGrayed ? 'gray' : arrowColor})`);
    } else {
      // 绘制 null 指针
      svg.append('line')
        .attr('x1', x + NODE_WIDTH)
        .attr('y1', y)
        .attr('x2', x + NODE_WIDTH + 20)
        .attr('y2', y)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 2);
      
      svg.append('text')
        .attr('x', x + NODE_WIDTH + 25)
        .attr('y', y + 4)
        .attr('fill', '#6b7280')
        .attr('font-size', '12px')
        .text('null');
    }

    // 绘制当前指针标识 (p1 或 p2)
    if (isPointed && pointerIndex !== null) {
      const pointerName = listName === 'L1' ? 'p1' : listName === 'L2' ? 'p2' : '';
      
      // 指针箭头
      svg.append('polygon')
        .attr('points', `${x + NODE_WIDTH/2},${y - NODE_HEIGHT/2 - 12} ${x + NODE_WIDTH/2 - 8},${y - NODE_HEIGHT/2 - 2} ${x + NODE_WIDTH/2 + 8},${y - NODE_HEIGHT/2 - 2}`)
        .attr('fill', isCurrentList ? '#ef4444' : color);
      
      // 指针名称
      svg.append('text')
        .attr('x', x + NODE_WIDTH/2)
        .attr('y', y - NODE_HEIGHT/2 - 18)
        .attr('text-anchor', 'middle')
        .attr('fill', isCurrentList ? '#ef4444' : color)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(pointerName);
    }
  });
}

// 绘制合并结果链表，节点颜色根据来源显示
function drawMergedListHorizontal(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  head: ListNode | null,
  startX: number,
  y: number,
  highlightedNodeId: string | null
) {
  if (!head) {
    svg.append('text')
      .attr('x', startX)
      .attr('y', y + 5)
      .attr('fill', '#6b7280')
      .attr('font-size', '14px')
      .attr('font-style', 'italic')
      .text('空链表');
    return;
  }

  const nodes: ListNode[] = [];
  let current: ListNode | null = head;
  while (current) {
    nodes.push(current);
    current = current.next;
  }

  nodes.forEach((node, index) => {
    const x = startX + index * NODE_SPACING;
    const isHighlighted = node.id === highlightedNodeId;
    
    // 根据节点id前缀确定来源颜色
    const isFromL1 = node.id.startsWith('l1-');
    const sourceColor = isFromL1 ? '#ffa116' : '#10b981'; // 橙色(L1) 或 绿色(L2)
    const arrowColor = isFromL1 ? 'orange' : 'green';

    // 绘制节点矩形
    const rect = svg.append('rect')
      .attr('x', x)
      .attr('y', y - NODE_HEIGHT / 2)
      .attr('width', NODE_WIDTH)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 6)
      .attr('fill', isHighlighted ? sourceColor : '#2d2d3d')
      .attr('stroke', sourceColor)
      .attr('stroke-width', 2);

    if (isHighlighted) {
      rect.style('filter', `drop-shadow(0 0 8px ${sourceColor})`);
    }

    // 绘制节点值
    svg.append('text')
      .attr('x', x + NODE_WIDTH / 2)
      .attr('y', y + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', isHighlighted ? '#1a1a2e' : '#fff')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(node.val);

    // 绘制索引标签
    svg.append('text')
      .attr('x', x + NODE_WIDTH / 2)
      .attr('y', y + NODE_HEIGHT / 2 + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '10px')
      .text(`[${index}]`);

    // 绘制指针箭头到下一个节点
    if (index < nodes.length - 1) {
      svg.append('line')
        .attr('x1', x + NODE_WIDTH)
        .attr('y1', y)
        .attr('x2', x + NODE_SPACING - 4)
        .attr('y2', y)
        .attr('stroke', sourceColor)
        .attr('stroke-width', 2)
        .attr('marker-end', `url(#arrow-${arrowColor})`);
    } else {
      // 绘制 null 指针
      svg.append('line')
        .attr('x1', x + NODE_WIDTH)
        .attr('y1', y)
        .attr('x2', x + NODE_WIDTH + 20)
        .attr('y2', y)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 2);
      
      svg.append('text')
        .attr('x', x + NODE_WIDTH + 25)
        .attr('y', y + 4)
        .attr('fill', '#6b7280')
        .attr('font-size', '12px')
        .text('null');
    }
  });
}

function drawComparisonBox(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  l1Val: number,
  l2Val: number,
  l1Y: number,
  l2Y: number,
  startX: number,
  _p1Index: number,
  _p2Index: number
) {
  // 比较框固定在两个链表之间的右侧位置
  // 使用固定的 X 位置，避免遮挡链表节点
  const boxX = startX + 3 * NODE_SPACING + NODE_WIDTH + 60; // 固定在第3个节点之后
  const boxY = (l1Y + l2Y) / 2;
  const boxWidth = 120;
  const boxHeight = 70;
  
  // 比较框背景
  svg.append('rect')
    .attr('x', boxX)
    .attr('y', boxY - boxHeight / 2)
    .attr('width', boxWidth)
    .attr('height', boxHeight)
    .attr('rx', 8)
    .attr('fill', '#252538')
    .attr('stroke', '#ef4444')
    .attr('stroke-width', 2)
    .attr('opacity', 0.95);
  
  // 标题
  svg.append('text')
    .attr('x', boxX + boxWidth / 2)
    .attr('y', boxY - boxHeight / 2 + 16)
    .attr('text-anchor', 'middle')
    .attr('fill', '#ef4444')
    .attr('font-size', '10px')
    .attr('font-weight', 'bold')
    .text('⚡ 比较中');
  
  // 比较表达式
  const winner = l1Val <= l2Val ? 'L1' : 'L2';
  const comparison = `${l1Val} ${l1Val <= l2Val ? '≤' : '>'} ${l2Val}`;
  
  svg.append('text')
    .attr('x', boxX + boxWidth / 2)
    .attr('y', boxY + 2)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(comparison);
  
  // 结果
  svg.append('text')
    .attr('x', boxX + boxWidth / 2)
    .attr('y', boxY + boxHeight / 2 - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', '#22c55e')
    .attr('font-size', '11px')
    .attr('font-weight', 'bold')
    .text(`选择 ${winner}`);
}

function drawComparisonIndicator(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  startX: number,
  l1Y: number,
  l2Y: number,
  p1Index: number,
  p2Index: number,
  l1Val: number | null,
  l2Val: number | null,
  mergedY: number,
  mergedLength: number
) {
  // x1 是 L1 当前指针指向的节点的 x 坐标中心
  const x1 = startX + p1Index * NODE_SPACING + NODE_WIDTH / 2;
  // x2 是 L2 当前指针指向的节点的 x 坐标中心
  const x2 = startX + p2Index * NODE_SPACING + NODE_WIDTH / 2;
  
  // 确定胜者（较小值）
  const winner = l1Val !== null && l2Val !== null 
    ? (l1Val <= l2Val ? 'l1' : 'l2') 
    : null;
  
  const winnerX = winner === 'l1' ? x1 : x2;
  const winnerY = winner === 'l1' ? l1Y : l2Y;
  const winnerColor = winner === 'l1' ? '#ffa116' : '#10b981';
  
  // 计算结果链表的目标位置
  const targetX = startX + mergedLength * NODE_SPACING + NODE_WIDTH / 2;

  if (winner) {
    // 流动箭头 - 从胜者节点到结果链表的曲线
    const controlX = winnerX + (targetX - winnerX) * 0.3;
    const controlY = mergedY - 40;
    
    // 主流动路径 - 虚线箭头
    svg.append('path')
      .attr('d', `M ${winnerX} ${winnerY + NODE_HEIGHT/2 + 5} 
                  Q ${controlX} ${controlY} 
                  ${targetX} ${mergedY - NODE_HEIGHT/2 - 8}`)
      .attr('fill', 'none')
      .attr('stroke', winnerColor)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')
      .attr('opacity', 0.7);
    
    // 箭头头部
    const arrowSize = 6;
    svg.append('polygon')
      .attr('points', `
        ${targetX},${mergedY - NODE_HEIGHT/2 - 5}
        ${targetX - arrowSize},${mergedY - NODE_HEIGHT/2 - 13}
        ${targetX + arrowSize},${mergedY - NODE_HEIGHT/2 - 13}
      `)
      .attr('fill', winnerColor)
      .attr('opacity', 0.8);
  }

  // 绘制比较连接线 - 正确连接 L1 当前节点和 L2 当前节点
  // 使用贝塞尔曲线从 L1[p1Index] 连接到 L2[p2Index]
  
  // L1 节点底部的起点
  const l1BottomY = l1Y + NODE_HEIGHT / 2;
  // L2 节点顶部的终点
  const l2TopY = l2Y - NODE_HEIGHT / 2;
  
  // 计算中间控制点，使曲线更平滑
  const midY = (l1BottomY + l2TopY) / 2;
  const midX = (x1 + x2) / 2;
  
  // 绘制从 L1 当前节点到 L2 当前节点的比较连接线
  // 使用二次贝塞尔曲线，控制点在中间位置
  svg.append('path')
    .attr('d', `M ${x1} ${l1BottomY + 2} 
                Q ${midX} ${midY} 
                ${x2} ${l2TopY - 2}`)
    .attr('fill', 'none')
    .attr('stroke', '#ef4444')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '4,4')
    .attr('opacity', 0.6);
  
  // 在 L1 节点底部添加小圆点标记
  svg.append('circle')
    .attr('cx', x1)
    .attr('cy', l1BottomY + 4)
    .attr('r', 4)
    .attr('fill', '#ef4444')
    .attr('opacity', 0.8);
  
  // 在 L2 节点顶部添加小圆点标记
  svg.append('circle')
    .attr('cx', x2)
    .attr('cy', l2TopY - 4)
    .attr('r', 4)
    .attr('fill', '#ef4444')
    .attr('opacity', 0.8);
}
