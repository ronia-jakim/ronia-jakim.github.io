
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function draw_heap(lst, n, cnv_id, div_id, btn_id, pos_list_x, emph1, emph2) {
  var depth = Math.ceil(Math.log2(n+1));
  var canvas = document.getElementById(cnv_id);
  var canvas_div = document.getElementById(div_id);
  var canvas_btn = document.getElementById(btn_id);

  var cnv_width = canvas_div.clientWidth;
  var cnv_height = canvas_div.clientHeight - canvas_btn.clientHeight - 64;

  canvas.width = cnv_width;
  canvas.height = depth*60 + 10;

  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, cnv_height, cnv_width);

  var line_height = 0;
  
  for (let i = 1; i <= n/2; i++) {
    if (i == 2**(line_height+1)) line_height = line_height+1;
    ctx.beginPath();
    if(2*i <= n) ctx.moveTo(pos_list_x[2*i], 18+(line_height+1) * 60);
    ctx.lineTo(pos_list_x[i], 18+line_height*60);
    if(2*i+1 <= n) ctx.lineTo(pos_list_x[2*i + 1], 18+(line_height+1)*60);
    ctx.strokeStyle = "#D3C6AA";
    ctx.stroke();
  }

  line_height = 0;

  ctx.beginPath();

  for (let i = 1; i <= n; i++){
    if (i == 2**(line_height+1)) line_height = line_height+1;
    ctx.beginPath();
    ctx.arc(pos_list_x[i], 18 + line_height * 60, 15, 0, 2*Math.PI);
    if (i != emph1 && i != emph2) ctx.fillStyle = "#DBBC7F";
    else if (i != emph2) ctx.fillStyle = "#A7C080";
    else ctx.fillStyle = "#E69875";
    ctx.fill();

    ctx.font = "bold 13px Comfortaa";
    ctx.fillStyle = "black";
    ctx.textAlign="center";
    ctx.fillText(lst[i].toString(), pos_list_x[i], 22 + line_height * 60, 15);
  }

}

var is_playing = false;
var swapped_pairs = [];

var global_list = [];

async function hh_show(j, wait_time, element_list, element_nr, pos_list_x){
  //draw_heap(element_list, element_nr, 'kopiec-ex2', 'kopiec-ex2-div', 'kopiec-ex2-btn', pos_list_x, j);

  l = 2*j;
  r = 2*j+1;

  var largest = j;

  if (l <= element_nr && element_list[l] > element_list[j]) {
    largest = l;
  }

  if (r <= element_nr && element_list[r] > element_list[largest]) {
    largest = r;
  }

  if (largest != j) {
    // jeśli i nie jest największe - zamień
    var temp = element_list[j];
    element_list[j] = element_list[largest];
    element_list[largest] = temp;

    swapped_pairs.push([j, largest]);
    hh_show(largest, wait_time, element_list, element_nr, pos_list_x);
  }
}

async function heapify_showcase(j, wait_time) {
  if (is_playing) return;
  swapped_pairs = [];
  global_list = [];
  var element_nr = 3 + Math.floor(Math.random() * 10);
  
  var element_list = [];

  var depth = Math.ceil(Math.log2(element_nr+1));
  
  for (let i = 1; i <= element_nr; i++) {
    element_list[i] = Math.floor(Math.random () * (90 - 5*(element_nr-i)));
  }

  if (element_list[1] > element_list[2]) element_list[1] = element_list[2]-1;

  for (let i = 0; i <= element_nr; i++) {
    global_list[i] = element_list[i];
  }

  var slider_div = document.getElementById('kopiec-ex2-slider');
  slider_div.style.opacity = "1.0";

  var canvas_div = document.getElementById('kopiec-ex2-div');
  var cnv_width = canvas_div.clientWidth;

  var pos_list_x = [
    0,
    cnv_width/2,

    (cnv_width/2)-80, 
    (cnv_width/2)+80,

    (cnv_width/2)-80-40,
    (cnv_width/2)-80+40,

    (cnv_width/2)+80-40,
    (cnv_width/2)+80+40,

    (cnv_width/2)-160,
    (cnv_width/2)-120,
    (cnv_width/2)-80,
    (cnv_width/2)-40,

    (cnv_width/2)+40,
    (cnv_width/2)+80,
    (cnv_width/2)+120,
    (cnv_width/2)+160
  ];

  hh_show(j, wait_time, element_list, element_nr, pos_list_x); 
  
  slider_div.min=0;
  slider_div.max=swapped_pairs.length;

  for (let i = swapped_pairs.length - 1; i >= 0; i--) {
    var temp = element_list[swapped_pairs[i][0]];
    element_list[swapped_pairs[i][0]] = element_list[swapped_pairs[i][1]];
    element_list[swapped_pairs[i][1]] = temp;
  }

  is_playing = true;
  slider_div.value = 0;

  draw_heap(element_list, element_nr, 'kopiec-ex2', 'kopiec-ex2-div', 'kopiec-ex2-btn', pos_list_x, -1, swapped_pairs[0][0]);

  for(let i = 0; i < swapped_pairs.length; i++) {
    if (!is_playing) break;
    await sleep(3000);
    if (!is_playing) break;

    var temp = element_list[swapped_pairs[i][0]];
    element_list[swapped_pairs[i][0]] = element_list[swapped_pairs[i][1]];
    element_list[swapped_pairs[i][1]] = temp;
    
    draw_heap(element_list, element_nr, 'kopiec-ex2', 'kopiec-ex2-div', 'kopiec-ex2-btn', pos_list_x, swapped_pairs[i][0], swapped_pairs[i][1]);
    
    slider_div.value = i+1;
  }

  is_playing = false;
}

