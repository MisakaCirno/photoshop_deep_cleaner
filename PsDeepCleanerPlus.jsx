/**
 * 原项目地址：https://github.com/julysohu/photoshop_deep_cleaner
 * 本项目地址：https://github.com/MisakaCirno/photoshop_deep_cleaner_plus
 */

/*
 * 更新日志
 *
 * 版本：V2.1.0
 * - 将核心函数封装为对象，提高代码的可复用性。
 * 
 * 版本：V2.0.0
 * - 重构代码，提高可读性；
 * - 修改为中文提示，更加友好；
 * - 修复统计信息不准确的问题，添加文件大小减小量的统计。
 */

//#region 通用函数定义
/**
 * $.write的包装函数
 * @param {*} content 要输出的内容
 */
function log(content) {
    $.write(content);
}

/**
 * $.writeln的包装函数
 * @param {*} content 要输出的内容
 */
function logL(content) {
    $.writeln(content);
}
//#endregion

//#region 核心函数定义
/**
 * 创建清理工具对象
 */
function createCleaner() {
    return {
        /**
         * 删除当前打开文档中的祖先元数据
         */
        deleteDocumentAncestorsMetadata: function () {
            // 使用XMPMeta的代码请参考：https://extendscript.docsforadobe.dev/scripting-xmp/accessing-the-xmp-scripting-api.html

            // 导入外部AdobeXMPScript对象
            if (ExternalObject.AdobeXMPScript == undefined) {
                ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
            }

            var rawDataLengthBefore = app.activeDocument.xmpMetadata.rawData.length;

            // 删除文档祖先元数据
            var xmp = new XMPMeta(app.activeDocument.xmpMetadata.rawData);
            xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");

            // 重新写入文档
            app.activeDocument.xmpMetadata.rawData = xmp.serialize();

            var rawDataLengthAfter = app.activeDocument.xmpMetadata.rawData.length;

            // 计算删掉的文本内容长度
            this.statisticData.RemoveDataLength += rawDataLengthBefore - rawDataLengthAfter;

            // 清除所有图层的文档祖先元数据
            this.clearDocumentAncestorsForAllLayers(app.activeDocument);

            // 保存文档
            // 这里是为了处理智能对象，在编辑智能对象时，会打开一个新的标签页，也就相当于打开了新的文档。
            // 所以需要判断当前文档是否是目标文档，如果不是则关闭文档，如果是则保存文档。        

            if (this.DEBUG_IS_SAVE_DOCUMENT) {
                if (app.activeDocument !== this.targetDocument) {
                    app.activeDocument.close(SaveOptions.SAVECHANGES);
                    this.statisticData.ArtLayerSmartObject++;

                } else {
                    app.activeDocument.save();
                    this.statisticData.PSDocument++;
                }
            }
        },

        /**
         * 清理当前节点下所有图层的祖先元数据，当前节点可能是文档或图层组
         * @param {*} node 节点，可能是文档或图层组
         */
        clearDocumentAncestorsForAllLayers: function (node) {
            /**
             * 说明：
             * PS中实际文件是一个树形结构，文档就是这个树形结构的根节点，而文件夹（组）也是一种节点。
             * 由于代码层面获取到的东西是类似的，因此，此处以“节点”代指获取到的东西。
             * 
             * 区分不同节点的方式：
             * 
             * type：
             * - ArtLayer 普通图层
             * - LayerSet 图层组
             * 
             * kind：
             * - LayerKind.NORMAL 普通图层
             * - LayerKind.SMARTOBJECT 智能对象
             * - undefined 图层组
             */


            try {
                if (node == undefined) {
                    return;
                }

                if (node.layers.length == 0) {
                    return;
                }

                // 遍历文档所有图层
                for (var i = 0; i < node.layers.length; i++) {
                    var curLayer = node.layers[i];

                    // 如果是图层组，则递归处理
                    if (curLayer.typename == "LayerSet") {
                        this.clearDocumentAncestorsForAllLayers(curLayer);
                        continue;
                    }

                    // 如果是智能对象图层，还需要打开之后再进行清理
                    if (curLayer.kind == "LayerKind.SMARTOBJECT") {
                        var visible = curLayer.visible;

                        app.activeDocument.activeLayer = curLayer;

                        // 编辑智能对象
                        var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
                        var actionDescriptor = new ActionDescriptor();
                        executeAction(idplacedLayerEditContents, actionDescriptor, DialogModes.NO);

                        // 删除文档祖先元数据
                        if (app.activeDocument.activeLayer == curLayer) {
                            continue;
                        }

                        // 针对智能对象也需要清理祖先元数据
                        this.deleteDocumentAncestorsMetadata()
                        this.statisticData.ArtLayerSmartObject++;

                        curLayer.visible = visible;
                    }

                    // 如果是普通图层，就不需要做处理了
                }
            } catch (e) {
                var stopString =
                    "对于文件（或图层）：" + node + "的清理操作失败！\n" +
                    "异常信息：" + e;

                alert(stopString, "清理失败！", true)
            }
        },

        /**
         * 统计数据对象
         */
        statisticData: {
            /**
             * 处理过的PS文件数量
             */
            PSDocument: 0,
            /**
             * 处理过的智能对象图层数量
             */
            ArtLayerSmartObject: 0,
            /**
             * 总共删除的数据长度
             */
            RemoveDataLength: 0
        },

        /**
         * 清空统计数据
         */
        clearStatisticData: function () {
            this.statisticData.PSDocument = 0;
            this.statisticData.ArtLayerSmartObject = 0;
            this.statisticData.RemoveDataLength = 0;
        },

        /**
         * 是否在修改后直接保存文档
         * 由于智能对象必须保存，所以这个仅应用于当前的文档
         * 用于DEBUG
         */
        DEBUG_IS_SAVE_DOCUMENT: true,

        /**
         * 执行脚本时，打开的PSD文件
         */
        targetDocument: null,

        /**
         * 开始处理当前打开的文档。
         */
        startProcessDocument: function () {
            try {
                // 检查当前应用是否为Photoshop
                if (String(app.name).search("Photoshop") <= 0) {
                    alert("该脚本仅适用于Photoshop，请在Photoshop中使用！", "提示", true)
                    return;
                }

                // 检查是否有打开的文档
                if (!documents.length) {
                    alert("当前没有打开的文档，请打开一个文件后再运行此脚本。", "提示", true)
                    return;
                }

                this.clearStatisticData();

                this.targetDocument = app.activeDocument;

                var reminderString =
                    "本脚本将清理当前打开的PSD文件的祖先元数据。\n" +
                    "请注意：\n" +
                    "清理开始后，请勿操作Photoshop。等待清理结束的弹窗出现后，再进行其他操作！\n" +
                    "清理结束后，会保存当前文件的所有修改。\n\n" +
                    "是否开始清理当前文档？";

                if (confirm(reminderString, true, "请确认")) {

                    var oldFileSize = this.targetDocument.fullName.length;

                    this.deleteDocumentAncestorsMetadata();

                    var newFileSize = this.targetDocument.fullName.length;

                    var sizeChange = oldFileSize - newFileSize;

                    var workDoneString =
                        "对【" + this.targetDocument.name + "】文件的清理工作已完成！\n\n" +

                        "已处理:\n" +
                        "PSD文件：" + this.statisticData.PSDocument + " 个\n" +
                        "智能对象：" + this.statisticData.ArtLayerSmartObject + " 个\n\n" +

                        "清理了：" + this.statisticData.RemoveDataLength + " 字节的祖先数据\n" +
                        "文件瘦身约：" + (sizeChange / 1024 / 1024).toFixed(2) + " MB（" + sizeChange + " 字节）\n\n" +

                        "当前文件的所有更改均已保存。";

                    alert(workDoneString, "清理完成！", false);
                }
            } catch (e) {
                var errorString =
                    "由于异常，清理工作提前终止。\n" +
                    "异常信息：" + e;

                alert(errorString, "清理失败！", true)
            }
        }
    }
}
//#endregion

//#region 代码执行入口
cleaner = createCleaner();
cleaner.startProcessDocument();
//#endregion