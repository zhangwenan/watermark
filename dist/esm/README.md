# 水印

给页面添加水印。

## 使用

可以在浏览器中直接使用，也可作为其他库或框架的基础包。

### CDN

所有文件均已上传到 CDN，所以可以通过以下方式直接引用：

```
//img.maihaoche.com/mhc-fe/watermark/版本号/要引入的文件路径
```

`要引入的文件路径` 部分可以参考：

```
.
├── watermark.js
└── watermark.min.js 
```

### NPM

在自己项目里根据需要通过 `npm i --save @mhc/watermark` 或 `npm i --save-dev @mhc/watermark` 下载到本地，然后引入自己要使用的模块：

```
.
└── index.js
```

**这些模块全部采用 ES Modules 编写。**

## 开发

### 编译文件

只需执行 `npm run compile`，文件即可生成到 `dist` 目录下。

### 本地调试

执行 `npm start` 后在浏览器中访问 `http://localhost:8080/`。

### 发布版本

先执行 `npm version patch` 或 `npm version minor` 更新版本号，再用 `npm run release` 发布到二方包平台并上传到 CDN 服务商。

## API

### `mhc.watermark.init(opts)`

给页面中指定区域加上水印。

#### 参数

1. `opts`（Plain Object）：配置项。

`opts` 的结构为：

```js
{
  id: "watermark",
  preventTamper: false,
  width: 140,
  height: 100,
  text: "watermark",
  font: "20px Sans-serif",
  rotate: (Math.PI / 180) * 30,
  translateX: 0,
  translateY: 0,
  left: 0,
  top: 0,
  shadow: {
    offsetX: 2,
    offsetY: 2,
    blur: 2
  },
  style: {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    "z-index": 1000,
    "pointer-events": "none"
  }
}
```

#### 示例

```js
mhc.watermark.init({
  text: "真实姓名（花名）",
  font: "300 16px Sans-serif",
  rotate: 345 * Math.PI / 180,
  translateX: -10,
  translateY: 50,
  width: 200,
  height: 100,
  container: $(".Content").get(0)
});
```
