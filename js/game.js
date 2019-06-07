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
        }.bind(that), 50);
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