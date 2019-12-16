# 版本更新2019-7-4

## 说明
使用ES6语法重构了master的代码，并且增加了以下功能：
* 开始按钮
* 暂停按钮
* 得分，每得5分难度增加

## 解决问题
* 使用模块化思想
* 蛇不会在向右移动的时候向左转向，也不会向上移动的时候向下转向

## 待优化问题
* 如何使用canvas重构
* 加入图片
* 优化背景和蛇

***
## 贪吃蛇游戏
这是一个简单版的贪吃蛇游戏，主要练习面向对象编程思想，方便自己的学习和理解面向对象思想

## 游戏分析
要使用面向对象思想来做这个程序，所以多给自己提问
* 什么是面向对象
* 什么是对象
* 如何找对象
* 这个游戏的对象是什么
* js不是面向对象的语言，那使用js如何实现面向对象呢
### 面向对象编程思想（来自百度百科）
> 面向对象的程序设计语言必须有描述对象及其相互之间关系的语言成分。这些程序设计语言可以归纳为以下几类：系统中一切事物皆为对象；对象是属性及其操作的封装体；对象可按其性质划分为类，对象成为类的实例；实例关系和继承关系是对象之间的静态关系；消息传递是对象之间动态联系的唯一形式，也是计算的唯一形式；方法是消息的序列。
### 对象
我的理解是：具有某种行为或属性的某一个事物或人称为对象，总之万物皆为对象
### 游戏中的对象
* 游戏
* 地图
* 蛇
* 食物
* 随机数对象
### js如何实现面向对象
js是一门基于面向对象的语言，但不是面向对象的，也就是说可以使用一些方法可以模拟面向对象，我们都知道面向对象具有以下特性：
* 封装
* 继承
* 多态
* 抽象

js中所有的对象的原型都最终指向了object，形成原型链，根据这个特性来实现继承，或者使用es6的语法使用class的方法来实现，其实原理就是原型链，es6不是所有的浏览器都支持，所以这里使用最原始的方法。
js没有类的概念，但是可以通过构造函数来模拟，添加属性和方法，实现封装，也可以把需要共享属性和方法放在原型对象中，实现继承。

有了这些概念，可以来实现了，其实我一开始是毫无头绪的，不从下手，但是一点点的分析慢慢就知道如何实现了。
## 实现
### 地图的显示
设置一个div创建地图，设置样式
```html
<div class="map"></div>
```

```css
.map {
            width: 800px;
            height: 600px;
            background-color: #ccc;
            position: relative;
            margin: 50px auto;
        }
```
### 随机数对象random

这里把random对象暴露在window中，设置为全局对象，方便在其他对象中使用，后面的是一样的。

```javascript
//随机数自调用函数
((function (window) {
    //随机数对象的构造函数
    function Random() {

    }
    //添加方法
    Random.prototype.getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    //将该对象设置为全局对象
    window.Random = new Random();

})(window));

```
### 食物对象food

食物首先初始化随机生成在地图上，等待蛇过来吃它。蛇吃完后马上就要再产生新的食物，但是先要把之前的食物清除，我把食物存储在一个elements数组中，方便清除。食物的坐标是食物的宽度与地图的宽度的比值。

分析食物的属性有：
* 宽（默认20px）
* 高（默认20px）
* 颜色（默认为绿色）

方法：
* 初始化食物，随机在地图上生成
* 清空食物，生成之前先把之前存在的食物先清除掉（防止一个地图全是食物，毕竟食物一次只能随机产生一次）
```javascript
//创建食物对象
((function (window) {
    //创建一个数组存储食物
    var elements = [];
    //食物的构造函数
    function Food(width, height, color) {
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "green";
        this.element = document.createElement("div");
    }

    //初始食物的方法
    Food.prototype.init = function (map) {
        //初始化之前先删除地图中的元素
        remove();
        var div = this.element;
        map.appendChild(div);
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        div.style.position = "absolute";
        //初始化随机坐标
        this.x = Random.getRandom(0, map.offsetWidth / this.width) * this.width;
        this.y = Random.getRandom(0, map.offsetHeight / this.height) * this.height;
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        //将该食物放入数组
        elements.push(div);
        //定义私有函数
        function remove() {
            //从数组中找到该食物,然后找到该食物的父级元素,从父级元素删除该食物
            for (var i = 0; i < elements.length; i++) {
                var ele = elements[i];
                ele.parentNode.removeChild(ele);
                //将数组元素清空
                elements.splice(i, 1);
            }
        }

    };

    window.Food = Food;
})(window));
```
### 蛇对象snake

玩家操控方向键，蛇开始走动。初始时，蛇从固定的位置出发，如果碰到一个食物，那么蛇的身体将增长一个食物的长度，如果蛇碰到了地图边界，那么蛇就挂了，游戏结束。

定义一个对象数组body，存储蛇的每一部分，每一个部分的属性有：x坐标，y坐标，颜色。如果蛇横向移动那么保持纵坐标不变，纵向移动则保持横坐标不变。

其实从视觉来看蛇好像移动了，其实并不是，只是下次移动的时候又生成了一条蛇，这条蛇尾部的坐标变成了尾部前面一个div的坐标，而头部是根据方向来改变坐标的值，然后再把上条蛇删除就可以动了。
删除的方法也是把蛇的每个部分存入数组再删除。

同理，蛇吃食物，好像是吃到了食物，也是判断坐标，如果头部的坐标和食物的坐标相等，那么蛇的尾巴变长，其实也就是复制了一个对象加入了对象数组，看起来蛇变长了。然后，把食物删除，再随机生成食物。

属性：

* 宽（默认20px）
* 高（默认20px）
* 蛇的组成（头部和身体）
* 蛇的方向（默认向右）

