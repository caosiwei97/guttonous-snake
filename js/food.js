import { Random } from "./Random.js";

//创建食物对象

export class Food {

    //创建实例
    static getInstance() {
        if (!Food.instance) {
            Food.instance = new Food();
        }
        return Food.instance;
    }

    constructor(width, height, color) {
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "green";
        this.element = document.createElement("div");
        this.elements = [];//食物数组
        this.remove = () => {
            //从数组中找到该食物,然后找到该食物的父级元素,从父级元素删除该食物
            this.elements.forEach((ele, index) => {
                ele.parentNode.removeChild(ele);
                //将数组元素清空
                this.elements.splice(index, 1);
            });
        };
    }

    //初始食物的方法
    init(map) {
        //初始化之前先删除地图中的元素
        this.remove();

        let div = this.element;
        map.appendChild(div);

        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        div.style.position = "absolute";

        //初始化随机坐标
        this.x = Random.getInstance().getRandom(0, map.offsetWidth / this.width) * this.width;
        this.y = Random.getInstance().getRandom(0, map.offsetHeight / this.height) * this.height;
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";

        //将该食物放入数组
        this.elements.push(div);
    }

}