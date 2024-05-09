#include "Common.jsxinc"
#include "CleanerCore.jsxinc"


function main() {
    // 检查当前应用是否为Photoshop
    if (String(app.name).search("Photoshop") <= 0) {
        alert("该脚本仅适用于Photoshop，请在Photoshop中使用！", "提示", true)
        return;
    }

    // 弹出一个选择路径的窗口
    var targetFolder = Folder.selectDialog("请选择要处理的文件夹：");

    if (targetFolder != null) {
        logL("目标文件夹为: " + targetFolder);

        var files = getAllFilesInFolder(targetFolder, ["psd","psb"]);

        if (files.length == 0) {
            var content = "在目标文件夹下没有发现任何目标格式文件。";
            logL(content);
            alert(content);
            return;
        }
        else{
            logL("在目标文件夹下发现了：" +  files.length + " 个目标格式文件。");
        }

        var outputCSVContent = ["File Full Path,Previous File Size,Before File Size"];
        var totalFileSizeDiff = 0;

        // 遍历文件开始处理
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // 在PS中打开文件
            var doc = app.open(file);

            app.activeDocument = doc;

            // 开始处理文件
            var cleaner = createCleaner();
            cleaner.startProcessDocument(true);

            // 记录数据
            outputCSVContent.push(file.fsName + "," + cleaner.statisticData.OldFileSize + "," + cleaner.statisticData.NewFileSize);
            totalFileSizeDiff += cleaner.statisticData.FileSizeDifference;

            // 保存并关闭文件
            doc.close(SaveOptions.SAVECHANGES);

            logL(i + " / " + files.length);
        }

        // 输出处理结果，文件名包括当前时间
        var outputFileName = "处理结果_" + new Date().getTime() + ".csv";
        var outputFile = new File(targetFolder + "/" + outputFileName);
        outputFile.encoding = "UTF8";
        outputFile.open("w");
        outputFile.write(outputCSVContent.join("\n"));
        outputFile.close();

        alert("处理完成，处理结果已经保存到：" + outputFile.fsName + "，总共减小了：" + bytesToMB(totalFileSizeDiff) + " MB（" + totalFileSizeDiff + " 字节）");
    }
}

main();
