//创建食物对象
(function (window) {
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
}(window));