# ExtendScript Debugger Extension for VS Code

一个 VS Code 扩展，可在启用了 ExtendScript 的 Adobe 应用程序中调试 ExtendScript 脚本和扩展。

> _**Warning for Apple Silicon Users (e.g. M1)**_: The extension does not run in native builds of VS Code but it **does** work with Intel/universal builds using Rosetta. Please see the [Known Issues](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#known-issues) below for information on how to use the extension.
> _**对于使用苹果芯片用户的警告（例如M1）**_：该扩展不在 VS Code 的原生版本中运行，但在使用 Rosetta 的 Intel/通用版本中**可以**正常工作。请参见下面的[已知问题](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#known-issues)以获取有关如何使用该扩展的信息。

## 支持的功能

- [Breakpoints](https://code.visualstudio.com/docs/editor/debugging#_breakpoints)
    - [Conditional Breakpoints](https://code.visualstudio.com/docs/editor/debugging#_conditional-breakpoints)
        - Expression Condition
        - Hit Count
    - Exception Breakpoints
        - Caught Exceptions **¹**
- [Logpoints](https://code.visualstudio.com/docs/editor/debugging#_logpoints)
- Variables View
    - Local and Global Scope
    - Modify variables
- Watch View
- Call Stack View
- [Debug Actions](https://code.visualstudio.com/docs/editor/debugging#_debug-actions)
    - Continue / Pause
    - Step Over
    - Step Into
    - Step Out
    - Restart
    - Disconnect / Stop
- [Debug Console](https://code.visualstudio.com/docs/editor/debugging#_debug-console-repl)
    - Expression Evaluation
- Expression Evaluation of Code on Hover **²**
- Script Evaluation and Halting
- Export ExtendScript to JSXBin

**¹** _在脚本运行或停在断点时更改已捕获异常设置，只会应用于更改设置后创建的作用域。_
**²** _需要活动的调试会话。_

## 不支持的功能

- Profiling Support
- Object Model Viewer (OMV)
- Auto-Completion
- Scripts Panel

## 开始使用

### 安装

通过[通常的方式](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-an-extension)[安装扩展](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug)

扩展需要v1.62或更新的VS Code。

### 从V1版本迁移

ExtendScript Debugger V2 是 V1 版本的完全重写。内部进行了全面的改写，大大提高了稳定性、性能、灵活性，并改进了与 VS Code 的原生功能的兼容性。由于这次改写，启动配置属性已更改。以下是已更名的属性表：

|V1|V2|
|---|---|
|`targetSpecifier`|`hostAppSpecifier`|
|`program`|`script`|
|`excludes`|`hiddenTypes`|

`engineName` 和 `debugLevel` 属性保持不变。所有其他 V1 属性已被删除并将被忽略。请参见[高级配置](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#advanced-configuration)部分，了解 V2 中可用的所有配置属性。

此外，扩展的操作方式发生了 _巨大_ 的变化。强烈建议您阅读以下部分，因为它提供了如何使用这个扩展的概述，以及三种常见的用例。

## 使用 Debugger

该扩展旨在支持各种使用情况。下面概述了三种常见的使用情况，为如何使用某些功能提供指导。

### 运行脚本

本扩展支持在主机应用程序中运行（评估）脚本，而无需激活调试会话。此功能可以通过 [`Evaluate Script in Host...`](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#evaluate-script-in-host) 命令触发，也可以通过单击 [_Eval in Adobe..._](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#eval-in-adobe-button) 按钮触发。

### 调试脚本

在扩展中调试脚本的最直接方法是启动一个配置为 `launch` [请求类型](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#attach-and-launch-mode-support) 的调试会话。这样的调试会话将连接到指定的主机引擎，通知它调试器是启用的，然后触发脚本评估。任何断点或未捕获的异常都会导致 VS Code 显示调试状态并启用与主机应用程序的交互。一旦脚本评估完成，调试会话将清理自己并关闭。

### 调试事件的回调

调试通过回调触发的 ExtendScript（例如使用 ScriptUI 或 [CEP](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#common-extensibility-platform-cep)）需要调试器在运行该脚本时连接。`launch` 调试会话仅在主机应用程序处理原始脚本时处于活动状态，因此在这些情况下会错过来自主机应用程序的调试消息。

要调试由回调触发的 ExtendScript，请启动一个配置为 `attach` [请求类型](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#attach-and-launch-mode-support) 的调试会话。这样的调试会话将连接到指定的主机引擎，通知它调试器是启用的，然后等待来自连接引擎的调试消息。在您的 `attach` 调试会话处于活动状态时，主机引擎遇到的任何断点或未捕获的异常都会导致 VS Code 显示调试状态并启用与主机应用程序的交互。此调试会话将保持活动状态，直到明确断开连接或停止。

补充说明：

- 脚本也可以在 `attach` 调试会话处于活动状态时[评估](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#running-a-script)。
- 特别是 CEP 环境可能会受益于[复合启动配置](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#compound-launch-configurations)，以同时调试两个脚本环境。
- 如果您的脚本通过符号链接加载到应用程序中（在 CEP 工作流程中最常见），则可能需要使用 `aliasPath` [配置属性](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#advanced-configuration) 来启用调试功能。

## 调试器配置

ExtendScript 调试器能够在有或没有标准 [launch 配置](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)的情况下进行调试。

### 无配置

如果您在项目中尚未定义 `launch.json` 文件，则[运行和调试视图](https://code.visualstudio.com/docs/editor/debugging#_run-view)将显示“运行和调试”按钮。如果单击此按钮，而被识别为“JavaScript”（`.js`）或“JavaScript React”（`.jsx`）的文件是 VS Code 中的活动文件，则您将在下拉列表中的调试器选项中选择“ExtendScript”。

当您选择了“ExtendScript”后，您将被要求选择一个[调试模式](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#attach-and-launch-mode-support)。一旦您做出选择，只需选择目标主机应用程序，如果适用，选择目标引擎，调试会话将开始。

### 启动配置

设置启动配置允许您简化和自定义启动调试会话的过程。首先，请按照[初始化启动配置](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)的标准步骤进行操作。

当您将新的 ExtendScript 配置添加到 `launch.json` 时，它将只包含启动调试所需的最小设置。下面显示了默认的 `attach` 请求配置：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "extendscript-debug",
            "request": "attach",
            "name": "Attach to ExtendScript Engine"
        }
    ]
}
```

有了上述的配置，您就可以在VS Code的调试和运行视图中选择“Attach To ExtendScript Engine”选项并启动调试会话。因为没有指定主机应用程序，所以扩展将查找已安装的应用程序，并显示一个列表，您可以从中选择一个目标。如果您选择的应用程序正在运行并支持多个引擎，那么扩展将询问应该调试哪个引擎。一旦您做出选择，调试会话就会开始。

查看下面的“高级配置”部分，了解可用配置选项的解释。

#### 附加和启动模式支持

VS Code [支持](https://code.visualstudio.com/docs/editor/debugging#_launch-versus-attach-configurations)两种调试会话请求类型：`attach` 和 `launch`。ExtendScript 调试器扩展支持这两种类型，并具有不同的含义：

- **`attach` 请求：** 具有请求类型 `attach` 的启动配置将连接到主机应用程序中运行的 ExtendScript 引擎，并向其提供活动断点信息列表。一旦建立了这种连接，无论是从主机应用程序本身触发还是通过 VS Code 中的评估过程触发，引擎处理的任何脚本都将激活断点和调试日志。连接将保持打开状态，直到使用“断开”或“停止”[调试操作](https://code.visualstudio.com/docs/editor/debugging#_debug-actions)明确关闭。
- **`launch` 请求：** 具有请求类型 `launch` 的启动配置将连接到主机应用程序中运行的 ExtendScript 引擎，并向其提供活动断点信息列表，然后触发指定脚本的评估。只要脚本评估过程没有结束，或者直到会话被明确关闭为止，生成的调试会话将保持活动状态，使用“停止”或“断开”[调试操作](https://code.visualstudio.com/docs/editor/debugging#_debug-actions)。

`attach` 和 `launch` 请求间最主要的区别是 `launch` 模式调试会话的生命周期直接与主机引擎处理脚本所需的时间长度相关。对于短脚本，这可能导致 VS Code 看起来“闪烁”进入和退出“调试器活动”状态。这对于 `attach` 配置不会发生，因为调试会话连接不与任何特定脚本评估相关。因此，强烈建议在调试包含异步回调的脚本（例如 ScriptUI 或 CEP）时使用 `attach` 请求调试会话。

#### 推荐的配置名称

VS Code [目前](https://github.com/microsoft/vscode/issues/151299) 使用一个“播放”按钮来表示 `attach` 和 `launch` 模式的调试配置。这可能会导致混淆，因为许多用户期望按下“播放”按钮会导致他们的脚本运行。当选择 `attach` 模式配置时，这将**不会**发生。因此，我们建议用户将他们的 `attach` 模式配置命名为“Attach to”，将 `launch` 模式配置命名为“Launch in”（或类似）以避免这种歧义。

#### 复合启动配置

ExtendScript 调试器扩展支持[复合启动配置](https://code.visualstudio.com/docs/editor/debugging#_compound-launch-configurations)。可能感兴趣的场景包括：

- **调试 CEP 上下文。** [CEP 扩展](https://github.com/Adobe-CEP/CEP-Resources) 支持两种主要的脚本上下文：JavaScript 上下文和 [ExtendScript 上下文](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#common-extensibility-platform-cep)。这些上下文可以通过特定的消息传递 API 进行交互。通过复合配置，只需单击一次，即可在 JavaScript 和 ExtendScript 上下文中启动调试会话。请参阅： 
    
    ```json
    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "chrome",
                "request": "attach",
                "name": "[Attach] CEP JavaScript",
                "port": 7777,   // <-- Whatever debug port you have configured.
                "webRoot": "${workspaceRoot}",
                "pathMapping": {
                    "/": "${workspaceRoot}"
                }
            },
            {
                "type": "extendscript-debug",
                "request": "attach",
                "name": "[Attach] CEP ExtendScript",
                "hostAppSpecifier": "premierepro-22.0"
            }
        ],
        "compounds": [
            {
                "name": "[Compound] Debug CEP",
                "configurations": [
                    "[Attach] CEP JavaScript",
                    "[Attach] CEP ExtendScript"
                ]
            }
        ]
    }
    ```

- **调试引擎间的消息传递。** 在同一或不同主机应用程序中的多个 ExtendScript 引擎之间来回传递信息时，同时调试两个引擎可能会有所帮助。复合启动配置（Compound Launch Configurations）可轻松实现这一点：
    
    ```json
    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "extendscript-debug",
                "request": "attach",
                "name": "Attach to InDesign Coordinator",
                "hostAppSpecifier": "indesign-17.064",
                "engineName": "MyCoordinator"
            },
            {
                "type": "extendscript-debug",
                "request": "attach",
                "name": "Attach to Premiere Pro",
                "hostAppSpecifier": "premierepro-22.0"
            }
        ],
        "compounds": [
            {
                "name": "[Compound] Debug ID-to-PPro",
                "configurations": [
                    "Attach to InDesign Coordinator",
                    "Attach to Premiere Pro",
                    // ...
                ]
            }
        ]
    }
    ```

请注意，启动配置中的 `name` 字段可以完全自定义，ExtendScript 调试器不会使用。在 `name` 字段中使用的 "[Attach]", "[Launch]", "[Compound]", "Attach to" 和 "Launch in" 仅用于帮助[配置消歧](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#recommended-configuration-names)。

### 高级配置

`attach` 和 `launch` 调试配置都接受以下配置选项：

|属性|类型|描述|默认值|
|---|---|---|---|
|`hostAppSpecifier`|string|要调试的主机应用程序的[应用程序标识符](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#identifying-application-specifiers)。|`""`|
|`engineName`|string|要定位的引擎的名称。|`""`|
|`hiddenTypes`|string[]|应在变量视图中隐藏的数据类型和类名的数组。有效名称包括：<br><br>- `"undefined"`<br>- `"null"`<br>- `"boolean"`<br>- `"number"`<br>- `"string"`<br>- `"object"`<br>- `"this"`<br>- `"prototype"`<br>- `"builtin"`<br>- `"Function"`<br>- 任何有效的 ExtendScript 类名<br><br>字符串 `"this"` 隐藏 `this` 对象。字符串 `"prototype"` 隐藏原型链中的所有元素，字符串 `"builtin"` 隐藏所有作为核心 ExtendScript 语言的一部分的元素。|`[]`|
|`aliasPath`|string|主机应用程序加载的根目录的文件系统别名（符号链接）的绝对路径。<br><br>如果脚本通过符号链接加载到主机应用程序中，则默认情况下调试器功能可能无法正常工作。这是由于 VS Code 使用的脚本路径（实际路径）与主机应用程序使用的路径（符号链接路径）之间的不匹配。`aliasPath` 属性使 ExtendScript 调试器扩展能够使用符号链接路径重写路径，从而与主机应用程序的视图相匹配。<br><br>为使此功能正常工作，加载到 VS Code 中的根目录必须是符号链接所指向的目录。<br><br>此工作流程在 CEP 项目中最常用。|`""`|
|`registeredSpecifier`|string|与主机应用程序在安装期间注册的应用程序标识符相匹配的辅助应用程序标识符，而不是它实际用于 BridgeTalk 通信的标识符。<br><br>_**注意：**这仅在特定情况下用于帮助主机应用程序连接。目前，只有 InDesign Server 连接使用此功能。_|`""`|


以下配置选项仅由 `launch` 调试配置接受：

|属性|类型|描述|默认值|
|---|---|---|---|
|`script`|string|要在主机应用程序中调试的脚本的绝对路径。如果未指定，则将使用活动编辑器的内容。|`""`|
|`bringToFront`|boolean|在启动调试会话时是否将主机应用程序置于前台。|`false`|
|`debugLevel`|number|调试级别：<br><br>- `0` - 无调试。<br>- `1` - 在断点、错误或异常处中断。<br>- `2` - 在第一行中断。|`1`|

**注意事项：**

- 如果 `script` 属性被指定了，那么只有脚本的**已保存**状态才会在主机应用程序中进行评估。换句话说，使用此属性指定脚本时，**未保存的修改将被忽略**。

### 调试

开始一个 ExtendScript `attach` 模式调试会话并不会在连接的主机应用程序中运行任何脚本 - 它只是通知主机应用程序调试器已准备好进行调试。有许多方法可以在 `attach` 模式调试会话处于活动状态时触发脚本运行：

- 在主机应用程序中直接运行脚本（具体细节由主机应用程序决定）。
- 在支持[调试 CEP 上下文](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#common-extensibility-platform-cep)的主机应用程序中加载 CEP 扩展。
- 与触发主机应用程序中的某些 ExtendScript 运行的 UI 元素进行交互（例如，在支持调试此类上下文的应用程序中的 CEP 扩展或 ScriptUI 中）。
- 运行 `ExtendScript: Evaluate Script in Host...` 命令。
- 运行 `ExtendScript: Evaluate Script in Attached Host...` 命令。

任何断点、错误或异常在 ExtendScript 调试会话处于活动状态时遇到，VS Code 都会显示调试状态并启用与主机应用程序的交互。

上述内容不适用于 `launch` 模式调试会话，因为 `launch` 模式调试会话在启动时会自动运行脚本。

#### 远程调试

ExtendScript Debugger 扩展目前不支持[远程调试](https://code.visualstudio.com/docs/editor/debugging#_remote-debugging)。

### 识别应用程序规范

每个 Adobe 应用程序都有一个唯一的[应用程序标识符](https://extendscript.docsforadobe.dev/interapplication-communication/application-and-namespace-specifiers.html#application-specifiers)。本扩展最常用的是 `hostAppSpecifier` 名称。可以通过启动一个没有设置 `hostAppSpecifier` 属性的调试会话来轻松发现特定已安装应用程序的应用程序标识符。当出现结果选择列表时，应用程序名称右侧的灰色文本就是该应用程序的标识符。

## VS Code 命令

ExtendScript Debugger 扩展向 VS Code 添加了以下[命令](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)：

- `Evaluate Script in Host...`
- `Evaluate Script in Attached Host...`
- `Halt Script in Host...`
- `Clear Error Highlights...`
- `Export As Binary...`

这些命令可以从[命令面板](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)触发，也可以通过[自定义键绑定](https://code.visualstudio.com/docs/getstarted/keybindings#_command-arguments)触发。键绑定方法提供了对 `Evaluate Script in Host...` 和 `Evaluate Script in Attached Host...` 命令的几个配置选项。

### 评估主机中的脚本

ExtendScript Debugger 扩展提供了一个 `Evaluate Script in Host...` 命令，使 VS Code 能够指示主机应用程序在特定引擎中评估给定的脚本。如果在触发命令时为指定的引擎激活了 `attach` 模式调试会话，则任何配置的断点可能会导致脚本暂停。如果在触发命令时为指定的引擎激活了 `launch` 模式调试会话，则命令将失败，因为该扩展只允许在任何给定时间内在引擎中激活一个脚本评估。如果在触发命令时没有激活 `attach` 模式调试会话，则忽略断点。

当触发时，该命令将显示一个已安装的主机应用程序列表，供您选择目标。如果主机应用程序有多个 ExtendScript 引擎在运行，将显示第二个列表，显示这些选项。选择应用程序和引擎后，将**发送当前活动编辑器的内容**到主机应用程序进行评估。

**注意事项：**

- 如果主机应用程序尚未运行，此命令将失败。请确保所需的主机应用程序已运行后再触发该命令。
- 评估成功后，最终结果将显示在信息消息框中。
- 如果在评估过程中出现错误，有关错误的详细信息将显示在错误消息框中。
- 文件**无需**保存即可发送到主机应用程序进行评估。

#### 自定义按键绑定参数

The most flexible way to trigger the `Evaluate Script in Host...` command is to create a [custom key binding](https://code.visualstudio.com/docs/getstarted/keybindings#_command-arguments). When you configure a custom key binding, you not only gain the ability to more quickly trigger the command, but you have the ability to specify the available command arguments.
大部分

The command string is `extension.extendscript-debug.evalInHost` and the available command arguments include:

|Argument|Type|Description|Default Value|
|---|---|---|---|
|`hostAppSpecifier`|string|[Specifier](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#identifying-application-specifiers) for the host application within which to evaluate the file. If not specified, a prompt will appear.|`""`|
|`engineName`|string|Name of the engine to target. Will use the default engine if not specified. If two or more engines are available, a prompt will appear.|`""`|
|`script`|string|Absolute path to the script file to evaluate. If not specified, the contents of the active editor will be used.|`""`|
|`bringToFront`|boolean|Whether to bring the host application to front when evaluating or not.|`false`|
|`debugLevel`|number|The debugging level:<br><br>- `0` - No debugging.<br>- `1` - Break on breakpoints, errors, or exceptions.<br>- `2` - Stop at the first executable line.<br><br>This only applies when evaluating while a debug session with the host application is active.|`1`|
|`registeredSpecifier`|string|A secondary specifier that matches what the host application registered as its specifier during installation as opposed to the one it actually uses for BridgeTalk communication.<br><br>_**NOTE:** This is used only in very specific circumstances to assist in host application connections. At present, only InDesign Server connections make use of this._|`""`|

Example of a configured key binding:

```json
{
    "key": "cmd+alt+j",
    "command": "extension.extendscript-debug.evalInHost",
    "args": {
        "hostAppSpecifier": "indesign-16.064",
        "engineName": "MyCoordinator",
        "debugLevel": 2,
    }
}
```

When triggered, the command above would cause the contents of the currently active editor to be sent to the "MyCoordinator" engine in InDesign and, if a debug session was active, pause on the first executable line of the script.

**Notes:**

- If the `script` argument is specified, then only the **saved** state of the file will be evaluated in the host application. In other words, **unsaved modifications are ignored** when a path is specified using this feature.

### Evaluate Script in Attached Host

The `Evaluate Script in Attached Host...` command is very similar to the `Evaluate Script in Host...` command. The difference is that instead of requiring that you specify a specific host application and engine, the command will evaluate the script in an engine for which an `attach` mode debug session is active. How the command operates depends upon how many `attach` mode debug sessions are active when the command is triggered:

- **Zero Active Sessions:** The command will attempt to start an `attach` mode debug session and will ask which host application and, if applicable, engine to target. Once the debug session starts, the script evaluation will begin.
- **One Active Session:** The command will immediately evaluate the script in the engine targeted by the active debug session.
- **Multiple Active Sessions:** The command will present a list of the active `attach` mode debug sessions and allow you to select which to target for script evaluation.

The command string is `extension.extendscript-debug.evalInAttachedHost`. The command supports the same set of configurable command arguments as `Evaluate Script in Host...` except that the `hostAppSpecifier`, `engineName`, and `registeredSpecifier` fields are ignored (they are supplied directly by the debug session).

### Halt Script in Host

The `Halt Script in Host...` command enables you to halt (terminate/stop/end) any active evaluation process that was initially started with the `Evaluate Script in Host...` command. If there is only a single active evaluation process when this command is triggered, then that evaluation will be halted. If there are multiple active evaluation processes when the command is triggered, then the command will show a list of active evaluation processes that may be halted. Selecting one from this list will halt the selected evaluation.

The command string is `extension.extendscript-debug.haltInHost` and there are no configurable command arguments.

### Clear Error Highlights

Triggering the `Clear Error Highlights...` command will clean up any active ExtendScript error highlights.

The command string is `extension.extendscript-debug.clearErrorHighlights` and there are no configurable command arguments.

### Export to JSXBin

You can export your `.js` and `.jsx` scripts to JSXBin by right-clicking the editor window of a `.js` or `.jsx` file and selecting `Export As Binary...`. A file name suggestion will be provided. If you proceed with the export, the results will be saved in the same directory as your currently opened file. You can enter a complete path for the output if desired.

The command string is `extension.extendscript-debug.exportToJSXBin` and there are no configurable command arguments.

## VS Code Status Bar Buttons

The ExtendScript Debugger extension adds two new buttons to the [Status Bar](https://code.visualstudio.com/docs/getstarted/userinterface) that appear/disappear based on context.

### _Eval in Adobe..._ Button

This button appears when a document either:

1. [recognized by VS Code](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers) as `javascript`, `javascriptreact`, or `extendscript`, or
2. has a file extension of `.jsxbin`

is focused. Clicking this button triggers the `Evaluate Script in Host...` command. Once a target host application/engine combination is chosen, the contents of the focused document will be evaluated within it.

When an `attach` mode debug session is active, the _Eval in Adobe..._ button changes to read _Eval in Adobe [name of application] (engine)..._. Clicking this button will evaluate the focused script in the application being debugged.

### _Halt in Adobe..._ Button

This button appears when a script evaluation is triggered from within VS Code. If only a single evaluation process is actively running, then the button will read _Halt in Adobe [name of application] (engine)..._ and clicking it will immediately halt that evaluation process.

If more than one evaluation process is active, then the button will read _Halt in Adobe..._ and clicking it will open a list showing all active evaluation processes. Selecting a process from this list will cause that process to halt.

## Batch Export to JSXBin

By using the `Export As Binary...` command as described above, you can export one file at a time. However you can also batch export your `.js` and `.jsx` files to JSXBin using a script provided with the extension.

1. Ensure that you have NodeJS installed.
2. Locate the script at the following location:
    - Mac:
        
        ```
        $HOME/.vscode/extensions/<adobe.extendscript-debug extension directory>/public-scripts/exportToJSXBin.js
        ```
        
    - Windows:
        
        ```
        %USERPROFILE%\.vscode\extensions\<adobe.extendscript-debug extension directory>\public-scripts\exportToJSXBin.js
        ```
        
3. Run the following command from terminal.
    
    ```
    node <Path to exportToJSXBin.js> [options] [filename/directory]
    ```
    

## InDesign Server (or When Host Applications Go Rogue)

During installation InDesign Server registers itself incorrectly for communication with other applications (including debuggers). The result is that the debugger is able to access certain information about the application but it fails to make any connections to running instances. To correct for this, the ExtendScript Debugger contains several configuration options and settings to enable the extension's features to correctly interface with InDesign Server instances.

The ExtendScript Debugger extension supports per-configuration properties and "global" settings to work around the issue.

### The `registeredSpecifier` Property/Argument

A `registeredSpecifier` property may be specified in debug configurations and custom key binding arguments for the `Evaluate Script in Host...` command. This property refers to the specifier that the host application registers for itself during installation. When this property is present, the `hostAppSpecifier` is used for communicating with the host application while the `registeredSpecifier` is used to resolve application metadata (like it's "Display Name"). For most applications, the registered specifier is the same one used for communication so specifying the value is unnecessary.

An example pairing might look like:

```json
"hostAppSpecifier": "indesignserver_myconfig-17.064",
"registeredSpecifier": "indesignserver-17.0",
```

Properly setting the `registeredSpecifier` debug configuration property or key binding argument will allow only that specific configuration to work. See below for a more "global" solution.

### The "Application Specifier Overrides" Extension Setting

The "Application Specifier Overrides" extension [setting](https://code.visualstudio.com/docs/getstarted/settings) enables full control over how the extension interprets any `hostAppSpecifier` value it encounters. With proper configuration, this setting will enable the default `Evaluate Script in Host...` command and related features to work with "default" InDesign Server instances (those started _without_ a custom `port` or `configuration`). It also enables you to skip adding the `registeredSpecifier` property/argument in configurations.

The setting expects an array of objects with the following properties:

|Property|Type|Description|Default Value|
|---|---|---|---|
|`appSpecRegExp`|string|A JavaScript regular expression value that is used to test against “Host Application Specifier” values for applicability. This applies to any custom `hostAppSpecifier` used in either debug configurations or custom key binding arguments. Proper declaration of the regular expression will allow custom application instances to resolve as expected.|`""`|
|`registeredSpecifier`|string|The specifier that the host application registers for itself during installation.|`""`|
|`commsSpecifier`|string|The specifier by which the "default" application instance will communicate.|`""`|

Taken together, these properties constitute two “sets” of information:

1. Specifying the `appSpecRegExp` and `registeredSpecifier` values will effectively add the `registeredSpecifier` property to any debug configuration or key binding argument where `appSpecRegExp` matches the `hostAppSpecifier`.
2. Specifying the `commsSpecifier` and `registeredSpecifier` values will enable the base `Evaluate Script in Host...` command and _Eval in Adobe..._ button to work with the default instance of the specified application.

Example:

```json
"extendscript.advanced.applicationSpecifierOverrides": [
    {
        "appSpecRegExp": "indesignserver[_a-z0-9]*-17",
        "registeredSpecifier": "indesignserver-17.0",
        "commsSpecifier": "indesignserver-17.064"
    }
]
```

The `appSpecRegExp` in the example above will successfully match against a `hostAppSpecifier` with value "indesignserver_myconfig-17.064" and will instruct any configuration in which it was found to use the `registeredSpecifier` value of "indesignserver-17.0". Additionally, if the `Evaluate Script in Host...` command is run without custom arguments, then the extension will match the `registeredSpecifier` value of "indesignserver-17.0" against the specifier it automatically uses, find that they are the same, and then use the `commsSpecifier` value of "indesignserver-17.064" for communication. If a "default" InDesign Server 2022 instance is running, then the script evaluation process will proceed as expected.

**Notes:**

- This feature can be used to point the _Eval in Adobe..._ button and base `Evaluate Script in Host...` command to a specific instance. This is only recommended if you _always_ use the same application instance (e.g. InDesign Server port and configuration settings). In such cases, simply specify the full instance specifier for the `commsSpecifier` property.

## Common Extensibility Platform (CEP)

CEP extensions run scripts in one of two separate contexts:

1. **An ExtendScript engine.** This engine is provided by the host application and supports the host application's DOM.
2. **A JavaScript engine.** This engine is provided by [CEF](https://github.com/chromiumembedded/cef) (which is part of the CEP runtime) and supports the HTML DOM used for the extension's UI.

Of these two contexts (and where supported by the host application), the ExtendScript Debugger extension can be used to debug scripts run in the ExtendScript engine context (#1 above).

_**NOTE:** The JavaScript engine context (#2 above) can be debugged using VS Code's built-in JavaScript debugger (see [here](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_11.x/Documentation/CEP%2011.1%20HTML%20Extension%20Cookbook.md#remote-debugging) for instructions to enable debugging this context). Once configured properly, both contexts can be debugged simultaneously using a [Compound Launch Configuration](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#compound-launch-configurations)._

Unfortunately, no two host applications implement the ExtendScript engine context in the same way. Some are easy to debug, some require special configuration to work with, and some (e.g. Photoshop) simply do not support debugging CEP ExtendScript engines.

This section describes how to use the ExtendScript Debugger extension to debug CEP ExtendScript contexts where such functionality is supported by the host application.

### General CEP Debugging Notes

This section outlines certain topics relevant to debugging CEP ExtendScript contexts.

#### Loading Scripts

There are three different ways to ask a Host Application to evaluate ExtendScript scripts in CEP:

1. The CSXS Manifest's [`<ScriptPath>` Element](https://github.com/Adobe-CEP/CEP-Resources/blob/2239c56fb6c88f47e164e2259398131c0b5ff821/CEP_8.x/ExtensionManifest_v_7_0.xsd#L222).
2. The [`//@include` Preprocessor Directive](https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html#include-file).
3. The [`$.evalFile()` Function](https://extendscript.docsforadobe.dev/extendscript-tools-features/dollar-object.html#evalfile).

Loading a script with option #1 treats the file as an **unnamed script**. As [suggested here](https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html#script-name):

> An unnamed script is assigned a unique name generated from a number.

_**NOTE:** Some host applications don't even assign a number for scripts loaded in this manner. The [script's name](https://extendscript.docsforadobe.dev/extendscript-tools-features/dollar-object.html#filename) evaluates to the empty string._

Such scripts are effectively _anonymous_ scripts and complicate the debugging experience. Unfortunately, when a breakpoint or exception is encountered in such a script, the ExtendScript Debugger extension has no way to connect that message to a file in the project. In such circumstances, a new unsaved file will be shown with the break state.

Scripts loaded with either option #2 or #3 as listed above do not suffer from this issue. In these circumstances, host applications provide the ExtendScript Debugger extension with the information required to connect breakpoints or exceptions to the correct source file in the project and the debugger will operate as expected.

Please see the following sections for examples on how to load CEP ExtendScript scripts in ways that support an improved debugging experience.

##### Treating the `<ScriptPath>` Script as a Loader

In this scenario, you might create a file called "loader.jsx" and specify the file in your CSXS Manifest's `<ScriptPath>`. This file itself would have the same problem outlined above. However, the purpose of this script is simply to load the scripts that actually contain your business logic.

Note that the `<ScriptPath>` script is **not** automatically invoked by the host application by default. One event that causes the evaluation of this script is when `CSInterface.evalScript()` is called for the first time. There may be other events that also trigger the specified script to evaluate.

> _**Important Note:** Photoshop (amongst others?) does not support loading scripts in this manner. Attempts to process other files from the one specified within the `<ScriptPath>` element will fail. This appears to be documented [here](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_11.x/Documentation/CEP%2011.1%20HTML%20Extension%20Cookbook.md#load-multiple-jsx-files). Photoshop also does **not** support debugging CEP ExtendScript._

There are two ways to use this approach:

1. **Preprocessor directives.** Scripts loaded using the [`//@include` preprocessor directive](https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html#include-file) maintain all of the information necessary to communicate with the debugger. Example:
    
    ```js
    //@include "helloworld.jsx"
    //@include "someotherscript.jsx"
    ```
    
2. **Using the `$.evalFile()` function.** Scripts loaded using the [`$.evalFile()` function](https://extendscript.docsforadobe.dev/extendscript-tools-features/dollar-object.html#evalfile) maintain all of the information necessary to communicate with the debugger. Example:
    
    ```js
    $.evalFile($.includePath + "/helloworld.jsx");
    $.evalFile($.includePath + "/someotherscript.jsx");
    ```
    

##### Loading ExtendScript from the JavaScript Context

In this scenario, you trigger the `$.evalFile()` function from the browser context via [CEP's `CSInterface.evalScript()` function](https://github.com/Adobe-CEP/CEP-Resources/blob/52e08cba1395af266eefef6f874c587659f19e31/CEP_11.x/CSInterface.js#L612). For this option, you might add the following logic to a `<script>` block in your extension's HTML somewhere:

```js
const csInterface = new CSInterface();

// Use the extension path reported by the CSInterface.
const path = csInterface.getSystemPath(SystemPath.EXTENSION);
csInterface.evalScript(`$.evalFile("${path}/host/helloworld.jsx")`);
csInterface.evalScript(`$.evalFile("${path}/host/someotherscript.jsx")`);
```

Or, alternatively (for non-Photoshop [and possibly others?] applications):

```js
const csInterface = new CSInterface();

// Use the include path set for the CEP's ExtendScript context.
csInterface.evalScript(`$.evalFile($.includePath + "/host/helloworld.jsx")`);
csInterface.evalScript(`$.evalFile($.includePath + "/host/someotherscript.jsx")`);
```

> _**Important Note:** Photoshop (amongst others?) does not support the second alternative. The value of `$.includePath` resolves to the empty string._

#### Reloading CEP Extensions and ExtendScript

Restarting a CEP extension will also cause it to reevaluate the ExtendScript. Another way to reevaluate the ExtendScript is to use the ExtendScript Debugger extension's various methods of [running a script](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#running-a-script). Note that this may cause oddities as the ExtendScript engine itself **isn't reset** - you're just overwriting the existing variable and function definitions. This can cause surprising issues if you're not careful.

#### Manually Enabling Debugging

Some host applications run their CEP ExtendScript engine in a manner that constantly resets the "debug level" of the engine to "No Debugging". When this happens, an attached debug session may appear to ignore breakpoints and exceptions. Fortunately, it is possible to work around this issue by manually setting the debug level of the ExtendScript engine with [the `$.level` property](https://extendscript.docsforadobe.dev/extendscript-tools-features/dollar-object.html#level). Setting this property to either `1` or `2` will reenable the debugging features of the engine.

There are two approaches to manually adjusting the debug level so that you can debug your CEP callback scripts. Depending upon your workflow, one of these may be more flexible for you than the other:

1. **Set `$.level` inside the ExtendScript callback function.** With this approach, you simply set the value at the top of the function you wish to debug. See:
    
    ```js
    function DoSomething()
    {
        $.level = 1;
    
        // Breakpoints will work here.
    }
    ```
    
2. **Set the `$.level` when calling the ExtendScript callback function.** ExtendScript functions triggered from CEP browser contexts use the `CSInterface.evalScript()` API. We can set the `$.level` value from within this interface as follows:
    
    ```js
    csInterface.evalScript(`$.level = 1; DoSomething();`);
    ```
    

### Host Application Specific Notes

This section provides host application-specific details about CEP ExtendScript engines and their quirks (where possible). The list of host applications is non-exhaustive.

Notes about the "Basic Details" in the sections below:

- The "_Name of `<ScriptPath>` Script_" detail will be either "[None]" or "[Numerical]". These are both [anonymous](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#loading-scripts) but have distinct implications on how the files appear when encountered by the debugger.
- The "_`<ScriptPath>` Script Can Include Files_" detail refers to whether or not the script can be used as a [loader script](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#treating-the-scriptpath-script-as-a-loader).

#### After Effects

**Basic Details:**

- **Name of `<ScriptPath>` Script:** [Numerical]
- **Name of Engine:** `main`
- **`<ScriptPath>` Script Can Include Files:** Yes

**Quirks:**

- After Effects requires that you [manually set](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#manually-enabling-debugging) `$.level = 1` in order to handle debug breakpoints in callback sections.
- Adjusting breakpoints in VS Code's interface while a debug session is attached will _also_ cause the next breakpoint encountered to be triggered. This is **temporary** however: subsequent calls to the same function with the existing breakpoint will **not** be triggered.
    - This is due the fact that adjusting breakpoints effectively sets `$.level = 1` for the _next_ script evaluation.

#### Audition

**Basic Details:**

- **Name of `<ScriptPath>` Script:** [None]
- **Name of Engine:** The value of the `Id` attribute of the `Extension` CSXS manifest element.
- **`<ScriptPath>` Script Can Include Files:** Yes

**Quirks:**

- Specifying a custom engine with [the `Engine="EngineName"` attribute](https://github.com/Adobe-CEP/CEP-Resources/blob/52e08cba1395af266eefef6f874c587659f19e31/CEP_8.x/ExtensionManifest_v_7_0.xsd#L229) of the `<ScriptPath>` CSXS manifest element will cause the CEP extension's ExtendScript context to fail to start altogether.
- CEP Extensions in Audition are automatically assigned custom debuggable engines with a name that matches the [Extension ID specified in the CSXS manifest](https://github.com/Adobe-CEP/CEP-Resources/blob/52e08cba1395af266eefef6f874c587659f19e31/CEP_8.x/ExtensionManifest_v_7_0.xsd#L73) (e.g. `com.test.extension`).
    - Attaching a debug session to such an engine enables all debugging capabilities.
    - These engines will shut down when the CEP extension is closed. When this happens, an attached debug session will automatically end.

#### Illustrator

**Basic Details:**

- **Name of `<ScriptPath>` Script:** [Numerical]
- **Name of Engine:** Depends on time of initialization and whether or not the extension was the first to initialize an engine.
    - **Welcome Screen and First to Init:** `transient`
    - **After Welcome Screen or Not First to Init:** [None]
- **`<ScriptPath>` Script Can Include Files:** Yes

**Quirks:**

- Illustrator runs CEP ExtendScript in one of two different engine contexts. Which engine context the script is run in depends upon startup timing. Specifically:
    - If the CEP extension is started **before** a file is opened and the "Welcome to Illustrator" window is still open, then the extension's ExtendScript will run in an engine named `transient`. This engine does not exist until a CEP extension is run that _also_ triggers ExtendScript evaluation (e.g. via `CSInterface.evalScript()`). Once the engine exists, it is possible to connect a debug session with the ExtendScript Debugger extension. [Restarting the extension](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#reloading-cep-extensions-and-extendscript) will not change its association with the `transient` engine.
        - This only applies to the **_first_** CEP extension started. Any subsequent extension started will work as though it was started **after** a file is opened. As such, only a single CEP extension's ExtendScript will be debuggable during any single run of Illustrator.
    - If the CEP extension is started **after** a file is opened and the standard editing interface is visible, then the extension's ExtendScript will run in an engine named `""` (the empty string). This is effectively a private, nameless engine and cannot be debugged.
- Illustrator requires that you [manually set](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#manually-enabling-debugging) `$.level = 1` in order to handle debug breakpoints in callback sections.

#### InDesign

**Basic Details:**

- **Name of `<ScriptPath>` Script:** [None]
- **Name of Engine:** Depends upon whether [the `Engine` attribute](https://github.com/Adobe-CEP/CEP-Resources/blob/52e08cba1395af266eefef6f874c587659f19e31/CEP_8.x/ExtensionManifest_v_7_0.xsd#L229) of the `<ScriptPath>` CSXS manifest element is defined.
    - **Defined:** The value specified in the `Engine` attribute.
    - **Not Defined:** `{EXTENSION_ID}_Engine_Id`, where `{EXTENSION_ID}` is the value of [the `Id` attribute](https://github.com/Adobe-CEP/CEP-Resources/blob/52e08cba1395af266eefef6f874c587659f19e31/CEP_8.x/ExtensionManifest_v_7_0.xsd#L73) of the `Extension` CSXS manifest element.
- **`<ScriptPath>` Script Can Include Files:** Yes

**Quirks:**

- Debugging CEP with InDesign requires that you connect the debugger to the engine _**before**_ you start your extension. This requires that you create a custom `attach` mode launch configuration that targets the engine that the extension _will_ use. You would then attach to InDesign _before_ starting up the CEP extension. If you accidentally start your CEP extension before starting the debug session, you must restart InDesign. A configuration for the engine specified above might look like:
    
    ```json
    {
      "type": "extendscript-debug",
      "request": "attach",
      "name": "Attach to My CEP Engine",
      "hostAppSpecifier": "indesign-17.064",
      // By default (where the Extension ID specified in the CSXS Manifest is "com.test.extension"):
      "engineName": "com.test.extension_Engine_Id",
      // Or if the manifest contains <ScriptPath Engine="My CEP Engine">:
      // "engineName": "My CEP Engine",
    }
    ```
    

#### Photoshop

**Basic Details:**

- **Name of `<ScriptPath>` Script:** [Numerical]
- **Name of Engine:** [None]
- **`<ScriptPath>` Script Can Include Files:** No

**Quirks:**

- Photoshop's CEP's ExtendScript context **cannot be directly debugged**. This is due to the fact that Photoshop runs CEP ExtendScript in private, nameless engines.
    - Due to this limitation, it is best to debug ExtendScript that will be used in CEP contexts directly in the `main` ExtendScript engine as you would other scripts (e.g. by using the extension's various ways to [run a script](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#running-a-script)).
- Related CEP notes:
    - Photoshop [does not support including files](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#treating-the-scriptpath-script-as-a-loader) from within the script specified in the CSXS manifest's `<ScriptPath>`.
    - The `$.includePath` property is not supported (it resolves to the empty string).

#### Premiere Pro

**Basic Details:**

- **Name of `<ScriptPath>` Script:** [None]
- **Name of Engine:** `main` or `NewWorld` (depends upon version of Premiere Pro)
- **`<ScriptPath>` Script Can Include Files:** Yes

**Quirks:**

Premiere Pro does not currently have any application-specific quirks. Simply connecting a debugger should be enough for all contexts to be debuggable out of the box.

## General Notes

- If the ExtendScript Toolkit (ESTK) connects to a host application, then the ExtendScript Debugger extension will no longer be able to function correctly as a debugger. Restarting the host application is enough to fix this issue.
- A single host application can only be debugged by a single VS Code window. If two or more VS Code windows attempt to maintain debug sessions with a single host application at the same time, only the last one to connect will work.
- A single VS Code window can manage multiple debug sessions with multiple host application/engine combinations at the same time.
- Once a VS Code Window connects to a host application, it will begin acting as the de facto debugger for all future debugging purposes (until another VS Code window connects). For host applications that support multiple engines, this may mean that an engine with no active debug session triggers a breakpoint and notifies the ExtendScript Debugger extension about the break. In these cases, the extension will attempt to notify you and offer you the ability to attach a debug session.
- Changes to the "Caught Exceptions" breakpoint while a script is evaluating (e.g. stopped at a breakpoint) will only apply to newly created scopes (stack frames).
- When an `Evaluate Script in Host...` command is run without an active debug session and fails with an error status, the extension will highlight the line of source code reported with the error. You may clear these highlights in one of the following manners:
    1. Focus another source file such that the source file with a highlight becomes a background tab in VS Code.
    2. Close and reopen the source file.
    3. Start another script evaluation.
    4. Start a debug session.
    5. If the "Show Result Messages" setting is enabled, dismiss the relevant error message (if hidden, click the notification bell in the right side of the status bar).
    6. Run the `Clear Error Highlights...` command.
- The ExtendScript Debugger extension ignores the [`#target`](https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html#target-name) and [`#targetengine`](https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html#targetengine-enginename) preprocessor directives. The extension will always use either the configured `hostAppSpecifier` and `engineName` settings or, if not otherwise specified, those dynamically chosen in the relevant UI.
- When _disconnecting_ from a Debug Session:
    - The host engine is instructed to unregister all VS Code breakpoints and continue evaluation.
    - Any script-based breakpoints (e.g. `debugger` or `$.bp()`) subsequently encountered by the host engine will cause the host engine to pause and await communication from a debugger. When this occurs, the extension will attempt to notify you and offer you the ability to attach a debug session to investigate the breakpoint details. If you dismiss or otherwise miss this notification, you may either halt the evaluation process or manually connect an `attach` mode debug session.

## Resources

- [Official VS Code Debugging Documentation](https://code.visualstudio.com/docs/editor/debugging)

## Forums

- [Extensions / Add-ons Development Forum](https://community.adobe.com/t5/exchange/ct-p/ct-exchange?topics=label-extendscriptdebugger)

## Known Issues

- **The Extension fails to work on Apple devices using Apple Silicon (e.g. M1 processors).** Internally, the extension interfaces with a special library that handles communication with host applications. This library is currently Intel-only. To successfully run the extension on Apple devices running Apple Silicon, VS Code itself must be run with Rosetta. Please see [Apple's documentation](https://support.apple.com/en-us/HT211861) for information on how to configure a universal build of VS Code to run using Rosetta. Alternatively, you can [download](https://code.visualstudio.com/download) the Intel-specific build of VS Code and run it directly.
- **The Extension fails to work on Windows on ARM devices.** Use of the ExtendScript Debugger on Windows on ARM devices is not supported at this time.
- **_Bring Target to Front_ does not work for certain host applications.** Certain host applications on certain operating systems may ignore the extension's request to come forward. A possible workaround is to add `BridgeTalk.bringToFront("host-app-specifier")` to the top of the script you wish to evaluate.
- **The debugger fails to connect to InDesign Server.** The ExtendScript Debugger extension fails to recognize that InDesign Server is running. This is due to a BridgeTalk registration issue in InDesign Server itself. See the [InDesign Server (or When Host Applications Go Rogue)](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug#indesign-server-or-when-host-applications-go-rogue) section for information on how to work around this issue.
- **The `this` object does not appear in the Variables view.** All ExtendScript engines contain a bug that causes the implicit `this` variable to display incorrect contents when viewed from all but the top stack frame in a given call stack (only the implicit `this` for the top stack frame is ever resolved). For consistency, the implicit `this` variable is **not** listed. If you need to view the contents of the implicit `this` in any context, you may do so by adding `var _this = this;` to your script. The `_this` variable will appear in the Variables view and allow you to inspect the contents of the implicit `this` as expected.
    - This issue also affects the Debug Console. Entering `this` into the Debug Console will only ever refer to the implicit `this` resolved in the context of the top stack frame.
- **Unencoded binary values may break the underlying debugger protocol.** All host applications have a known bug where attempts to send binary-encoded data to the debugger will fail. This typically results in missing Debug Console output or an empty Variables view. Scenarios where you may encounter this issue include when attempting to view the results of a binary file `read()` operation or when writing binary values directly in ExtendScript. The following script, for instance, will trigger this issue:
    
    ```js
    var x = "\0";             // String representation of "NULL"
    $.writeln("x is: " + x);  // Write the value of `x` to the Debug Console: does nothing
    $.bp();                   // Ask the debugger to break: the Variables view will show an error
    ```
    
    To work around this issue and "see" the contents of the problematic variable, you may encode it using `encodeURI()`, `toSource()`, or by using a [`btoa()` polyfill](https://developer.mozilla.org/en-US/docs/Web/API/btoa#see_also). For example:
    
    ```js
    var x = encodeURI("\0");  // Encoded string representation of "NULL"
    $.writeln("x is: " + x);  // Write the value of `x` to the Debug Console: prints "x is: %00"
    $.bp();                   // Ask the debugger to break: the Variables view works as expected
    ```
    
    Please note that this issue is present in all ExtendScript debuggers, including the original ESTK.

## FAQ

- **Can debug sessions or the `Evaluate Script in Host...` command be configured to launch the host application?**
    
    The ExtendScript Debugger extension does not currently support launching host applications.
    
- **How do I halt evaluation of a script that wasn't started from VS Code?**
    
    There are currently two options:
    
    1. Connect an `attach` mode debug session to the host engine within which the script is evaluating. Once connected use the "Stop" [debug action](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) to simultaneously end the debug session and halt the script. The "Disconnect" button can be converted into a "Stop" button by holding the `Alt`/`option` key.
    2. Attempt to evaluate a script (e.g. with a command or by starting a `launch` mode debug session) in the host engine within which the script is evaluating. The active evaluation will be detected and you will be offered the option to halt the active evaluation process and retry evaluating the script you specified.

## Terms & Conditions

Your use of this application is governed by the [Adobe General Terms of Use](https://www.adobe.com/go/terms).

© 2022 Adobe. All rights reserved. [Adobe Privacy Policy](https://www.adobe.com/go/privacy_policy).