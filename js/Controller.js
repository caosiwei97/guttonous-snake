export class Controller {

    static getInstance() {
        if (!Controller.instance) {
            Controller.instance = new Controller();
        }
        return Controller.instance;
    }

    constructor() {
       
        this.speed = 200;
    }

    //监听点击事件
    bindEvent() {
        this.startBtn.addEventListener("click", this.handleStart , false);
        this.pauseBtn.addEventListener("click", this.handlePause , false);
        this.speedBtn.addEventListener("click", this.handleSpeed , false);
    }

    //不同对象的事件处理函数
    handleStart() {
        this.speed = 200;
    }

    handlePause() {
        this.speed = 0;
    }

    handleSpeed() {
        this.speed = 200;
    }
}