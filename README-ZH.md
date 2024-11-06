<p align="center">
 <img src="/resources/icon.png" width="32" alt="Annotree" style="width: 150px; height: 150px;">
</p>

<div align="center">
<h1>
Annotree 注释树
</h1>
</div>

<p align="center">生成文件夹目录注释树，让技术文档编写变得轻松高效！</p>

<p align="center">
 <img  src="https://img.shields.io/github/v/tag/itchaox/annotree?label=version&color=90d799" alt="version" style="margin-right: 2px"/>
  <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=blue" alt="license" />
</p>

<p align="center">
<a href="/README-ZH.md">中文</a> |
<a href="/README.md">English</a>
</p>

## 项目介绍

### 基本情况 📗

> 本项目基于 [folder-explorer](https://github.com/d2-projects/folder-explorer) 进行二次开发，🙏🏻 非常感谢 [FairyEver](https://github.com/FairyEver) 的创意和贡献！

Annotree（Annotate + Tree）是一款专为生成文件夹目录注释树而设计的桌面软件，旨在简化技术文档的编写过程。通过直观的可视化操作界面，你可以轻松创建文件夹目录注释树。

系统支持： Mac、Windows 和 Linux。

> 如果你需要生成文件夹目录注释树，一定要试试 Annotree 🌲，它绝对不会让你失望 🥳。

这是我的首个正式开源项目，如果它对你有帮助， 请给我一个 Star ⭐️ 并分享给你的朋友们，这对我意义重大，谢谢 💖！<br>
你的反馈和支持 💯，是我不断改进和积极更新软件的最大动力~

- 官方文档：https://annotree.com<br>
- **软件最新版本下载地址，请访问 [Github Release](https://github.com/itchaox/annotree/releases)**

### 视频教程 📽️

> 我在 B 站发布了一些介绍 Annotree 功能的视频，欢迎大家前往观看。<br>
> 第 1 期视频：https://www.bilibili.com/video/BV1fS421R7UM<br>
> 第 2 期视频：https://www.bilibili.com/video/BV1Tz421B7AY<br>
> 第 3 期视频：https://www.bilibili.com/video/BV1bXvoe4EUT<br>
> 我还是 B 站的一位小 up，欢迎大家多多支持！如果这些视频对你有帮助，感谢你的一键三连和关注~ 🤩

## 效果预览 🎉

![demo](/resources/demo-zh.gif)

## 项目结构 📇

![](/resources//Project%20Structure.jpeg)

## 功能特性

1. ✨ 实时预览：修改配置后，实时预览文件夹目录树的效果。
2. 🖊️ 便捷注释：通过简单切换输入框来编写注释，显著提升使用效率。
3. 🚫 文件和文件夹忽略：轻松忽略不需要的文件和文件夹，确保目录树只展示你关心的内容。
4. 📂 自动打开导出文件：导出文件后自动打开，节省时间，让工作流程更加流畅。

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

## 反馈渠道

如果你有任何意见或建议，欢迎通过以下方式与我联系：

- 提交 [GitHub Issue](https://github.com/itchaox/annotree/issues)
- Annotree 微信交流群

  > 欢迎添加微信群进行沟通~ 💗，在微信群中能够更加实时高效的沟通

  ![](/resources//wechat.jpg)

## 为何二次开发

1. folder-explorer 的某些功能对我来说不必要，显得有些冗余，且不符合我的使用习惯。
2. folder-explorer 需要导出后才能看到配置后的效果，我希望能够实现实时预览功能。
3. folder-explorer 中编辑备注时，每次都需右键打开编辑菜单，这种操作方式不够方便。

## 💗 赞助我

- 如果这个项目对你有所帮助，欢迎赞助支持！☕️
- 你的每一份支持都将激励我不断改进项目，为大家提供更好的工具。非常感谢！🙏🏻
- 如果暂时无法赞助，给个 Star ⭐ 也是对我莫大的支持！

<h3>赞助方式 🎉</h3>
<img src="/resources/love.png" width="400" alt="爱发电">

## Star 历史图表 ⭐️

[![Star History Chart](https://api.star-history.com/svg?repos=itchaox/annotree&type=Date)](https://star-history.com/#itchaox/annotree&Date)

## 致谢

1. 感谢 [electron-vite](https://github.com/alex8088/electron-vite) 提供的 electron 框架，大大提升我的开发效率。
2. 感谢 [md](https://github.com/doocs/md) 提供给我的 README.md 文档思路。

## 谁在使用

> 如果你使用了本 Annotree 工具生成带注释的项目文件树形结构，并且希望在本项目 README 中展示你的项目，请到 [Discussions #2](https://github.com/itchaox/annotree/discussions/2) 留言。

- [Annotree](https://github.com/itchaox/annotree)
