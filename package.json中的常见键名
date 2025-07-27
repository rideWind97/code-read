# package.json 常见关键字详解

## 1. 基础字段

### name
```json
{
  "name": "my-awesome-package"
}
```
- 包的名称，发布到 npm 时必须唯一
- 不能包含大写字母和空格
- 通常使用短横线分隔

### version
```json
{
  "version": "1.2.3"
}
```
- 语义化版本号：主版本号.次版本号.修订号
- 遵循 SemVer 规范

### description
```json
{
  "description": "一个用于处理用户认证的库"
}
```
- 包的描述信息
- 在 npm 搜索结果中显示

### keywords
```json
{
  "keywords": ["authentication", "security", "jwt", "oauth"]
}
```
- 关键词数组
- 用于 npm 搜索优化

### homepage
```json
{
  "homepage": "https://github.com/username/project#readme"
}
```
- 项目主页 URL

### bugs
```json
{
  "bugs": {
    "url": "https://github.com/username/project/issues",
    "email": "support@example.com"
  }
}
```
- 报告 bug 的方式

### license
```json
{
  "license": "MIT"
}
```
- 软件许可证

### author / contributors
```json
{
  "author": "John Doe <john@example.com> (https://johndoe.com)",
  "contributors": [
    "Jane Smith <jane@example.com>",
    "Bob Johnson"
  ]
}
```

## 2. 依赖相关字段

### dependencies
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "~4.17.0",
    "react": "18.2.0"
  }
}
```
- 生产环境必需的依赖包
- 版本符号含义：
  - `^`: 兼容补丁和次版本更新 (1.2.3 → 1.2.x)
  - `~`: 仅允许补丁版本更新 (1.2.3 → 1.2.x)
  - `*`: 任意版本
  - `>=`: 大于等于指定版本

### devDependencies
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "webpack": "^5.0.0",
    "eslint": "^8.0.0"
  }
}
```
- 开发环境依赖（测试、构建、lint 等）

### peerDependencies
```json
{
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```
- 插件包使用，声明需要宿主环境提供的依赖
- 不会自动安装，由使用者提供

### optionalDependencies
```json
{
  "optionalDependencies": {
    "fsevents": "^2.0.0"
  }
}
```
- 可选依赖，安装失败不会导致整个安装失败

### bundledDependencies
```json
{
  "bundledDependencies": [
    "lodash",
    "moment"
  ]
}
```
- 打包发布时包含的依赖（npm pack 时）

## 3. 脚本相关字段

### scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src/",
    "prepublishOnly": "npm run build",
    "postinstall": "node scripts/postinstall.js"
  }
}
```
- 生命周期脚本：
  - `preinstall`/`postinstall`: 安装前后
  - `prepublish`/`prepare`: 发布前
  - `preversion`/`postversion`: 版本更新前后
  - `pretest`/`posttest`: 测试前后

### config
```json
{
  "config": {
    "port": "3000",
    "debug": true
  }
}
```
- 配置变量，可在脚本中通过 `npm_package_config_port` 访问

## 4. 文件和目录相关

### main
```json
{
  "main": "dist/index.js"
}
```
- 包的入口文件
- `require('package')` 时加载的文件

### module
```json
{
  "module": "src/index.js"
}
```
- ES6 模块入口点
- 用于支持 tree-shaking

### browser
```json
{
  "browser": {
    "fs": false,
    "./server.js": "./client.js"
  }
}
```
- 浏览器环境替换配置
- 指定在浏览器中应该使用的文件

### files
```json
{
  "files": [
    "dist/",
    "lib/",
    "README.md",
    "LICENSE"
  ]
}
```
- 发布到 npm 时包含的文件/目录
- 默认包含 README、LICENSE 等文件

### bin
```json
{
  "bin": {
    "my-cli": "./bin/cli.js"
  }
}
```
- 可执行文件映射
- 安装后可在命令行使用

## 5. 包管理器相关

### resolutions (Yarn)
```json
{
  "resolutions": {
    "lodash": "^4.17.21",
    "**/lodash": "^4.17.21",
    "react/**/lodash": "^4.17.21"
  }
}
```
- **Yarn 特有字段**
- 强制指定依赖包的版本
- 解决依赖冲突问题
- 支持通配符匹配

### workspaces
```json
{
  "workspaces": [
    "packages/*",
    "components/**"
  ]
}
```
- 工作区配置
- 管理 monorepo 项目
- 自动链接工作区包

### engines
```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```
- 指定运行环境要求
- 安装时会检查版本

### os / cpu
```json
{
  "os": ["darwin", "linux"],
  "cpu": ["x64", "arm64"]
}
```
- 指定支持的操作系统和 CPU 架构

## 6. 发布相关

### private
```json
{
  "private": true
}
```
- 设置为 true 时禁止发布到 npm

### publishConfig
```json
{
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "public",
    "tag": "next"
  }
}
```
- 发布配置
- 可指定不同的 registry

### repository
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/username/project.git"
  }
}
```
- 源代码仓库信息

