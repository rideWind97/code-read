# 模型上下文协议（Model Context Protocol, MCP）

模型上下文协议（MCP）是一个开放标准，用于定义 AI 模型与外部工具和数据源之间的通信协议。它让 AI 模型能够安全、可控地访问外部资源。

## 组成部分

### 1. 服务器（Server）
- **作用**：提供工具和数据源的具体实现
- **功能**：处理 AI 模型的请求，执行具体操作，返回结果
- **示例**：天气查询服务器、文件系统服务器、数据库服务器等

### 2. 客户端（Client）
- **作用**：AI 模型或应用程序，发起请求的一方
- **功能**：向服务器发送请求，接收和处理响应
- **示例**：ChatGPT、Claude 等 AI 模型

### 3. 工具（Tools）
- **作用**：定义可执行的具体操作
- **功能**：描述工具的名称、参数、功能等元数据
- **示例**：获取天气、读取文件、搜索网络等

### 4. 资源（Resources）
- **作用**：定义可访问的数据源
- **功能**：描述数据的结构、访问方式、权限等
- **示例**：文件系统、数据库、API 接口等

## 工作流程

1. **发现阶段**：客户端连接到服务器，获取可用工具和资源的列表
2. **调用阶段**：客户端向服务器发送工具调用请求
3. **执行阶段**：服务器执行具体操作，返回结果
4. **响应阶段**：客户端接收结果，继续对话或处理

## 举例说明

### 天气查询示例
```json
// 工具定义
{
  "name": "get_weather",
  "description": "获取指定城市的天气信息",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "城市名称"
      }
    }
  }
}

// 客户端请求
{
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "city": "北京"
    }
  }
}

// 服务器响应
{
  "content": [
    {
      "type": "text",
      "text": "北京今天晴天，温度 20°C"
    }
  ]
}
```

### 文件系统示例
```json
// 资源定义
{
  "name": "file_system",
  "description": "访问本地文件系统",
  "uri": "file:///path/to/files"
}

// 客户端请求读取文件
{
  "method": "resources/read",
  "params": {
    "uri": "file:///path/to/files/document.txt"
  }
}
```

## 优势

1. **安全性**：通过协议定义明确的权限和访问范围
2. **标准化**：统一的接口规范，便于不同系统集成
3. **可扩展性**：支持自定义工具和资源
4. **互操作性**：不同厂商的工具可以互相调用

## 应用场景

- **AI 助手**：让 ChatGPT 等 AI 能够访问实时数据
- **自动化工具**：AI 驱动的文件管理、数据处理
- **智能应用**：集成多种服务的智能应用
- **开发工具**：AI 辅助的代码生成、调试等

## 总结

MCP 为 AI 模型提供了安全、可控的外部能力扩展机制，通过标准化的协议定义，实现了 AI 与外部工具和数据源的无缝集成，为构建更智能、更实用的 AI 应用奠定了基础。

MCP小例子：
1、npm install -g yo generator-mcp
2、yo mcp --mcpServerName 'MCPServer' --toolName 'Tool'
3、请求接口那一行代码改成 const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=3ccafd464a0e4392ac0144039252503&q=${city}`);
4、npm run build
5、npx @modelcontextprotocol/inspector node dist/index.js
这就完成了一个天气MCP

5步后，人均MCP专家