# MarkDown学习
## Mark Code : ‘#’

## 似乎不支持居中
## Mark Code : ‘##’

### h3没有下划线 ###
## Mark Code : ‘### ... ###’

手动下划线1
---------
## Mark Code : ‘------------’

手动下划线2
=========
## Mark Code : ‘============’

手动下划线3
* * *
## Mark Code : ‘* * *’

手动下划线4
_ _ _______
## Mark Code : ‘_ _ _______’

### 简单的列表
* 1 需要空格1
* 2 需要空格2
* 3 需要空格3
## Mark Code : ‘* 1’

+ 1 需要空格1
+ 2 需要空格2
+ 3 需要空格3
## Mark Code : ‘+ 1’

- 5 需要空格5
- 2 需要空格2
- 3 需要空格3
## Mark Code :  ‘- 5’

1. 有序1
1. 有序2
1. 有序3
## Mark Code :  ‘1.’

### 防止连续
-------------------
## Mark Code : ‘--------------’
3. 有序3
1. 有序4
1. 有序5
## Mark Code : ‘3.’

### 区块引用
* 正文
> 引用
>> 引用1
>>> 引用2
## Mark Code : ‘>’ ‘>>’ ‘>>>’

### 链接
[我的日记](https://github.com/wswmjc/Diary)
## Mark Code : ‘[linkname]‘ ’(link)’

### 图片
![我的头像](https://avatars2.githubusercontent.com/u/19622618?s=96&v=4)
wswmjc
## Mark Code : ‘![picname]‘ ’(piclink)‘ ’label’

### 代码块
`console.log("这是段代码");`

```javascript
function print(){
  console.log("这是段代码块");
}
```
## Mark Code : ‘`’ ‘```codetype ```’

### 表格
|数据表|test-table|:::|:::|:::|:::|:::|:::|
|-|-|-|-|-|-|-|-|
|序号|列名|说明|数据类型|是否可空|是否主键|外键|备注|
|1|id|主键id|varchar(36)|×|√|无| |
|2|name|姓名|varchar(36)|×|×|无| |
|3|sex|性别|varchar(1)|×|×|无| |
|4|age|年龄|int|×|×|无| |