## 7. 现代工具相关

### type
```json
{
  "type": "module"
}
```
- 指定模块系统：`module` (ESM) 或 `commonjs`

### exports
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    },
    "./package.json": "./package.json"
  }
}
```
- 现代导出条件
- 支持不同环境的入口点

### imports
```json
{
  "imports": {
    "#internal/*": "./src/internal/*.js",
    "#utils": "./src/utils/index.js"
  }
}
```
- 导入映射
- 支持内部模块的别名

## 8. 构建工具相关

### browserslist
```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```
- 浏览器兼容性配置
- 被 Babel、Autoprefixer 等工具使用

### eslintConfig
```json
{
  "eslintConfig": {
    "extends": "@mycompany/eslint-config"
  }
}
```
- 内联 ESLint 配置

### babel
```json
{
  "babel": {
    "presets": ["@babel/preset-env"]
  }
}
```
- Babel 配置

## 9. 完整示例

```json
{
  "name": "my-awesome-library",
  "version": "1.0.0",
  "description": "一个现代化的 JavaScript 库",
  "keywords": ["library", "modern", "javascript"],
  "homepage": "https://github.com/username/my-awesome-library#readme",
  "bugs": {
    "url": "https://github.com/username/my-awesome-library/issues"
  },
  "license": "MIT",
  "author": "John Doe <john@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-awesome-library.git"
  },
  "main": "dist/index.js",
  "module": "src/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist/", "src/", "README.md"],
  "scripts": {
    "build": "rollup -c",
    "test": "jest",
    "lint": "eslint src/",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "rollup": "^3.0.0"
  },
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ],
  "resolutions": {
    "lodash": "^4.17.21"
  }
}
```

## 10. 最佳实践

### 版本管理
```json
{
  "dependencies": {
    "express": "^4.18.0",     // 允许补丁和次版本更新
    "lodash": "~4.17.21",     // 只允许补丁更新
    "react": "18.2.0"         // 固定版本
  }
}
```

### 安全考虑
```json
{
  "private": true,            // 私有项目不发布
  "engines": {
    "node": ">=16.0.0"        // 指定安全的 Node 版本
  }
}
```

### 性能优化
```json
{
  "files": ["dist/"],         // 只发布必要的文件
  "sideEffects": false        // 启用 tree-shaking
}
```

这些字段的合理使用可以让你的包更加专业、安全和易于维护。


### 总结特殊字段
```json

  dependencies:  生成环境所需依赖包
  devDependencies：测试环境所需依赖包
  peerDependencies：用于插件或库声明它们需要宿主环境提供的依赖包
  resolutions:  用于强制指定依赖包的版本，解决依赖冲突问题
  optionalDependencies：可选依赖包
  bundledDependencies：打包时需要的依赖包
```