方法：
* 初始化蛇位置
* 蛇移动
* 移除蛇

```javascript (stype)
//创建蛇对象
((function (window) {
    //创建一个数组存储蛇的每个部分
    var elements = [];
    //蛇的构造函数
    function Snake(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;
        this.body = [{
                x: 3,
                y: 2,
                color: "red"
            },
            {
                x: 2,
                y: 2,
                color: "orange"
            },
            {
                x: 1,
                y: 2,
                color: "orange"
            }
        ];
        this.direction = direction || "right";
    }
    //为蛇添加初始化方法
    Snake.prototype.init = function (map) {
        //初始化之前先删除蛇,让蛇移动
        remove();
        //创建蛇的每个部位,一个头,两个身体部分
        for (var i = 0; i < this.body.length; i++) {
            var div = document.createElement("div");
            var obj = this.body[i];
            map.appendChild(div);

            div.style.position = "absolute";
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.left = obj.x * this.width + "px";
            div.style.top = obj.y * this.height + "px";
            div.style.backgroundColor = obj.color;
            //放入数组
            elements.push(div);
        }
    };
    //蛇移动的方法
    Snake.prototype.move = function (map, food) {
        //将蛇的第三个部分放到第二个,第二个部分放到第一个
        var i = this.body.length - 1;
        for (; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        //判断方向,使头部移动
        switch (this.direction) {
            case "right":
                this.body[0].x += 1;
                break;
            case "left":
                this.body[0].x -= 1;
                break;
            case "top":
                this.body[0].y -= 1;
                break;
            case "bottom":
                this.body[0].y += 1;
                break;
        }
        //判断蛇吃到食物没有
        //获取蛇头部坐标与食物坐标比较
        var headX = this.body[0].x * this.width;
        var headY = this.body[0].y * this.height;

        if (headX == food.x && headY == food.y) {
            //获取蛇的尾巴
            var last = this.body[this.body.length - 1];
            //复制该尾巴
            this.body.push({
                x: last.x,
                y: last.y,
                color: last.color
            });
            //删除食物并且初始化食物
            food.init(map);
        }
    };
    //删除蛇
    function remove() {
        //从尾部开始删除
        var i = elements.length - 1;
        for (; i >= 0; i--) {
            var ele = elements[i];
            ele.parentNode.removeChild(ele);
            elements.splice(i, 1);
        }
    }
    window.Snake = Snake;
})(window));
```
### 游戏对象Game
在这个对象里面，主要是初始化食物和蛇，让它们在地图上显示出来，这里使用一个定时器，隔一段时间，蛇就朝一个方向移动。如果蛇吃到食物，那么食物再被初始化；如果蛇碰到墙壁，那么就go die了，game over。

属性：
* 食物的实例化对象
* 蛇的实例化对象
* 地图

方法：
* 初始化方法：主要是初始化食物和蛇的位置
* 蛇自移动方法：主要是定时器
* 绑定按键方法：监听玩家操控的方向键，把值传给蛇的方向属性值，决定蛇移动方向

注意：在定时器中使用this一定要小心，因为定时器是window对象的，所以在游戏对象中要绑定游戏这个对象。在es6中可以使用箭头函数来解决问题，这里暂时采用了将this放在一个变量中来充当this。

```javascript (type)
//游戏启动
((function (window) {
    var that = null; //保存Game的实例对象
    //创建游戏的构造函数
    function Game(map) {
        //食物对象
        this.food = new Food();
        //蛇对象
        this.snake = new Snake();
        //地图
        this.map = map;
        that = this;
    }
    //初始化让食物和蛇显示出来
    Game.prototype.init = function () {
        this.food.init(this.map);
        this.snake.init(this.map);
        //调用蛇自移动的方法
        this.runSnake(this.map, this.food);
        //调用按键的方法
        this.bindKey();
    };
    //蛇自移动
    Game.prototype.runSnake = function (map, food) {
        var timeId = setInterval(function () {
            //让蛇移动
            this.snake.move(map, food);
            this.snake.init(map);
            //获取头部的坐标
            var snakeX = this.snake.body[0].x;
            var snakeY = this.snake.body[0].y;
            //最大坐标
            var maxX = map.offsetWidth / this.snake.width;
            var maxY = map.offsetHeight / this.snake.height;
            //如果蛇撞墙游戏结束
            if (snakeX < 0 || snakeX >= maxX) {
                clearInterval(timeId);
                alert("游戏结束");
            }
            if (snakeY < 0 || snakeY >= maxY) {
                clearInterval(timeId);
                alert("游戏结束");
            }
        }.bind(that), 500);
    };
    //按键改变蛇的方向的方法
    Game.prototype.bindKey = function () {
        //获取用户按键,改变蛇的方向
        document.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:
                    this.snake.direction = "left";
                    break;
                case 38:
                    this.snake.direction = "top";
                    break;
                case 39:
                    this.snake.direction = "right";
                    break;
                case 40:
                    this.snake.direction = "bottom";
                    break;
            }
        }.bind(that), false);
    };
    window.Game = Game;
})(window));
```
### 实例化游戏对象并初始化
```html
var game = new Game(document.querySelector(".map"));
game.init();
```
## 游戏测试
* 点击按钮启动游戏（后续优化）
* 设置游戏难度（后续优化）
> 在game对象里面的定时器设置，后续需要优化
* 键盘方向键控制蛇的方向
![](img/game.png)
* 蛇碰到方块身体长度变长
* 蛇碰到边界游戏结束或者蛇碰到自己的身体游戏结束（后续优化）
![](img/gameover.png)
 ## 后续优化
 * 启动按钮
 * 难度按钮
 * 蛇的形状
 * 蛇结束的条件
