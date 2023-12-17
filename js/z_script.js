let pstNumArr = [{ idx: 1, position: 0 },
{ idx: 2, position: 60  },
{ idx: 3, position: 120  },
{ idx: 4, position: 180  },
{ idx: 5, position: 240  },
{ idx: 6, position: 300  }
];
$(_ => {
    pstNumArr.forEach((el, i) => {
        let htm = `<li data-origin="0px" class="list-item" style="float: none;left: 0px;">
                    <div class="rank_idx " ><img src="./img/l${el['idx']}.png" /> </div>
                    <div class="rank_label ranks${el['idx']} flex-box center">
                        <img src="./img/${el['idx']}.png" />
                    </div>
                    </li>`
        $("ul.letters").append(htm)
    });
});

function getStyle(obj, style) {
    return obj.currentStyle ? obj.currentStyle[style] : getComputedStyle(obj, false)[style];
};
//原生js动画类似jquery--animate
function animate(obj, styleJson, callback) {
    clearInterval(obj.timer);
    // 开启定时器
    obj.timer = setInterval(function () {
        var flag = true;//假设所有动作都已完成成立。
        for (var styleName in styleJson) {
            //1.取当前属性值
            var iMov = 0;
            // 透明度是小数，所以得单独处理
            iMov = styleName == 'opacity' ? Math.round(parseFloat(getStyle(obj, styleName)) * 100) : parseInt(getStyle(obj, styleName));

            //2.计算速度
            var speed = 0;
            speed = (styleJson[styleName] - iMov) / 8;//缓冲处理，这边也可以是固定值
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);//区分透明度及小数点，向上取整，向下取整

            //3.判断是否到达预定值
            if (styleJson[styleName] != iMov) {
                flag = false;
                if (styleName == 'opacity') {//判断结果是否为透明度
                    obj.style[styleName] = (iMov + speed) / 100;
                    obj.style.filter = 'alpha(opacity:' + (iMov + speed) + ')';
                } else {
                    obj.style[styleName] = iMov + speed + 'px';
                }
            }
        }
        if (flag) {//到达设定值，停止定时器，执行回调
            clearInterval(obj.timer);
            if (callback) { callback(); }
        }
    }, 60)
};

function toRunSortRank(socArr){
    if (socArr){
        console.log("socArr :",socArr)
        socArr.forEach((el, i) =>{
//            console.log("socArr :",socArr[i])
            $('.ranks' + (socArr[i])).stop()    // 停止动画
            $('.ranks' + (socArr[i])).animate({ //移动动画
                top: (pstNumArr[i]["position"]) + 'px',
            });
        })
    }
};

//=========启动一个websocket
var Socket1;
Socket1 = $.websocket({
    domain: "127.0.0.1",   //这是与服务器的域名或IP
    port: 9999,                  //这是服务器端口号
    protocol: "",            //这东西可有可无,组合起来就是 ws://www.qhnovel.com:8080/test
    onOpen: function (event) {
        //  alert("已经与服务端握手,onOpen可省略不写");
        Socket1.send("ping"); //传递心跳信息
    },
    onError: function (event) {
        //  alert("发生了错误,onError可省略不写");
        console.log("reconnect();", event)
        reconnect();//断开重连
    },
    onSend: function (msg) {
        //  alert("发送数据额外的代码,可省略不写");
        console.log('ping:', msg);
        //用来处理正常的聊天室消息
    },
    onClose: function (e) {
        console.log("close", e)
        reconnect();//断开重连
    },
    onMessage: function (result, nTime) {
        // console.log(result);
        let res = JSON.parse(result)
        if (res.type == 'pm') {
            console.log("pm msg socket:", res)
            toRunSortRank(res.data)
        } else {
            console.log("msg socket:", res)
        }
    }
});
// 重连函数
function reconnect() {
    console.log("websocket正在重新连接")
    setTimeout(_=>{
        location.reload();
    }, 5000)
}
//当visibilityState流浪器的状态改变时，进行监听
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        //页面被隐藏或调到后台

    } else {
        //页面还在时异常被关闭才进行重连
//        console.log("Close回调函数，自动重连")
//        reconnect();
    }
})


