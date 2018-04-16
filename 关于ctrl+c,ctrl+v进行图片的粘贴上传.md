# 图片上传
* 1、起因
* 2、原理
* 3、实现

-- --
## 起因
&emsp;&emsp;在公司有做过一个组件，评论框。集成了基本的简单编辑器、表情、字数检测等等功能。
主要应用到的项目有朋友圈，微博，OA评论。因为开始是内部项目用，所以使用的人也不是很多，因此
有好多细节都没有深入的做。  

&emsp;&emsp;最近公司在做IM工具，将这个评论框应用到了发布模块，基本功能都实现，但是发送图
片使用了单独的form表单上传方式，主要运用jquery的ajaxsubmit。后来同事说屏幕截图有时好使有
时不好使，所以就专门对这块做了深入的研究并实现。  

## 原理
&emsp;&emsp;评论框是基于div-contenteditable实现，对于contenteditable这属性还有个小故
事，是有次面试被面试官问道你不是以为contenteditable属性只有true和false两个值吧，当时真是
一脸懵逼的说应该是只有两个值吧，感觉这种类似bool的值难道还有个unknown吗？  

&emsp;&emsp;后来面试完了之后也查了好久，在张鑫旭的博客上才发现
[contenteditable](http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/)
有其他属性的应用  

``` css
contenteditable=""  
contenteditable="events"  
contenteditable="caret"  
contenteditable="plaintext-only"  
contenteditable="true"  
contenteditable="false"  
```
这里就不详细阐述了，大家想了解就去链接上看看吧，感觉跑题了。  
&emsp;&emsp;**回到粘贴图片原理本身，从web上复制的图片和截图，均会临时存在事件对象的剪切板中，
当粘贴或者拖拽完成时，将图片或图片链接添加到可编辑区域。**  
&emsp;&emsp;而我们要做的事情，其逻辑步骤主要分三步：  
* 1、 在粘贴之前获取到待粘贴的图片
* 2、 将获取到的图片上传到服务器
* 3、 根据服务器返回的存储路径生成img标签并插入到可编辑区域  

以上则完成了复制粘贴上传或者拖拽上传。

## 实现

&emsp;&emsp;文章开头有说我们的同事在截屏粘贴发送过程中发现有时好使有时不好使，其具体原因就是现
在浏览器基本都自己实现了粘贴图片或截图功能，而且你会发现都能复制为base64位的图片，但是由于IM发
送消息体的长度限制，当图片过大时，base64位图片是个很长的字符串，所以会有发送失败的情况。因此很有
必要实现这一功能来解决这一业务问题。具体实现如下：  

### css
```css
  #divRichText{
    width:500px;
    height:300px;
    border: 1px soild #eee;
  }
```
### 编辑器
```html 
<div contenteditable='true' id='divRichText'></div>
```

### javascript
```javascript
var rich_text = document.getElementById("divRichText");
rich_text.on("paste",UploadImageEvent);

function UploadImageEvent(event){
   //获取剪切板对象
   var cb_obj = event.clipbordData  //火狐 谷歌
              || window.event.clipbordData; //IE
   console.log(cb_obj); //DataTransfer对象
   
   //获取待粘贴图片
   var files = cb_obj.items || cb_obj.files;
}

```


