import { AlgorithmStep, ListNode, VariableState, PointerState } from '../types';
import { arrayToList, cloneList, createNode } from './listNode';

/**
 * Java 代码
 */
export const JAVA_CODE = `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(-1);
    ListNode curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    curr.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`;

export const CODE_LINES = JAVA_CODE.split('\n');

/**
 * 生成算法执行步骤
 */
export function generateSteps(arr1: number[], arr2: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let stepIndex = 0;

  let l1 = arrayToList(arr1, 'l1');
  let l2 = arrayToList(arr2, 'l2');
  
  const originalL1 = cloneList(l1);
  const originalL2 = cloneList(l2);

  // Step 0: 初始状态
  steps.push(createStep(stepIndex++, 0, 
    `开始合并：L1=[${arr1.join(',')}]，L2=[${arr2.join(',')}]`, 
    [{ name: 'l1', value: formatList(l1), line: 0 }, { name: 'l2', value: formatList(l2), line: 0 }],
    { p1: l1 ? 0 : null, p2: l2 ? 0 : null, current: null },
    originalL1, originalL2, null, null
  ));

  // Step 1: 创建哨兵节点
  const dummy = createNode(-1);
  dummy.id = 'dummy';
  steps.push(createStep(stepIndex++, 1, 
    '创建哨兵节点 dummy，简化边界处理',
    [{ name: 'dummy', value: '-1', line: 1 }],
    { p1: l1 ? 0 : null, p2: l2 ? 0 : null, current: null },
    originalL1, originalL2, null, null
  ));

  // Step 2: curr 指向 dummy
  let curr = dummy;
  const mergedNodes: ListNode[] = [];
  steps.push(createStep(stepIndex++, 2, 
    'curr 指针指向 dummy，用于构建结果链表',
    [{ name: 'curr', value: 'dummy', line: 2 }],
    { p1: l1 ? 0 : null, p2: l2 ? 0 : null, current: null },
    originalL1, originalL2, null, null
  ));

  let p1Index = 0;
  let p2Index = 0;

  // 主循环
  while (l1 !== null && l2 !== null) {
    // 比较步骤
    const l1Val = l1.val;
    const l2Val = l2.val;
    const chooseL1 = l1Val <= l2Val;
    
    steps.push(createStep(stepIndex++, 3, 
      `比较 L1[${p1Index}]=${l1Val} 和 L2[${p2Index}]=${l2Val}`,
      [{ name: 'l1.val', value: `${l1Val}`, line: 3 }, { name: 'l2.val', value: `${l2Val}`, line: 3 }],
      { p1: p1Index, p2: p2Index, current: null },
      originalL1, originalL2, buildMergedList(mergedNodes), null
    ));

    if (chooseL1) {
      // 选择 l1
      steps.push(createStep(stepIndex++, 4, 
        `${l1Val} ≤ ${l2Val}，选择 L1 的节点 ${l1Val}`,
        [{ name: '选择', value: `L1[${p1Index}]=${l1Val}`, line: 4 }],
        { p1: p1Index, p2: p2Index, current: 'l1' },
        originalL1, originalL2, buildMergedList(mergedNodes), l1.id
      ));

      mergedNodes.push({ ...l1, next: null, id: l1.id });
      
      steps.push(createStep(stepIndex++, 5, 
        `将 ${l1Val} 加入结果链表`,
        [{ name: 'curr.next', value: `${l1Val}`, line: 5 }],
        { p1: p1Index, p2: p2Index, current: 'l1' },
        originalL1, originalL2, buildMergedList(mergedNodes), l1.id
      ));

      l1 = l1.next;
      p1Index++;
      
      steps.push(createStep(stepIndex++, 6, 
        `L1 指针后移${l1 ? `，下一个值为 ${l1.val}` : '，已到末尾'}`,
        [{ name: 'l1', value: l1 ? `${l1.val}` : 'null', line: 6 }],
        { p1: l1 ? p1Index : null, p2: p2Index, current: 'l1' },
        originalL1, originalL2, buildMergedList(mergedNodes), l1?.id || null
      ));
    } else {
      // 选择 l2
      steps.push(createStep(stepIndex++, 7, 
        `${l1Val} > ${l2Val}，选择 L2 的节点 ${l2Val}`,
        [{ name: '选择', value: `L2[${p2Index}]=${l2Val}`, line: 7 }],
        { p1: p1Index, p2: p2Index, current: 'l2' },
        originalL1, originalL2, buildMergedList(mergedNodes), l2.id
      ));

      mergedNodes.push({ ...l2, next: null, id: l2.id });
      
      steps.push(createStep(stepIndex++, 8, 
        `将 ${l2Val} 加入结果链表`,
        [{ name: 'curr.next', value: `${l2Val}`, line: 8 }],
        { p1: p1Index, p2: p2Index, current: 'l2' },
        originalL1, originalL2, buildMergedList(mergedNodes), l2.id
      ));

      l2 = l2.next;
      p2Index++;
      
      steps.push(createStep(stepIndex++, 9, 
        `L2 指针后移${l2 ? `，下一个值为 ${l2.val}` : '，已到末尾'}`,
        [{ name: 'l2', value: l2 ? `${l2.val}` : 'null', line: 9 }],
        { p1: p1Index, p2: l2 ? p2Index : null, current: 'l2' },
        originalL1, originalL2, buildMergedList(mergedNodes), l2?.id || null
      ));
    }

    // curr 后移
    if (curr.next !== null) {
      curr = curr.next;
      steps.push(createStep(stepIndex++, 11, 
        'curr 指针后移，准备连接下一个节点',
        [{ name: 'curr', value: `${curr.val}`, line: 11 }],
        { p1: l1 ? p1Index : null, p2: l2 ? p2Index : null, current: null },
        originalL1, originalL2, buildMergedList(mergedNodes), null
      ));
    }
  }

  // 处理剩余节点
  if (l1 !== null) {
    steps.push(createStep(stepIndex++, 13, 
      `L2 已遍历完，将 L1 剩余部分 [${formatListValues(l1)}] 直接连接`,
      [{ name: 'l1剩余', value: formatListValues(l1), line: 13 }],
      { p1: p1Index, p2: null, current: 'l1' },
      originalL1, originalL2, buildMergedList(mergedNodes), l1.id
    ));

    while (l1 !== null) {
      mergedNodes.push({ ...l1, next: null, id: l1.id });
      l1 = l1.next;
    }
  } else if (l2 !== null) {
    steps.push(createStep(stepIndex++, 13, 
      `L1 已遍历完，将 L2 剩余部分 [${formatListValues(l2)}] 直接连接`,
      [{ name: 'l2剩余', value: formatListValues(l2), line: 13 }],
      { p1: null, p2: p2Index, current: 'l2' },
      originalL1, originalL2, buildMergedList(mergedNodes), l2.id
    ));

    while (l2 !== null) {
      mergedNodes.push({ ...l2, next: null, id: l2.id });
      l2 = l2.next;
    }
  }

  // 最终结果
  steps.push(createStep(stepIndex++, 14, 
    `合并完成！结果：[${mergedNodes.map(n => n.val).join(',')}]`,
    [{ name: 'result', value: `[${mergedNodes.map(n => n.val).join(',')}]`, line: 14 }],
    { p1: null, p2: null, current: null },
    originalL1, originalL2, buildMergedList(mergedNodes), null
  ));

  return steps;
}

