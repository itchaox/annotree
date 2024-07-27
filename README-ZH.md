<p align="center">
 <img src="/resources/icon.png" width="32" alt="Annotree" style="width: 150px; height: 150px;">
</p>

<div align="center">
<h1>
Annotree 注释树
</h1>
</div>

<p align="center">一款生成带注释的目录树工具，大大方便技术文档的编写</p>

<p align="center">
 <img  src="https://img.shields.io/github/v/tag/itchaox/annotree?label=version&color=90d799" alt="version" style="margin-right: 2px"/>
  <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=blue" alt="license" />
</p>

<p align="center">
<a href="/README-ZH.md">中文</a> |
<a href="/README.md">EN</a>
</p>

## 项目介绍

> 本项目基于 [folder-explorer](https://github.com/d2-projects/folder-explorer) 进行二次开发，🙏🏻 非常感谢 [FairyEver](https://github.com/FairyEver) 的创意和贡献！

这是我的第一个正式开源项目，如果对你有帮助，感谢 Star ⭐️ 和分享给你的朋友们 ，这对我很重要，谢谢 💗！

官方文档：https://annotree.com

视频讲解：https://www.bilibili.com/video/BV1fS421R7UM

**软件最新版本下载地址，请访问 [Github Release](https://github.com/itchaox/annotree/releases)**

## 效果预览 🎉

![demo](/resources/demo.gif)

## 反馈渠道

现在项目还处于 mvp（最简可行产品）阶段，如果你有任何意见或建议，欢迎通过以下方式与我联系：

- 提交 [GitHub Issue](https://github.com/itchaox/annotree/issues)
- 飞书群 [点击入群](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=e0aoc0d1-0df2-4cec-bb6f-97da6e754f5e)
  > 我为何选择飞书群作为社区沟通渠道：
  >
  > - 我平时飞书用的较多，沟通方便。
  > - 飞书话题群沟通问题，效率更高。

<!-- 官方文档： -->

## 为何二次开发

1.  folder-explorer 部分功能我用不上，对我而言比较冗余，不符合自己的使用习惯。
2.  folder-explorer 每次配置后，都需要导出后才能看到配置的效果，我觉得使用起来不方便，我希望有实时预览效果。
3.  folder-explorer 在编辑备注时，每次都需要右键打开编辑备注菜单，我个人使用起来觉得不是很方便。

## 功能特性

1. ✨ 实时预览：无需导出文本，即可实时查看注释文件树的效果，让文档编写更加直观高效。
2. 🖊️ 便捷注释：通过切换输入框轻松编写注释，避免繁琐的右键菜单操作，提高使用效率。
3. 🚫 文件和文件夹忽略：支持忽略特定文件夹和文件类型，确保只展示你需要的文件结构，保持文件树的简洁。
4. 📂 自动打开导出文件：导出文件后自动打开，无需手动查找文件，节省时间，让工作流程更加流畅。

## 功能介绍

- 扫描：点击扫描按钮后打开文件选择器，选择需要扫描的文件夹，即可开始扫描。

### 全局配置

- 自动打开文件：导出文件后自动打开。
- 忽略文件夹：忽略不需要扫描的文件夹，避免性能损失甚至程序失去响应，比如：node_modules 文件夹，程序内部已自动忽略 node_modules 文件夹。
- 忽略以 "." 开头的文件夹：这类文件夹在 MacOS 和 Linux 上是默认隐藏的文件夹。
- 只扫描文件夹：忽略所有文件，只扫描文件夹。
- 忽略以 "." 开头的文件：这类文件在 MacOS 和 Linux 上是默认隐藏的文件。
- 忽略文件类型：可以选择忽略不需要的文件类型，以提高扫描效率。
- 扫描深度：设置扫描目录的深度，0 为所有深度，每递增一个数字则代表扫描深度 +1。
- 默认名称：导出文本的默认名称配置。

### 预览区配置

- 注释格式化：填充注释的格式
- 桥梁最短字符数：路径最长的地方，显示的桥梁字符数
- 桥梁填充字符：输入一个单字节填充字符，比如：\*，\#，\$，\-，\@，\_ 等。
- 始终显示桥梁：配置没有注释的地方是否显示桥梁。
- 导出：设置好相关配置，编写好注释后，导出注释文件树形结构。

## Star History Chart ⭐️

[![Star History Chart](https://api.star-history.com/svg?repos=itchaox/annotree&type=Date)](https://star-history.com/#itchaox/annotree&Date)

## 致谢

1. 感谢 [electron-vite](https://github.com/alex8088/electron-vite) 提供的 electron 框架，大大提升我的开发效率。
2. 感谢 [md](https://github.com/doocs/md) 提供给我的 README.md 文档思路。

## 谁在使用

> 如果你使用了本 Annotree 工具生成带注释的项目文件树形结构，并且希望在本项目 README 中展示你的项目，请到 [Discussions #2](https://github.com/itchaox/annotree/discussions/2) 留言。

- [Annotree](https://github.com/itchaox/annotree)
