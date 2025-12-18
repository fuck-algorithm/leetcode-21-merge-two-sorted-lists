/**
 * 链表节点接口
 */
export interface ListNode {
  val: number;
  next: ListNode | null;
  id: string;
}

/**
 * 指针状态
 */
export interface PointerState {
  p1: number | null;  // l1 当前指针位置索引
  p2: number | null;  // l2 当前指针位置索引
  current: 'l1' | 'l2' | null;  // 当前操作的链表
}

/**
 * 变量状态
 */
export interface VariableState {
  name: string;
  value: string;
  line: number;
}

/**
 * 算法执行步骤
 */
export interface AlgorithmStep {
  stepIndex: number;
  description: string;
  currentLine: number;
  variables: VariableState[];
  l1State: ListNode | null;
  l2State: ListNode | null;
  mergedState: ListNode | null;
  pointers: PointerState;
  highlightedNodeId: string | null;
}

/**
 * 应用状态
 */
export interface AppState {
  currentStep: number;
  isPlaying: boolean;
  steps: AlgorithmStep[];
  l1: number[];
  l2: number[];
}
