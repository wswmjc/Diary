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
   var cb_obj = event.clipboardData  //火狐 谷歌
              || window.clipboardData; //IE
   console.log(cb_obj); //DataTransfer对象
   
   //获取待粘贴图片
   var files = cb_obj.items  //火狐 谷歌
              || cb_obj.files; //IE    
              
   console.log(files);    //这里有个很有意思的现象：直接输出的话可以查看到，但是如果在上一步输出的
                          //cb_obj里面查看items/files是看不到的，原因是clipboardData只会临时存储
                          //待粘贴的内容，粘贴完成后就会清空内容，所以无法看到
   
    if (files) {
                var len = files.length,blob = null;
                //files.length比较有意思，初步判断是根据mime类型来的，即有几种mime类型，长度就是几 
                //如果粘贴纯文本，那么len=1，如果粘贴网页图片，len=2, items[0].type = 'text/plain', items[1].type = 'image/*'
                //如果使用截图工具粘贴图片，len=1, items[0].type = 'image/png'
                //如果粘贴纯文本+HTML，len=2, items[0].type = 'text/plain', items[1].type = 'text/html'

                //在files里找粘贴的image,需要循环  
                for (var i = 0; i < len; i++) {
                    if (files[i].type.indexOf("image") !== -1) {
                        //getAsFile() 此方法只是living standard firefox ie11 并不支持  IE直接获取的就是文件
                        blob = files[i].getAsFile ? files[i].getAsFile() : files[i];
                    }
                }
                
                if (blob !== null) {
                    //如果是图片 阻止默认行为即不让剪贴板内容在div中显示出来 其他类别暂不作处理
                    event.preventDefault();
                    
                    //通过ajax上传formdata
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var base64_str = event.target.result
                        var form_data = new FormData();
                        form_data.append('image', base64_str);
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/service/IMCutService.ashx', true);
                        xhr.onload = function () {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var data = JSON.parse(xhr.responseText);
                                    if (data.result == true) {
                                        var path = data.filePath;
                                        //console.log(path);
                                        //这里将返回的图片插入到编辑器中
                                        //$editor.insertImage(path);
                                    } else {
                                        console.log(data.Message);
                                    }
                                } else {
                                    console.log(xhr.statusText);
                                }
                            };
                        };
                        xhr.onerror = function (e) {
                            console.log(xhr.statusText);
                        }
                        xhr.send(form_data);

                    }
                    reader.readAsDataURL(blob);
                }
            }          
}

```

### C#服务端处理 /service/IMCutService.ashx
```C#
public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string image = context.Request.Form["image"].ToString();
        if (string.IsNullOrEmpty(image) == true)
        {
            context.Response.Write(Config.Serializer.Serialize(new { result = false, message = "未上传文件！" }));
            context.Response.End();
            return;
        }
        else
        {
            //获取图片base64 编码串
            string regex = @"^data:image\/png;base64,|^data:image\/jpg;base64,|^data:image\/jpg;base64,|^data:image\/bmp;base64,";
            image = System.Text.RegularExpressions.Regex.Replace(image, regex, string.Empty, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        }
        
        //存为png
        string saveFileName = Guid.NewGuid().ToString() + ".png";
        string saveDirectory = HttpContext.Current.Server.MapPath("/file/IMCut/");
        if (!Directory.Exists(saveDirectory))
        {
            Directory.CreateDirectory(saveDirectory);
        }
        string savePath = saveDirectory + saveFileName;
        bool result = Base64StringToImage(image, savePath);
        if (result == false)
        {
            context.Response.Write(Config.Serializer.Serialize(new { result = false, message = "保存文件到本地出错！" }));
            context.Response.End();
        }
        else
        {
            context.Response.Write(Config.Serializer.Serialize(new { result = true, filePath = "/file/IMCut/" + saveFileName }));
            context.Response.End();
        }
    }
    
    //存储图片
    private bool Base64StringToImage(string fileStr,string savePath)
    {
        bool result = false;
        try
        {
            byte[] arr = Convert.FromBase64String(fileStr);
            MemoryStream ms = new MemoryStream(arr);
            Bitmap bmp = new Bitmap(ms);
            bmp.Save(savePath, System.Drawing.Imaging.ImageFormat.Png);
            ms.Close();
            result = true;
        }
        catch (Exception ex)
        {
            //异常输出
            Config.IlogicLogService.Write(new LogicLog()
            {
                AppName = Config.AppName,
                ClassName = ClassName,
                NamespaceName = NamespaceName,
                MethodName = MethodBase.GetCurrentMethod().Name,
                Message = ex.Message,
                Oper = Config.Oper
            });
        }
        return result;
    }

```


&emsp;&emsp;到这里基本的粘贴上传算是实现了，效果和知乎编辑器的粘贴上传一样，不过兼容性
没有做处理，最新版本的火狐谷歌和IE测试均通过。

## 后记
&emsp;&emsp;最后有一个问题是本地图片的粘贴，目前火狐是直接支持将图片转为base64然后粘
贴的到浏览器中，基于安全原因，IE谷歌不提供这个功能。至于火狐是如果实现的，暂时没有查到
它将临时粘贴的文件存储到哪个对象中，因此本地文件暂时还是通过input[type='file']来进行
form上传。如果有人知道如果做，请不吝赐教！
