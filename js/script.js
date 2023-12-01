var spacing = 0;
var offset = 60;
var count = 0;
var positions = [];
var isTest = 0
let pstNumArr=  [{idx:1,name:'A',time:'20:39'},
                {idx:2,name:'B',time:'20:39'},
                {idx:3,name:'C',time:'20:39'},
                {idx:4,name:'D',time:'20:39'},
                {idx:5,name:'E',time:'20:39'},
                {idx:6,name:'F',time:'20:39'}
                ]
            $(_=>{
               pstNumArr.forEach(function(el,i) {
                let htm = `<li data-origin="0px" class="list-item" style="float: none;left: 0px;">
                <div class="rank_idx " ><img src="./img/l${i+1}.png" /> </div> 
                <div class="rank_label ranks${i} flex-box center">
             
                <img src="./img/${i+1}.png" />
                </div> 
            
             </li>`
                $("ul.letters").append(htm)
               })
            //        <div class="time rank_label flex-box"><div>${el.time}</div> </div> 
           $(".list-item").each(function(e) {
        
                the_position = spacing ;
                positions.push(the_position);
                $(this).css("top", the_position);
                $(this).find(".rank_idx").eq(0).css('background', `url(./img/${e+1}.png) no-repeat 100% 100%)`);
                $(this).attr("data-origin", the_position);
                $(this).attr("data-idx", e);
                spacing += offset;
                count++
            });

            })
            function getStyle(obj,style){
                return obj.currentStyle?obj.currentStyle[style]:getComputedStyle(obj,false)[style];
            }
            //原生js动画类似jquery--animate
            function animate(obj,styleJson,callback){
                clearInterval(obj.timer);
                // 开启定时器
                obj.timer=setInterval(function(){
                    var flag=true;//假设所有动作都已完成成立。
                    for(var styleName in styleJson){
                        //1.取当前属性值
                        var iMov=0;
                        // 透明度是小数，所以得单独处理
                        iMov=styleName=='opacity'?Math.round(parseFloat(getStyle(obj,styleName))*100):parseInt(getStyle(obj,styleName));
        
                        //2.计算速度
                        var speed=0;
                        speed=(styleJson[styleName]-iMov)/8;//缓冲处理，这边也可以是固定值
                        speed=speed>0?Math.ceil(speed):Math.floor(speed);//区分透明度及小数点，向上取整，向下取整
                        
                        //3.判断是否到达预定值
                        if(styleJson[styleName]!=iMov){
                            flag=false;
                            if(styleName=='opacity'){//判断结果是否为透明度
                                obj.style[styleName]=(iMov+speed)/100;
                                obj.style.filter='alpha(opacity:'+(iMov+speed)+')';
                            }else{
                              obj.style[styleName]=iMov+speed+'px';
                            }
                        }
                    }
                    if(flag){//到达设定值，停止定时器，执行回调
                        clearInterval(obj.timer);
                        if(callback){callback();}
                    }
                },60)
            }
        
// $("ul.letters li").css("float", "none").css("position", "absolute");
function toRunSortRank(socArr,isTime){
       
    $(this).addClass('aniFont')
    var c = positions.slice(0);
    // console.log("background: #333;as",c)
    
    var a = [];

     a =socArr? socketRank(socArr,positions):fisherYates(c);
    
    // console.log("sssdfff;",a,socArr)
    $("ul.letters li").each(function(i) {
        console.log(" $(this).attr('data-origin'),;",i,socArr,socArr[i],positions,positions[socArr[i]-1],socArr[i])
        let rNo = $(this).attr('data-origin')
        $(this).find('.rank_label').removeClass('aniFont')
        let inds =  $(this).index()
        // console.log("ds",inds+1,socArr.mc,socArr)
        // $(this).find('.rank_label').eq(1).hide()
        // $(this).find('.rank_label').animate({
        //     top: ((positions[socArr[i]])) +'px',
        // })
        $('.ranks'+(socArr[i]-1)).animate({
            top: ((positions[i])) +'px',
        })
        if( isTime&&inds+1==socArr.mc){
            $(this).find('.rank_label').eq(1).text(socArr.data).show().addClass('aniFont')
            return
        }
        
        // $(this).find('.rank_label').eq(0).show().addClass('aniFont')
        // $(this).find('.rank_label').append(positions[socArr[i]])
       
        // $(this).find('.rank_label').eq(1)
        // $(this).find('.rank_idx').eq(0).text(a[0]/60+1)
       
    })
   
    socArr.forEach((re,i)=>{
        console.log(i,positions[re-1])
       
    //    console.log('$("ul.letters li").eq(re-1)',$("ul.letters li")[re-1])
    //     document.getElementsByClassName("rank_label")[re-1].style.top = ((positions[i])) +'px'
    //     animate(document.getElementsByClassName("rank_label")[re-1],{top: ((positions[i]))},()=>{

    //     })
        a.splice(0, 1) 
    })
   
    
}
$("#shuffle").on('click',function(){
    let ar = [3, 2, 4, 1, 5, 6]
    toRunSortRank(ar)
})
$("#restore").on('click',function(){
    $("ul.letters li").each(function(e,i) {
        var a = $(this).attr("data-origin");
        $(this).animate({
            top: a
        })
      
    })
});

