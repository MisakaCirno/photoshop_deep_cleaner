﻿// 可以通过这种方式引用其他的JS文件
// 官方建议使用.jsxinc作为后缀名
#include "Common.jsxinc"

/* 一些测试PS功能的代码 */

logL("= = = = =");

function combine(){
    const arr = ["apple", "banana", "cherry"];
    const result = arr.join("\n");
    logL(result);
}

function getInfo() {
    // 获取当前的文档
    var targetDocument = app.activeDocument;
    logL("document name: " + targetDocument);

    // 获取当前文件的所有图层
    var allLayers = targetDocument.layers;
    logL("layer length: " + allLayers.length);

    // 遍历所有图层，并打印信息
    for (var i = 0; i < allLayers.length; i++) {
        var curLayer = allLayers[i];
        var layerLength = -1;
        if (curLayer.layers == undefined) {
            layerLength = 0;
        }
        else {
            layerLength = curLayer.layers.length;
        }

        logL("name: " + curLayer.name + "| type: " + curLayer.typename + "| kind: " + curLayer.kind + "| length: " + layerLength);
    }

    // 选中某个图层
    // 注意，选中图层后，这个图层会强制设置为显示，即使原来是隐藏的
    // 因此要保持原来的显示状态，需要用代码还原回去
    targetDocument.activeLayer = allLayers[0];
}

function getMetadata() {
    // 导入外部AdobeXMPScript对象
    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }

    var rawDataLength = app.activeDocument.xmpMetadata.rawData.length;

    // logL("原始内容：" + app.activeDocument.xmpMetadata.rawData);
    logL("原始长度：" + rawDataLength);

    /*
    var xmp = new XMPMeta(app.activeDocument.xmpMetadata.rawData);
    
    var content = xmp.getProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
    
    xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
    
    app.activeDocument.xmpMetadata.rawData = xmp.serialize();
    */
}

function writeTextFile() {
    /*
    var file = new File("D:/PSFileSaveTest/test.txt");
    file.encoding = "UTF8";
    file.open("w");
    file.write(app.activeDocument.xmpMetadata.rawData);
    file.close();
    var t = 1;
    */
}

function openFileInPS() {
    var file = new File("D:\\Python\\MyProject\\FindLargeImageFile\\未标题-1.png");
    var doc = app.open(file);
}

function testDefaultValue(value){
    if(value == undefined){
        value = false;
    }
    logL(value);
}

function main(){
    // openFileInPS();
    testDefaultValue();
    testDefaultValue(true);
    testDefaultValue(false);
}

main();