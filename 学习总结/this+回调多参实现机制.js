//本文探究了this在js中机制，以及回调函数多参数的实现机制
var EventEmitter = require("events").EventEmitter;

function test() {
    var a = 3;
    //this.a = 2;
    (function() {
        console.log(
            this.a, //global.a
            a); //匿名函数.[[scope]].a
    })();
}

test.a = 2; //test Fun 对象属性 a 赋值
test.prototype.a = 4; //test Fun 对象的实例 属性a 赋值
test(); //打印内部函数内容
console.log(test.a) //2
var t = new test(); //赋值 执行内部函数内容
console.log(t); //输出test 对象实例
console.log(t.a); //输出test 对象实例的属性a 
test.prototype.a = 5; //修改test 对象实例的属性a
console.log(t.a); //5 可见实例的prototype 是引用

var te = new EventEmitter();
te.on("do", function(argt1, argt2) {
    console.log(this, argt1, argt2); //回调函数实际在回调对象中执行,如果直接执行那么this应该为global 但是输出的EventEmitter对象，可见回调函数是通过call或者apply调用
});

te.emit("do", "bbb", "ccc");

te.on("e6do", (argt) => console.log(this, argt)); //箭头函数中无this
te.emit("e6do", "ccc")

//下面仿写实现
class testcall {
    constructor() {
        this.events = {}
    }
}

testcall.prototype.on = function(eventstr, callback) {
    this.events[eventstr] = function(args) {
        callback.apply(testcall, args);
    }
}

testcall.prototype.emit = function(eventstr, ...args) {
    this.events[eventstr](args);
}

var testevent = new testcall();
testevent.on("ff", function(a, b) {
    console.log(this, a, b); //此时this为on函数内部 apply的调用对象 testcall
});

testevent.emit("ff", "aname", "bname");
