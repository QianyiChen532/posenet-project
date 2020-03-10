let btn= [];


  btn[0] = document.getElementById('btn1');
  btn[1] = document.getElementById('btn2');
  btn[2] = document.getElementById('btn3');
  btn[3] = document.getElementById('btn4');

let alink = [];

alink[0] = document.getElementById('a1');
alink[1] = document.getElementById('a2');
alink[2] = document.getElementById('a3');
alink[3] = document.getElementById('a4');



console.log(alink);
for(let i= 0;i<3;i++){
  alink[i].addEventListener('click',function(){setNum(i);},i);
}

function setNum(i){
  console.log(i);
  // let num = (i+1).copy();
  return i+1;
}
//
// export let num = setNum(i);
