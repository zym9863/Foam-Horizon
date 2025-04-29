# 泡沫视界 (Foam Horizon)

[English](./README_EN.md) | 中文

泡沫视界 (Foam Horizon) 是一个交互式应用程序，用于展示和可视化信息茧房（Filter Bubble）的形成过程。该应用程序模拟了用户与内容的互动如何逐渐导致个性化算法创建"信息泡沫"，从而限制了用户接触到的信息多样性。

## 功能特点

- **个性化信息流**：根据用户的互动历史动态调整内容展示
- **泡沫可视化**：通过动态、交互式的可视化展示信息茧房的形成
- **主题互动**：用户可以与不同主题的内容互动，观察偏好如何影响信息流
- **泡沫指数**：实时计算并显示用户的信息茧房程度
- **现代化界面**：采用现代设计理念，提供流畅的用户体验

## 技术栈

- **React 19**：使用最新的React框架构建用户界面
- **TypeScript**：提供类型安全和更好的开发体验
- **Vite**：快速的前端构建工具
- **Canvas API**：用于创建动态的泡沫可视化效果
- **CSS变量**：实现一致的设计系统和主题

## 项目结构

```
src/
├── assets/         # 静态资源文件
├── components/     # React组件
│   ├── BubbleVisualization.tsx  # 泡沫可视化组件
│   ├── Feed.tsx                 # 信息流组件
│   ├── FeedItem.tsx             # 信息流条目组件
│   ├── Header.tsx               # 页头组件
│   └── TopicSelector.tsx        # 主题选择器组件
├── context/        # React上下文
│   └── UserContext.tsx          # 用户偏好和状态管理
├── data/           # 数据文件
│   └── topics.ts                # 主题和内容数据
├── types/          # TypeScript类型定义
│   └── index.ts                 # 应用程序类型定义
├── App.css         # 主样式文件
├── App.tsx         # 主应用组件
├── index.css       # 全局样式和CSS变量
└── main.tsx        # 应用入口点
```

## 设计理念

泡沫视界采用了现代化的设计系统，包括：

- **一致的色彩系统**：使用CSS变量定义的色彩主题
- **精心设计的排版**：使用Google Fonts的Poppins和Noto Sans SC字体
- **流畅的动画**：通过CSS过渡和Canvas动画提供视觉反馈
- **响应式设计**：适应不同屏幕尺寸的布局

## 如何运行

1. 克隆仓库
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 在浏览器中访问：`http://localhost:5173`

## 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist` 目录中。

## 许可证

MIT