function socketRank(c,posArr) {
    var a = c.length;
    let arrs =[]
    if (a == 0) {
        return false
    }
    // console.log("arrs",posArr,c)
    for(var i=0;i<=a-1 ; i++){
    //  console.log("arrs",posArr,c)
        arrs[i] = posArr[c[i]-1] 
    }
    // 随机数
    
    return arrs
}


function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    let time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    time_str = time_str==='0-0-0 0:0:0'?'':time_str
    return time_str
  }

function  getSuiJi(min = 0, max = 10) {
    min = Math.ceil(min)
    max = Math.ceil(max)
    return Math.floor(Math.random() * (max - min) + min)
}
function fisherYates(c,t) {
    var a = c.length;
    if (a == 0) {
        return false
    }
    if(t) {
        var sui = getSuiJi(1,a+1)
        console.log("sui",sui)
        return { data:parseTime(new Date,'{h}:{i}:{s}'),
               mc:sui
           }
    }
    // 随机数
    while (--a) {
      
        var b = Math.floor(Math.random() * (a + 1));
        var d = c[a];
        var e = c[b];
        c[a] = e;
        c[b] = d
    }
    
    return c
}
if(isTest){
    setTimeout(_=>{
       let suiji =  fisherYates(positions,1)
       console.log('suiji',suiji)
        toRunSortRank(suiji,1)
    },500*1)
}

//=========启动一个websocket
var Socket1;
Socket1 = $.websocket({
     domain:"206.237.30.35",   //这是与服务器的域名或IP
     port:9999,                  //这是服务器端口号
     protocol:"",            //这东西可有可无,组合起来就是 ws://www.qhnovel.com:8080/test
     onOpen:function(event){
        //  alert("已经与服务端握手,onOpen可省略不写");
         heartCheck.reset().start(); //传递心跳信息
     },
     onError:function(event){
        //  alert("发生了错误,onError可省略不写");
         reconnect();//断开重连
     },
     onSend:function(msg){
        //  alert("发送数据额外的代码,可省略不写");
          if(sen_flag == 2){
             //已经ping过去了
             console.log('ping');
         } else{
            console.log('msgmsg',msg);
          
             //用来处理正常的聊天室消息
         }
     },
     onMessage:function(result,nTime){
     //我这用result == 'pong'有个大大大的前提，就是ping给后台的时候，后台是直接推送pong回来给我的，所以我这里可以直接的判断result == 'pong'
     let res = JSON.parse(result)
         if(result == 'pong'){
             console.log('pong');
             //如果获取到消息，心跳检测重置 
             //拿到任何消息都说明当前连接是正常的 
             heartCheck.reset().start();
         }
         if(res.type=='pm'){
           
            console.log("pm msg socket",res)
            // if(isTest){
            //     setTimeout(_=>{
            //        let suiji =  fisherYates(positions,1)
            //        console.log('suiji',suiji)
            //         toRunSortRank(suiji,1)
            //     },1000*3)
            // }
                toRunSortRank(res.data)
           
           
            
           
         }else if(res.type=='time'){
            // 时间
            toRunSortRank( res,1)
            console.log("msg socket",res)
         }
        
        //  alert("从服务端收到的数据:" + result);
        //  alert("最近一次发送数据到现在接收一共使用时间:" + nTime);
     }
 });
//这个是我在具体项目中用来辨别心跳和正常消息的标志位
var sen_flag = 1;
//避免重复连接 
var lockReconnect = false;
// 重连函数
function reconnect(){
 console.log("websocket正在重新连接")
 if (lockReconnect) return; 
 lockReconnect = true; //没连接上会一直重连，设置延迟避免请求过多 
 setTimeout(function() { 
    Socket1.onInit();
     lockReconnect = false; 
 }, 5000);
}

//心跳检测
var heartCheck = {
 timeout: 60000, //60秒
 timeoutObj: null,
 serverTimeoutObj: null,
 reset: function() {
     clearTimeout(this.timeoutObj);
     clearTimeout(this.serverTimeoutObj);
     return this;
 },
 start: function() {
     var self = this;
     this.timeoutObj = setTimeout(function() {
         //这里发送一个心跳，后端收到后，返回一个心跳消息，
         //onmessage拿到返回的心跳就说明连接正常
         sen_flag = 2;
         Socket1.send("ping");
         sen_flag = 1;
         self.serverTimeoutObj = setTimeout(function() { //如果超过一定时间还没重置，说明后端主动断开了
             console.log('未收到pong，后端已断开');
             Socket1.close(); 
             //如果onclose会执行reconnect我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
         }, self.timeout)
     }, this.timeout)
 }
}
//当visibilityState流浪器的状态改变时，进行监听
document.addEventListener('visibilitychange',function() {
 if(document.visibilityState=='hidden') {
 //页面被隐藏或调到后台
                 
 }else{
 //页面还在时异常被关闭才进行重连
     console.log("Close回调函数，自动重连")
     reconnect();
 }
})