// 定义观察者
class Observer{
    constructor(data){
        this.observe(data);
    }
    // data是一个对象，可能嵌套其它对象，需要采用递归遍历的方式进行观察者绑定
    observe(data){
        if(data && typeof data === 'object'){
            Object.keys(data).forEach(key =>{
                this.defineReactive(data, key, data[key]);
            })
        }
    }
    // 通过 object.defineProperty方法对对象属性进行劫持
    defineReactive(obj, key, value){
        // 递归观察
        this.observe(value);
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: false,
            get(){
                // 订阅数据变化时，往Dev中添加观察者
                Dep.target && dep.addWatcher(Dep.target);
                return value;
            },
            // 采用箭头函数在定义时绑定this的定义域
            set: (newVal)=>{
                if(value === newVal) return;
                this.observe(newVal);
                value = newVal;
                // 通知watcher数据发生改变
                dep.notify();
            }
        })
    }
}
