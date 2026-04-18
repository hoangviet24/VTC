let body = document.querySelector(".box");
document.querySelector("#red").addEventListener("click",function(){
    body.style.backgroundColor = "red";
});
document.querySelector("#green").addEventListener("click",function(){
    body.style.backgroundColor = "green";
});
document.querySelector("#blue").addEventListener("click",function(){
    body.style.backgroundColor = "blue";
});
function blink(){
    let box = document.querySelector(".box");
    if(box.style.visibility === "hidden"){
        box.style.visibility = "visible";
    }
    else{
        box.style.visibility = "hidden";
    }
}
window.setInterval(blink, 1200);