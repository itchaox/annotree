<p align="center">
 <img src="/resources/icon.png" width="32" alt="Annotree" style="width: 150px; height: 150px;">
</p>
<div align="center">
<h1>
Annotree
</h1>
</div>
<p align="center">A tool for generating annotated directory trees, greatly facilitating the writing of technical documentation</p>
<p align="center">
 <img  src="https://img.shields.io/github/v/tag/itchaox/annotree?label=version&color=90d799" alt="version" style="margin-right: 2px"/>
  <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=blue" alt="license" />
</p>
<p align="center">
<a href="/README.md">中文</a> |
<a href="/README-EN.md">EN</a>
</p>

## Project Introduction

> This project is based on [folder-explorer](https://github.com/d2-projects/folder-explorer) and has been further developed. Thanks to [FairyEver](https://github.com/FairyEver) for the creativity and contribution!

This is my first official open-source project. If it helps you, please Star ⭐️ and share it with your friends. It means a lot to me, thank you 💗!

Official documentation: https://annotree.com

**For the latest version download, please visit [Github Release](https://github.com/itchaox/annotree/releases)**

> Tips：Our project currently only supports Chinese language, but will soon support English language as well. You can star⭐️ this project to stay updated with the latest information. Thank you for your interest💗!

## Preview 🎉

![demo](/resources/demo.gif)

## Feedback Channels

The project is currently in the MVP (Minimum Viable Product) stage. If you have any opinions or suggestions, please feel free to contact me through the following ways:

- Submit a [GitHub Issue](https://github.com/itchaox/annotree/issues)
- Feishu Group [Click to join the group](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=e0aoc0d1-0df2-4cec-bb6f-97da6e754f5e)

> Why I chose Feishu group as the community communication channel:
>
> I use Feishu more often, which makes communication convenient.
> Feishu topic groups are more efficient for discussing issues.

## Why Further Development

1. Some features of folder-explorer were redundant for me and didn't fit my usage habits.
2. In folder-explorer, you need to export to see the configuration effect each time, which I found inconvenient. I wanted real-time preview.
3. When editing notes in folder-explorer, you need to right-click to open the edit note menu each time, which I personally found not very convenient.

## Features

1. ✨ Real-time preview: View the annotated file tree effect in real-time without exporting text, making document writing more intuitive and efficient.
2. 🖊 Convenient annotation: Easily write annotations by switching input boxes, avoiding cumbersome right-click menu operations and improving efficiency.
3. 🚫 File and folder ignoring: Support ignoring specific folders and file types, ensuring only the file structure you need is displayed, keeping the file tree concise.
4. 📂 Automatic opening of exported files: Automatically open files after exporting, no need to manually search for files, saving time and making the workflow smoother.

# Feature Introduction

## Scanning

> After clicking the scan button, open the file selector, choose the folder you want to scan, and start scanning.

## Global Configuration

### Automatically Open Files

> Automatically open files after exporting.

### Ignore Folders

> Ignore folders that don't need to be scanned to avoid performance loss or even program unresponsiveness, such as the node_modules folder. The program automatically ignores the node_modules folder internally.

### Ignore Folders Starting with "."

> These folders are hidden by default on MacOS and Linux.

### Scan Only Folders

> Ignore all files and scan only folders.

### Ignore Files Starting with "."

> These files are hidden by default on MacOS and Linux.

### Ignore File Types

> After scanning once, all file types from this scan will be generated. You can choose to ignore unnecessary file types to improve scanning efficiency.

### Scanning Depth

> Set the depth of directory scanning. 0 means all depths, each increment in number represents +1 scanning depth.

### Default Name

> Configure the default name for exported text.

## Preview Area Configuration

### Annotation Formatting

> Format for filling in annotations

### Minimum Bridge Characters

> Number of bridge characters displayed at the longest path

### Bridge Fill Character

> Enter a single-byte fill character, such as: \*, #, $, -, @, \_, etc.

### Always Show Bridge

> Configure whether to display the bridge where there are no annotations.

## Export

> After setting the relevant configurations and writing annotations, export the annotated file tree structure.

## Star History Chart ⭐️

[![Star History Chart](https://api.star-history.com/svg?repos=itchaox/annotree&type=Date)](https://star-history.com/#itchaox/annotree&Date)

## Acknowledgements

1. Thanks to [electron-vite](https://github.com/alex8088/electron-vite) for providing the electron framework, which greatly improved my development efficiency.
2. Thanks to [md](https://github.com/doocs/md) for providing me with README.md document ideas.

## Who's Using It

If you've used the Annotree tool to generate an annotated project file tree structure and would like to showcase your project in this README, please leave a message at [Discussions #2](https://github.com/itchaox/annotree/discussions/2).

- [Annotree](https://github.com/itchaox/annotree)
