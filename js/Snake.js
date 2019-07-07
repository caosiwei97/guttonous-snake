//创建蛇对象

export class Snake {
    //创建实例
    static getInstance() {
        if (!Snake.instance) {
            Snake.instance = new Snake();
        }
        return Snake.instance;
    }

    constructor(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;
        this.count = 0;
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
        this.elements = [];
        this.remove = () => {
            //从尾部开始删除
            let i = this.elements.length - 1;
            for (; i >= 0; i--) {
                let ele = this.elements[i];
                ele.parentNode.removeChild(ele);
                this.elements.splice(i, 1);
            }
        };
    }
    //为蛇添加初始化方法
    init(map) {
        //初始化之前先删除蛇,让蛇移动
        this.remove();
        //创建蛇的每个部位,一个头,两个身体部分
        for (let i = 0; i < this.body.length; i++) {
            let div = document.createElement("div");
            //蛇的每个对象
            let obj = this.body[i];
            map.appendChild(div);
            div.style.position = "absolute";
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.left = obj.x * this.width + "px";
            div.style.top = obj.y * this.height + "px";
            div.style.backgroundColor = obj.color;
            //放入数组
            this.elements.push(div);
        }
    }

    //蛇移动的方法
    move(map, food) {
        //将蛇的第三个部分放到第二个,第二个部分放到第一个
        let i = this.body.length - 1;
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
        //判断蛇是否吃到食物
        //获取蛇头部坐标与食物坐标比较
        let headX = this.body[0].x * this.width;
        let headY = this.body[0].y * this.height;
        let score = document.querySelector("#score");
        if (headX == food.x && headY == food.y) {
            //获取蛇的尾巴
            let last = this.body[this.body.length - 1];
            //复制该尾巴
            this.body.push({
                x: last.x,
                y: last.y,
                color: last.color
            });
            this.count++;
            score.innerHTML = `得分: ${this.count}`;
            //删除食物并且初始化食物
            food.init(map);
        }
    }
}
