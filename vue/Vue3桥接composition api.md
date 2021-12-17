## 混合开发 客户端与webview交互类 
### 逻辑
1. 一般客户端可以主动访问webview挂载到window上的方法，webview可以访问客户端注入到window上的桥接类
2.  如果将客户端看作服务器的话，那么webview就是浏览器端，客户端服务器和webview浏览器端是可以双向交互，可以看作一个半双工的交互协议
3.  而在实际开发过程中 多是webview端主动请求客户端 而客户端进行回复 因此可以设计一个协议如下：
```javascript
//     request: 
         {
             actionId: '',     // 请求的actionid 可以为整形 或者 字符串 看客户端的定义
             callbackName: '', // 请求的回调函数
             content: {        // 请求体的内容
                 ...
             }
         }
//     response:
         {
             status: 1,        // 请求状态 成功与否
             message: ''       // 附加消息
             data: {           // callback入参
                 ...
             }
         }
```
4. 一般在webview端 应该首先确认客户端注入的桥接类是否加载完成（测试基本是秒加载） 之后才能进行其他的交互操作

### 代码
```javascript
// UIWEBVIEW 通过 JSExport 协议实现 一般注入方式为 window.[BridgeClassName].[callfunctionName]
// ios webkitWebview 中一般注入为 window.webkit.messageHandlers.[BridgeClassName].[callfunctionName]  其中 callfunctionName 固定为 postMessage

/**
 * 
 * @param isIosWebkit 是否为ios webkit webview  (IOS13已强制更新为webkitwebview)
 * @param bridgeClassName  桥接的类名 客户端提供
 * @param callfunctionName  桥接的调用方法名 客户端提供 ios webkitwebview 固定为 postMessage
 * @returns 
 * GetBridge  初始化hybird 对象 处理webkitwebivew的兼容 
 * BridgeCall 桥接对象
 * @example
 * import { useHybirdInit } from 'hybird.ts'
 * const {GetBridge, BridgeCall} = useHybirdInit(true, 'OCJSBridge', 'jsToOc')
 * GetBridge(()=>{
 *     BridgeCall(
 *      1,
 *      {
 *        userid: '123'
 *      },
 *      'getUserInfo',
 *      (userinfo) => {console.log('userinfo is',userinfo)}
 *     ) 
 * })
 */
export function useHybirdInit(isIosWebkit: Boolean, bridgeClassName: string, callfunctionName:  string) : {
    BridgeCall : Function,
    GetBridge : Function
} {
    const MAX_TRY_TIME : number = 50
    const TRY_INTERVAL: number = 20
    let tryTimes = 0
    let hasLoaded = false
    if(isIosWebkit) {
        callfunctionName = 'postMessage'
    }
    const GetBridge =  (callback : Function,finalCallback: Function|undefined = undefined) => {
        if (tryTimes > MAX_TRY_TIME) {
            if (finalCallback !== undefined) {
              finalCallback()
            }
            return
          }
          hasLoaded =
          isIosWebkit == true
              ? (window as any).webkit !== undefined
              : (window as any)[bridgeClassName] !== undefined
          if (hasLoaded == false) {
            tryTimes += 1
            setTimeout(() => {
                GetBridge(callback)
            }, TRY_INTERVAL)
          } else {
            // 兼容性处理 兼容webkitwebview 使调用方式保持一致
            if (isIosWebkit == true && (window as any)[bridgeClassName] == undefined) {
                (window as any)[bridgeClassName] = Object.create(null)
                (window as any)[bridgeClassName][callfunctionName] = function (args: string) {
                    (window as any).webkit.messageHandlers[bridgeClassName].postMessage(args)
              }
            }
            callback()
          }
    }

    const BridgeCall = (action : string | number, data : any , callbackName: string, callback: Function | undefined) => {
        if(callback !== undefined) {
            (window as any)[callbackName] = function(responseJson: string) {
                callback(JSON.parse(responseJson))
            }
        }

        (window as any)?.[bridgeClassName]?.[callfunctionName](
            JSON.stringify({
                actionId: action,
                callbackName,
                content: JSON.stringify(data)
            })
        )
    }

    return {
        GetBridge,
        BridgeCall
    }
}
```

### 调用
```javascript
 import { useHybirdInit } from 'hybird.ts'
 const {GetBridge, BridgeCall} = useHybirdInit(true, 'OCJSBridge', 'jsToOc')
 // 初始化 并获取用户信息
 GetBridge(()=>{
      BridgeCall(
       1,
       {
         userid: '123'
       },
       'getUserInfo',
       (userinfo) => {console.log('userinfo is',userinfo)}
      ) 
 })
 
 // 其他业务 下载媒体文件
 BridgeCall(
       2,
       {
         mediaId: 'xxxx'
       },
       'getMediaSrc',
       (src) => {console.log('media src is',src)}
 ) 
```