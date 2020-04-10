//地址组装
var API_BASE_URL = window.location.href;//
var path = API_BASE_URL +"/";

var button = document.querySelector('.submit');
button.addEventListener('click',function () {
    let img = convertCanvasToImage();
    if(img){
        var xmlhttp;
        let data={};
        data.img = img.src;
        data = JSON.stringify(data);
        if (window.XMLHttpRequest)
        {//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// IE6, IE5 浏览器执行代码
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("POST",path,true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send(data);
        confirm('数据已提交');
    }else {
    confirm('提交的数据不能为空');
    }
})
