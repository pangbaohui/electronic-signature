var windowW = document.body.clientWidth;
var canvasWidth;
canvasWidth = windowW*0.9;
 if(windowW >760){
    canvasWidth = windowW*0.6;
}
var canvasHeight = 400;

var isMouseDown = false;
var lastLoc = {x:0,y:0};
var lastTimestamp = 0;
var lastLineWidth = -1;
var strokeColor = 'black';

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// drawWrap();
//PC相关操作
canvas.onmousedown = function (e) {
    e.preventDefault();
    beginStroke({x:e.clientX,y:e.clientY})
};
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke()
};
canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke()
};
canvas.onmousemove = function (e) {
    e.preventDefault();
    if(isMouseDown){
        moveStroke({x:e.clientX,y:e.clientY})
    }
};
//手机触控操作
canvas.addEventListener('touchstart',function (e) {
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({x:touch.pageX,y:touch.pageY})
})
canvas.addEventListener('touchmove',function (e) {
    e.preventDefault();
    touch = e.touches[0];
    if(isMouseDown){
        moveStroke({x:touch.pageX,y:touch.pageY})
    }
})
canvas.addEventListener('touchend',function (e) {
    e.preventDefault();
    endStroke()
})
//根据速度决定笔画的大小
function calcLineWidth(t, s, maxLw, minLw) {
    let v = parseInt(s)/parseInt(t);
    let resultLineWidth;
    if (v<=0.1) resultLineWidth = maxLw;
    else if (v>=10) resultLineWidth = 1;
    else resultLineWidth = maxLw - (v-0.1)/(10-0.1)*(maxLw-1);
    if (lastLineWidth === -1)return resultLineWidth;
    return lastLineWidth*2/3 + resultLineWidth/3
}
//计算两点的距离
function calcDistance( loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x)+(loc1.y - loc2.y)*(loc1.y - loc2.y))
}
// canvas包围盒
function windowToCanvas(x,y) {
    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x-bbox.left), y:Math.round(y-bbox.top)}
}
// 绘制边框 假如需要canvas判空则不需要
function drawWrap(){
    context.save();
    context.strokeStyle = "rgb(117,117,117)";
    context.beginPath();
    context.moveTo(3,3);
    context.lineTo(canvasWidth - 3 , 3);
    context.lineTo( canvasWidth - 3 , canvasHeight -3);
    context.lineTo(3 , canvasHeight - 3);
    context.closePath();

    context.lineWidth = 1;
    context.stroke();
    context.restore()
}
//清除
var clear_btn = document.querySelector('.canvasClear');
clear_btn.addEventListener('click',function (e) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    // drawWrap()
});
//选颜色
var color1 = document.querySelector('#color1');
var color2 = document.querySelector('#color2');
var color3 = document.querySelector('#color3');
var color4 = document.querySelector('#color4');
var color5 = document.querySelector('#color5');
var color6 = document.querySelector('#color6');

color1.addEventListener('click',function () {strokeColor = 'black'});
color2.addEventListener('click',function () {strokeColor = '#da0600'});
color3.addEventListener('click',function () {strokeColor = '#fe6d32'});
color4.addEventListener('click',function () {strokeColor = '#fedc4d'});
color5.addEventListener('click',function () {strokeColor = '#74d106'});
color6.addEventListener('click',function () {strokeColor = '#2d8cf0'});

//绘制开始
function beginStroke(point) {
    isMouseDown = true;
    lastLoc = windowToCanvas(point.x,point.y);
    lastTimestamp = new Date().getTime();
}
//绘制结束
function endStroke() {
    isMouseDown = false;
}
//正在绘制
function moveStroke(point) {
    let curLoc = windowToCanvas(point.x,point.y);
    let s = calcDistance(curLoc, lastLoc);
    let curTimestamp = new Date().getTime();
    let t = curTimestamp - lastTimestamp;
    let lineWidth = calcLineWidth(t,s,10,1);

    context.beginPath();
    context.moveTo( lastLoc.x, lastLoc.y);
    context.lineTo( curLoc.x, curLoc.y);

    context.strokeStyle = strokeColor;
    context.stroke();
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    lastLoc = curLoc;
    lastTimestamp = curTimestamp;
}
function convertCanvasToImage() {
    c=document.getElementById("canvas");
    if(isCanvasBlank(c)){
        alert('绘图为空');
        return false;
    }else {
        let image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    }

}
//验证canvas画布是否为空函数
function isCanvasBlank(canvas) {
    let blank = document.createElement('canvas');//系统获取一个空canvas对象
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() == blank.toDataURL();//比较值相等则为空
}
