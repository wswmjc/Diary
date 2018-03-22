避免全局变量和全局方法，均放置在对应模块的命名空间下

 扩展load方法，遍历html为所有ID增加模块前缀

 扩展选择器调用
```
 function mode$(mode){

   var _$ = jQuery;

   function _mode(mode){

     this.mode = mode;

   };

   _mode.prototype.$ = function(selector){

       if(/^#/.test(selector)){

         return _$(selector.replace("#","#"+this.mode+"_"));

       }else{

         return _$(selector);

       }

   }

   return new _mode(mode);

 }


 $mode = mode$(mode);

 $mode.$("#id");
```
