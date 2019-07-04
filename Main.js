import {
    Food
} from "./js/Food.js";
import {
    Snake
} from "./js/Snake.js";

//游戏主控文件

export class Main {
    constructor(map) {
        //食物对象
        this.food = Food.getInstance();
        //蛇对象
        this.snake = Snake.getInstance();
        //地图
        this.map = map;
        this.speed = 200;
        //获取按钮对象
        this.startBtn = document.querySelector("#start");
        this.pauseBtn = document.querySelector("#pause");
        this.speedBtn = document.querySelector("#speed");
        this.timeId = null;
    }

    //初始化让食物和蛇显示出来
    init() {
        this.food.init(this.map);
        this.snake.init(this.map);
        //调用蛇自移动的方法
        this.runSnake(this.map, this.food, this.speed);
        //调用按键的方法
        this.bindKey();
        //监听按钮事件
        this.bindEvent();
    }
    //蛇自移动，定时器
    runSnake(map, food, speed) {

        this.timeId = setInterval(() => {
            //让蛇移动
            this.snake.move(map, food);
            this.snake.init(map);
            //获取头部的坐标
            let snakeX = this.snake.body[0].x;
            let snakeY = this.snake.body[0].y;
            //最大坐标
            let maxX = map.offsetWidth / this.snake.width;
            let maxY = map.offsetHeight / this.snake.height;
            //如果蛇撞墙游戏结束
            if (snakeX < 0 || snakeX >= maxX) {
                clearInterval(this.timeId);
                alert(`Game Over!,总得分${this.snake.count}`);
                return;
            }
            if (snakeY < 0 || snakeY >= maxY) {
                clearInterval(this.timeId);
                alert(`Game Over!,总得分${this.snake.count}`);
                return;
            }
            //判断分数变化
            if (this.snake.count >= 5) {
                clearInterval(this.timeId);
                this.speed = 100;
                this.runSnake(this.map, this.food, this.speed);
            }

            if (this.snake.count >= 10) {
                clearInterval(this.timeId);
                this.speed = 50;
                this.runSnake(this.map, this.food, this.speed);
            }
        }, speed);
    }
    //按键改变蛇的方向的方法
    bindKey() {
        //获取用户按键,改变蛇的方向
        document.addEventListener("keydown", e => {
            switch (e.keyCode) {
                case 37:
                    if (this.snake.direction === "right") {
                        return;
                    } else {
                        this.snake.direction = "left";
                    }
                    break;
                case 38:
                    if (this.snake.direction === "bottom") {
                        return;
                    } else {
                        this.snake.direction = "top";
                    }
                    break;
                case 39:
                    if (this.snake.direction === "left") {
                        return;
                    } else {
                        this.snake.direction = "right";
                    }
                    break;
                case 40:
                    if (this.snake.direction === "top") {
                        return;
                    } else {
                        this.snake.direction = "bottom";
                    }
                    break;
            }
        }, false);
    }

    //监听按钮事件
    bindEvent() {
        let that = this;
        this.startBtn.addEventListener("click", this.handleStart.bind(that), false);
        this.pauseBtn.addEventListener("click", this.handlePause.bind(that), false);
        //this.speedBtn.addEventListener("click", this.handleSpeed.bind(that), false);
    }

    //不同对象的事件处理函数
    handleStart() {
        //this.speed = 100;
        clearInterval(this.timeId);
        this.runSnake(this.map, this.food, this.speed);
    }

    handlePause() {
        clearInterval(this.timeId);
    }

    // handleSpeed() {

    // }
}