# 清理PSD文件脚本

## 原作者信息
原项目地址：https://github.com/julysohu/photoshop_deep_cleaner

原项目作者：https://github.com/julysohu

由于原项目已许久未维护，且项目中一些功能需要改进。

故fork了本仓库，并改名为Photoshop Deep Cleaner Plus。

## PSD文件过大的原因

### 什么是原始数据？
在PS的使用过程中，PS会将一些信息存储在文件的`原始数据（Metadata）`之中。

例如创建时间、修改时间、使用的软件版本等信息。

通过 **文件 --> 文件简介 --> 原始数据**，可以查看到它的内容。

但如果`原始数据`过多时，在这个界面也是无法直接查看内容的。

### 谁向原始数据中添加了那么多内容？

导致`原始数据`内容过多的原因是，PS会向`原始数据`中，存储一种叫做`文档祖先（DocumentAncestors）`的信息。

很多操作都会让PS向其中添加记录内容（例如复制功能），从而导致PS文件逐渐变大。

> 官方说明：
> 
> If the source document for a copy-and-paste or place operation has a document ID, that ID is added to this list in the destination document's XMP.
> 
> （如果复制粘贴或放置操作的源文档具有文档ID，则将该ID添加到目标文档的XMP中。）

这种记录很难被用户直接察觉，且无法直接通过PS的功能清理。

### 为什么需要处理智能对象？

另外，PS中的`智能对象`实际上也是一种PS的文件。

因此，它也会存储`文档祖先`信息。

### 可以删除掉这些内容吗？

在`文档祖先`中的数据，对于一般用户来说，几乎没有应用场景。

所以，我们可以通过清理`文档祖先`的方式，来减小PSD文件的大小。

## 脚本工作原理

本脚本通过调用PS中脚本读写`原始数据`的功能，将`原始数据`中的`祖先对象`清空，从而达到清理PSD文件的目的。

## 工具特点

- 支持递归清理文档中的智能对象，清理更加彻底；
- 修改为全中文提示，方便使用；
- 显示清理前后的文件大小变化，方便用户查看清理效果；
- 详尽的备注，方便开发者做扩展。

## 使用说明

1. 下载本项目的压缩包，解压到本地。
2. 在Photoshop中打开psd文件，菜单栏选择 **文件 --> 脚本 --> 浏览**。
3. 选择脚本文件：
   - 选择 PsDeepCleanerPlus.jsx 文件针对当前文件进行处理；
   - 选择 PsDeepCleanerPlusForFolder.jsx 对指定路径下所有指定格式的文件处理。
4. 根据提示执行脚本。

## 参考链接

- https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug
- https://extendscript.docsforadobe.dev/scripting-xmp/accessing-the-xmp-scripting-api.html
- https://github.com/Adobe-CEP/CEP-Resources/tree/master/Documentation/Product%20specific%20Documentation/Photoshop%20Scripting
- https://github.com/adobe/xmp-docs/blob/master/XMPNamespaces/photoshop.md
- https://helpx.adobe.com/photoshop/using/scripting.html