function createStep(
  stepIndex: number,
  currentLine: number,
  description: string,
  variables: VariableState[],
  pointers: PointerState,
  l1State: ListNode | null,
  l2State: ListNode | null,
  mergedState: ListNode | null,
  highlightedNodeId: string | null
): AlgorithmStep {
  return {
    stepIndex,
    currentLine: Math.min(currentLine, CODE_LINES.length - 1),
    description,
    variables,
    pointers,
    l1State: cloneList(l1State),
    l2State: cloneList(l2State),
    mergedState: cloneList(mergedState),
    highlightedNodeId
  };
}

function formatList(head: ListNode | null): string {
  if (head === null) return '[]';
  const values: number[] = [];
  let current: ListNode | null = head;
  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }
  return `[${values.join(',')}]`;
}

function formatListValues(head: ListNode | null): string {
  if (head === null) return '';
  const values: number[] = [];
  let current: ListNode | null = head;
  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }
  return values.join(',');
}

function buildMergedList(nodes: ListNode[]): ListNode | null {
  if (nodes.length === 0) return null;
  
  const head = createNode(nodes[0].val);
  head.id = nodes[0].id;
  let current = head;
  
  for (let i = 1; i < nodes.length; i++) {
    const newNode = createNode(nodes[i].val);
    newNode.id = nodes[i].id;
    current.next = newNode;
    current = newNode;
  }
  
  return head;
}
