## 第一次参与正式的vue项目 在此总结一下经验

* 脚手架相关
* 一些规范
* vuex总结
* vue router 总结
* 组件相关
* git 相关

### 脚手架相关
1. 安装node 和 npm
2. 安装npm镜像 cnpm
   npm install -g cnpm --registry=https://registry.npm.taobao.org
3. 安装vue 
   Cnpm install vue
4. 安装vue-cli脚手架构建工具（全局安装）
   cnpm install –global vue-cli
5. 创建基于webpack模板的新项目
   vue-init webpack project-name 或者 vue-init webpack-simple project-name  
   **这里需要注意 命令是 vue-init 而不是 vue init  老的版本是vue init**
6. 进入到新创建的文件夹下 执行cnpm install 安装依赖
7. 运行npm run dev 启动服务 / ctrl+c 关闭服务

### 一些规范
1. 符合eslint基本规范
2. 模块如果多个接口 需要统一在文件底部 export {} 对象列表 或 export default {}
3. 接口方面命名需要简单易懂 可以有一定长度 采用驼峰式 首字母大写： function LinkMan () {}
4. 通用接口建议集中在一个模块中
5. 通用常量建议集中在一个模块中
6. 常量命名需要简单易懂 所有字母大写 采用下划线进行分割 ： const VUE_STATE
7. 所有异步接口需要返回Promise对象
8. 接口需要注释 参数必须需要说明
9. restful接口如果含有变量 需要使用模版字符串 不要采用字符串拼接 ： `/user/${id}` yes ; '/user/' + id no;

### vuex总结
1. 需要使用module进行模块区分
2. 变量命名需要易懂 必要时需要注释
3. getters 建议所有数据获取都通过getter获取而不是state； 命名规范 驼峰式 首字母小写
4. mutations 建议只暴露给vuex对象内部使用； 命名规范 所有字母大写 下划线分割
5. actions 暴露给外部调用的接口 在内部调用mutation 更新状态； 命名规范 驼峰式 首字母大写

### vue-router总结
1. 相当于jquery load的封装
2. 嵌套路由通过组件的router-view来实现
3. vue-router可以传递query和params参数 前者为uri 后者为 restful url ；如果希望传递对象列表 暂时只能通过组件通讯 可以使用vuex进行这类参数传递，  
有一个好处是可以缓存传递的数据 如果返回需要还原场景 这种方式可以解决
4. 尽量对每个路由进行命名 可以增强代码的可读性 让人知道跳转的逻辑是什么
5. 跳转可以有回调函数 一般用来解决 跳转后立即执行的代码段

### 组件相关
1. 组件内的样式一定要限定scope 不然容易全局污染
2. render组件不需要template
3. render组件 子组件处理父组件的对象类数据 尽量通过计算属性来处理 不然容易出现递归触发

### git相关
1. git branch -a 查看分支
2. git fetch master分支路径 获取主分支副本
3. git rebase 衍合分支
4. git add -A 添加所有更改
5. git stash 将更改暂存本地
6. git status 查看各分支状态
7. git push -f 强制推送 一般不建议-f
8. git reset --soft commit_id 恢复为某个版本
9. git log --oneline --graph --all -reflog 查看git日志
10. git log commit_id
11. git reset --hard commit_id
12. git commit -m "#xxx [xxx] xxxx"
