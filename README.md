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
<a href="/README-ZH.md">中文</a> |
<a href="/README.md">English</a>
</p>

## Project Introduction

> This project is based on [folder-explorer](https://github.com/d2-projects/folder-explorer) and has been further developed. Thanks to [FairyEver](https://github.com/FairyEver) for the creativity and contribution!

This is my first official open-source project. If it helps you, please Star ⭐️ and share it with your friends. It means a lot to me, thank you 💗!

Official documentation: https://annotree.com

**For the latest version download, please visit [Github Release](https://github.com/itchaox/annotree/releases)**

## Preview 🎉

![demo](/resources/demo-en.gif)

## Project Structure 📇

![](/resources//Project%20Structure.jpeg)

## Feedback Channels

The project is currently in the MVP (Minimum Viable Product) stage. If you have any opinions or suggestions, please feel free to contact me through the following ways:

- Submit a [GitHub Issue](https://github.com/itchaox/annotree/issues)

## Why Further Development

1. Some features of folder-explorer were redundant for me and didn't fit my usage habits.
2. In folder-explorer, you need to export to see the configuration effect each time, which I found inconvenient. I wanted real-time preview.
3. When editing notes in folder-explorer, you need to right-click to open the edit note menu each time, which I personally found not very convenient.

## Features

1. ✨ Real-time preview: View the annotated file tree effect in real-time without exporting text, making document writing more intuitive and efficient.
2. 🖊 Convenient annotation: Easily write annotations by switching input boxes, avoiding cumbersome right-click menu operations and improving efficiency.
3. 🚫 File and folder ignoring: Support ignoring specific folders and file types, ensuring only the file structure you need is displayed, keeping the file tree concise.
4. 📂 Automatic opening of exported files: Automatically open files after exporting, no need to manually search for files, saving time and making the workflow smoother.

## Feature Introduction

- After clicking the scan button, open the file selector, choose the folder you want to scan, and start scanning.

### Global Configuration

- Automatically open files: automatically open files after exporting.
- Ignore folders: ignore folders that do not need to be scanned to avoid performance loss or even program unresponsiveness, such as the node_modules folder, which is automatically ignored by the program.
- Ignore folders starting with ".": These folders are hidden by default on MacOS and Linux.
- Scan only folders: ignore all files and only scan folders.
- Ignore files starting with ".": These files are hidden by default on MacOS and Linux.
- Ignore file types: you can choose to ignore unnecessary file types to improve scanning efficiency.
- Scan depth: set the depth of the scan directory, 0 means all depths, and each increment represents a scan depth +1.
- Default name: the default name configuration for exported text.

### Preview area configuration

- Annotation formatting: the format of the fill annotation
- Minimum number of bridge characters: the number of bridge characters displayed at the longest path
- Bridge fill character: enter a single-byte fill character, such as: \*, \#, \$, \-, \@, \_, etc.
- Always show bridges: configure whether to show bridges where there are no comments.
- Export: set the relevant configuration, write the comments, and export the annotation file tree structure.

## Star History Chart ⭐️

[![Star History Chart](https://api.star-history.com/svg?repos=itchaox/annotree&type=Date)](https://star-history.com/#itchaox/annotree&Date)

## Acknowledgements

1. Thanks to [electron-vite](https://github.com/alex8088/electron-vite) for providing the electron framework, which greatly improved my development efficiency.
2. Thanks to [md](https://github.com/doocs/md) for providing me with README.md document ideas.

## Who's Using It

If you've used the Annotree tool to generate an annotated project file tree structure and would like to showcase your project in this README, please leave a message at [Discussions #2](https://github.com/itchaox/annotree/discussions/2).

- [Annotree](https://github.com/itchaox/annotree)
