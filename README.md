# DrillPro

> 初次全AI开发体验，主包对里面的技术栈一窍不通～

一款基于 Tauri + React + TypeScript 的本地题库刷题与错题本应用，支持多题型、错题重练、进度保存，跨平台（Windows/macOS）自动打包。

## 主要特性

- 支持单选、多选、判断、填空、简答等多种题型
- 题库本地存储，隐私安全，支持导入/导出
- 错题本自动记录，支持错题重练
- 练习/考试/复习多模式切换
- 进度自动保存，随时中断与恢复
- 题目定时、分数统计、解析展示
- 跨平台（Windows/macOS）一键打包分发

## 技术栈

- 前端：React 18, TypeScript, Zustand, Vite
- 桌面端：Tauri 2.x (Rust)

## 快速开始

```bash
# 安装依赖
npm install

# 启动前端开发服务器
npm run dev

# 启动 Tauri 桌面应用（需已安装 Rust）
npm run tauri dev
```

## 自动打包与发布（Windows & macOS）

本项目已配置 GitHub Actions 自动打包 Windows 和 macOS 版本。

### 如何使用

1. 推送代码到 main 分支，GitHub Actions 会自动开始打包流程。
2. 打包完成后，可在 GitHub Actions 的页面下载对应平台的安装包（artifact）。

### 工作流说明

- 配置文件：`.github/workflows/tauri-build.yml`
- 支持平台：`windows-latest`（Windows）、`macos-latest`（macOS）
- 自动安装依赖、构建前端、打包 Tauri 应用
- 产物路径：`src-tauri/target/*/release/bundle/`

## 目录结构简介

- `src/` 前端源码（页面、组件、题型、状态管理等）
- `src-tauri/` Tauri 配置与 Rust 后端
- `public/data/` 示例题库数据

## 参考
- [Tauri 官方文档](https://tauri.app/zh-cn/docs/)
- [Tauri Action](https://github.com/tauri-apps/tauri-action)
