window.addEventListener("load",(e)=>{
    smartDeviceDirection();
},false);


window.addEventListener("orientationchange",(e)=>{
    smartDeviceDirection();
},false);

smartDeviceDirection = ()=>{
    let body = document.getElementsByTagName("body")[0];

    if(window.orientation === 0){
        console.log("tate");
        body.style.backgroundColor = "red";
    }else if(window.orientation === 90){
        console.log("yoko");
        body.style.backgroundColor = "blue";
    }else if(window.orientation === 180){
        console.log("tate");
        body.style.backgroundColor = "white";
    }else if(window.orientation === -90){
        console.log("yoko");
        body.style.backgroundColor = "green";
    }
}