function update_heapify(val) {
  var canvas_div = document.getElementById('kopiec-ex2-div');
  var cnv_width = canvas_div.clientWidth;
  
  is_playing = false;

  var n = global_list.length;

  var local_list = [];

  for (let i = 0; i < n; i++) {
    local_list[i] = global_list[i];
  }

  for (let i = 0; i < val; i++) {
    var temp = local_list[swapped_pairs[i][0]];
    local_list[swapped_pairs[i][0]] = local_list[swapped_pairs[i][1]];
    local_list[swapped_pairs[i][1]] = temp;
  }
  
  var pos_list_x = [
    0,
    cnv_width/2,

    (cnv_width/2)-80, 
    (cnv_width/2)+80,

    (cnv_width/2)-80-40,
    (cnv_width/2)-80+40,

    (cnv_width/2)+80-40,
    (cnv_width/2)+80+40,

    (cnv_width/2)-160,
    (cnv_width/2)-120,
    (cnv_width/2)-80,
    (cnv_width/2)-40,

    (cnv_width/2)+40,
    (cnv_width/2)+80,
    (cnv_width/2)+120,
    (cnv_width/2)+160
  ];

  var prev = -1;
  var now = 1;
  if (val != 0) {
    prev = swapped_pairs[val-1][0];
    now = swapped_pairs[val-1][1];
  }

  draw_heap(local_list, n-1, 'kopiec-ex2', 'kopiec-ex2-div', 'kopiec-ex2-btn', pos_list_x, prev, now);
}

function heapify(lst, i, n) {
  l = 2*i;
  r = 2*i+1;

  var largest = i;

  if (l <= n && lst[l] > lst[i]) {
    largest = l;
  }

  if (r <= n && lst[r] > lst[largest]) {
    largest = r;
  }

  if (largest != i) {
    // jeśli i nie jest największe - zamień
    var temp = lst[i];
    lst[i] = lst[largest];
    lst[largest] = temp;

    // i sprawdź dzieci largest
    heapify(lst, largest, n);
  }
}

function draw() {
  var element_nr = 3 + Math.floor(Math.random() * 10);
  
  var element_list = [];

  var depth = Math.ceil(Math.log2(element_nr+1));
  
  for (let i = 1; i <= element_nr; i++) {
    element_list[i] = Math.floor(Math.random () * 90);
  }

  var canvas_div = document.getElementById('kopiec-ex1-div');
  var cnv_width = canvas_div.clientWidth;

  var pos_list_x = [
    0,
    cnv_width/2,

    (cnv_width/2)-80, 
    (cnv_width/2)+80,

    (cnv_width/2)-80-40,
    (cnv_width/2)-80+40,

    (cnv_width/2)+80-40,
    (cnv_width/2)+80+40,

    (cnv_width/2)-160,
    (cnv_width/2)-120,
    (cnv_width/2)-80,
    (cnv_width/2)-40,

    (cnv_width/2)+40,
    (cnv_width/2)+80,
    (cnv_width/2)+120,
    (cnv_width/2)+160
  ];

  for (let i = Math.floor(element_nr / 2); i >= 1; i--) {
    heapify(element_list, i, element_nr);
  }

  draw_heap(element_list, element_nr, 'kopiec-ex1', 'kopiec-ex1-div', 'kopiec-ex1-btn', pos_list_x, -1, -1);
}
