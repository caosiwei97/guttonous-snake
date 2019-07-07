//随机数对象的构造函数
export class Random {
    //创建实例
    static getInstance() {
        if (!Random.instance) {
            Random.instance = new Random();
        }
        return Random.instance;
    }

    constructor() {

    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
