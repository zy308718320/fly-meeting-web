# 总结

## 需求分析

### 前端重点需求

#### 背景虚化

#### 美颜

#### 响应式视频窗口

#### 音频降噪

## 图像处理基础

## 兼容问题
目前就算是chrome的WebRTC实现和标准都有差异，所以需要引入一个包`webrtc-adapter`解决兼容问题。

## 性能问题
模糊背景的效果可以使用`bodyPix.drawBokehEffect`方法快速实现，不过这并不是一个纯函数，并且会直接操作canvas元素，所以想通过`web Worker`的方式解决性能问题是行不通的。实际上`net.segmentPerson`返回的已经是非常有效的数据了，`segmentation.data`是一个`Uint8Array`，它和`ctx.getImageData`返回的Uint8Array虽然不一样但是是有对应关系的。`ctx.getImageData`返回的数据最小值是0，最大值为255，每四个为一组代表一个像素的RGBA值。而`segmentation.data`返回的数据则比较纯粹，一个值就是一个像素，值的范围只有0和1，分别代表不属于人体的像素和属于人体的像素。

## Web Worker

### 工程化项目优雅使用

### 引入第三方包

### 平滑切换

workerpool、promise-worker、threads.js

## 参考资料

[ImageFilters.js](https://github.com/zhengsk/ImageFilters.js)

[color-pop-effect-using-bodypix-and-tensorflow-js](https://towardsdatascience.com/color-pop-effect-using-bodypix-and-tensorflow-js-a584ddc48a02)

[WebRTC-Classroom](https://github.com/RobbieXie/WebRTC-Classroom)
