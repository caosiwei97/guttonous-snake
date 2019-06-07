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
            //蛇的每个对象
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