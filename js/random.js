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
