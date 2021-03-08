# 视频会议图像处理的纯web实现
随着全球疫情的蔓延，越来越多的组织选择了网上上课或者会议，各种各样的视频会议软件也应运而生。但是市面上网页版的视频会议工具仿佛还是很难见到，究竟但是什么制约的web在这个领域的发展？在WebRTC、Web Worker、WebAssembly等技术成熟的背景下，有没有可能实现在纯web的环境下有较好的视频会议体验呢？带着这些问题我做了如下尝试。

## 重点需求分析
由于时间和篇幅的关系，本次主要是在图像处理层面的需求分析与技术实现，后续可能再对音频处理及信令服务器通信等方面进行分析和实现。

### 背景虚化

### 美颜

## 图像处理基础

## 背景虚化实现
### tensorflow.js

模糊背景的效果可以使用`bodyPix.drawBokehEffect`方法快速实现，不过这并不是一个纯函数，并且会直接操作canvas元素，所以想通过`web Worker`的方式解决性能问题是行不通的。实际上`net.segmentPerson`返回的已经是非常有效的数据了，`segmentation.data`是一个`Uint8Array`，它和`ctx.getImageData`返回的Uint8Array虽然不一样但是是有对应关系的。`ctx.getImageData`返回的数据最小值是0，最大值为255，每四个为一组代表一个像素的RGBA值。而`segmentation.data`返回的数据则比较纯粹，一个值就是一个像素，值的范围只有0和1，分别代表不属于人体的像素和属于人体的像素。

### Web Worker

## 美颜磨皮实现
### 双边滤波（bilateralFilter）

### 使用WebAssembly
在使用opencv.wasm的过程中，整体性能表现还是非常的不错。虽然运行在主线程中，每个任务基本都能在50ms内完成，相比之前的js方案已经有了非常大的提升。

#### GC回收
在运行了一段时间后还是发现了一个问题，视频会突然卡住，控制台报错："Cannot enlarge memory arrays"。可是performance面板中的JS Heap明明才3.6MB-4.2MB的占用，而且从曲线上也完全没有上升的趋势，内存怎么就溢出了呢？

通过浏览器自带的任务管理器发现当前tab页的内存使用竟已经2.2GB,

workerpool、promise-worker、threads.js

## 参考资料

[ImageFilters.js](https://github.com/zhengsk/ImageFilters.js)

[color-pop-effect-using-bodypix-and-tensorflow-js](https://towardsdatascience.com/color-pop-effect-using-bodypix-and-tensorflow-js-a584ddc48a02)

[imageRoutines](https://github.com/m0ose/imageRoutines)

[opencv-wasm](https://github.com/yaniswang/opencv-wasm)
