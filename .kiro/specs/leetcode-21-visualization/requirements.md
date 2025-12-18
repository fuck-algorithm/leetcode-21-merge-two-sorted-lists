# Requirements Document

## Introduction

本项目是一个 LeetCode 第 21 题「合并两个有序链表」的算法可视化工具。使用 TypeScript + React + D3.js 技术栈构建单屏幕应用，部署在 GitHub Pages 上。项目提供交互式的算法演示，包含代码高亮、变量值展示、键盘快捷键控制等功能，帮助用户直观理解算法执行过程。

## Glossary

- **Visualization System**: 算法可视化系统，负责展示链表合并过程的图形化界面
- **Control Panel**: 控制面板，包含播放、暂停、上一步、下一步等控制按钮
- **Code Panel**: 代码面板，展示 Java 算法代码并支持调试效果
- **Debug View**: 调试视图，在代码行后展示当前变量的内存值
- **Step**: 算法执行的单个步骤，包含当前执行行和变量状态
- **Linked List Node**: 链表节点，包含 val 值和 next 指针
- **Floating Ball**: 悬浮球，页面右下角的交互元素，用于展示微信群二维码

## Requirements

### Requirement 1

**User Story:** As a user, I want to see the page title matching LeetCode's format with a clickable link, so that I can easily navigate to the original problem.

#### Acceptance Criteria

1. WHEN the page loads THEN the Visualization System SHALL display the title "21. 合并两个有序链表" matching LeetCode's format
2. WHEN a user clicks the title THEN the Visualization System SHALL navigate to https://leetcode.cn/problems/merge-two-sorted-lists/ in a new tab

### Requirement 2

**User Story:** As a user, I want to see a GitHub icon in the top-right corner, so that I can access the source code repository.

#### Acceptance Criteria

1. WHEN the page loads THEN the Visualization System SHALL display a GitHub icon in the top-right corner of the page
2. WHEN a user clicks the GitHub icon THEN the Visualization System SHALL navigate to https://github.com/fuck-algorithm/leetcode-21-merge-two-sorted-lists in a new tab

### Requirement 3

**User Story:** As a user, I want to see the Java algorithm code with syntax highlighting and debug-like effects, so that I can understand which line is being executed.

#### Acceptance Criteria

1. WHEN the page loads THEN the Code Panel SHALL display the Java implementation of the merge two sorted lists algorithm with syntax highlighting
2. WHEN an algorithm step executes THEN the Code Panel SHALL highlight the currently executing line with a distinct background color
3. WHEN a variable value changes THEN the Code Panel SHALL display the variable's current memory value inline after the corresponding code line
4. WHEN multiple variables exist on the same line THEN the Code Panel SHALL display all variable values separated by commas

### Requirement 4

**User Story:** As a user, I want to control the algorithm visualization with keyboard shortcuts, so that I can navigate through steps efficiently.

#### Acceptance Criteria

1. WHEN a user presses the Left Arrow key THEN the Control Panel SHALL execute the previous step action
2. WHEN a user presses the Right Arrow key THEN the Control Panel SHALL execute the next step action
3. WHEN a user presses the Space key THEN the Control Panel SHALL toggle between play and pause states
4. WHEN the page loads THEN the Control Panel SHALL display shortcut hints on each button (← for previous, → for next, Space for play/pause)

### Requirement 5

**User Story:** As a user, I want to see a rich visualization of the linked list merge process, so that I can understand the algorithm intuitively.

#### Acceptance Criteria

1. WHEN the visualization starts THEN the Visualization System SHALL display two input linked lists (l1 and l2) with their node values
2. WHEN a merge step executes THEN the Visualization System SHALL animate the pointer movement and node connection
3. WHEN a node is selected for merging THEN the Visualization System SHALL highlight the selected node distinctly
4. WHEN the merge completes THEN the Visualization System SHALL display the final merged linked list
5. WHEN displaying nodes THEN the Visualization System SHALL show node values, pointer arrows, and current comparison indicators

### Requirement 6

**User Story:** As a user, I want to see a floating ball for joining the algorithm discussion group, so that I can connect with other learners.

#### Acceptance Criteria

1. WHEN the page loads THEN the Visualization System SHALL display a floating ball in the bottom-right corner with a WeChat group icon and "交流群" text
2. WHEN a user hovers over the floating ball THEN the Visualization System SHALL display a WeChat QR code image with the hint "微信扫码发送 leetcode 加入算法交流群"
3. WHEN displaying the QR code image THEN the Visualization System SHALL preserve the original aspect ratio of the image without distortion

### Requirement 7

**User Story:** As a developer, I want the project to automatically deploy to GitHub Pages on code push, so that the latest version is always available.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch THEN the GitHub Action SHALL build the TypeScript + React project
2. WHEN the build succeeds THEN the GitHub Action SHALL deploy the built assets to GitHub Pages
3. IF the build fails THEN the GitHub Action SHALL report the error and prevent deployment

### Requirement 8

**User Story:** As a user, I want the application to run as a single-screen application on port 55032, so that I can access it locally during development.

#### Acceptance Criteria

1. WHEN the development server starts THEN the Visualization System SHALL listen on port 55032
2. WHEN the page loads THEN the Visualization System SHALL render all components within a single screen without requiring scrolling on standard displays (1920x1080)
