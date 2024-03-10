var change_pairs = [];
var is_playing_make = false;
var global_list_make = [];

function heapify(lst, i, n) {
  var l = 2*i;
  var r = 2*i+1;

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

    change_pairs.push([i, largest]);

    // i sprawdź dzieci largest
    heapify(lst, largest, n);
  }
}

async function make_heap_show (make_time) {
  if (is_playing_make) return;

  var element_nr = 5 + Math.floor(Math.random() * 11);
  var element_list = [];

  var depth = Math.ceil(Math.log2(element_nr+1));
  for (let i = 1; i <= element_nr; i++) {
    element_list[i] = Math.floor(Math.random () * (90 - 5*(element_nr - i)));
  }

  var canvas_div = document.getElementById('kopiec-ex3-div');
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

  for (let i = 0; i < element_nr; i++) {
    global_list_make[i] = element_list[i];
  }

  for (let i = Math.floor(element_nr / 2); i > 0; i--) {
    change_pairs.push([i, i]);
    heapify(element_list, i, element_nr);
  }

  var slider_div = document.getElementById('kopiec-ex3-slider');
  slider_div.style.opacity = "1.0";

  slider_div.min = 0;
  slider_div.max = change_pairs.length;


  for (let i = change_pairs.length - 1; i >= 0; i--) {
    var prev = change_pairs[i][0];
    var next = change_pairs[i][1];
    var temp = element_list[prev];
    element_list[prev] = element_list[next];
    element_list[next] = temp;
  }

  is_playing_make = true;

  slider_div.value = 0;
  
  draw_heap(element_list, element_nr, 'kopiec-ex3', 'kopiec-ex3-div', 'kopiec-ex3-btn', pos_list_x, -1, Math.floor(element_nr/2));

  for (let i = 1; i < change_pairs.length; i++) {
    if (!is_playing_make) break;
    await sleep(3000);
    
    var prev = change_pairs[i][0];
    var next = change_pairs[i][1];
    var temp = element_list[prev];
    element_list[prev] = element_list[next];
    element_list[next] = temp;
  
    slider_div.value = i+1;

    draw_heap(element_list, element_nr, 'kopiec-ex3', 'kopiec-ex3-div', 'kopiec-ex3-btn', pos_list_x, next, prev);
  }

  is_playing_make = false;
}

function update_heap_make (val) {
  var canvas_div = document.getElementById('kopiec-ex3-div');
  var cnv_width = canvas_div.clientWidth;
  
  is_playing_make = false;

  var n = global_list_make.length;

  var local_list = [];

  for (let i = 0; i < n; i++) {
    local_list[i] = global_list_make[i];
  }

  for (let i = 0; i < val; i++) {
    var temp = local_list[change_pairs[i][0]];
    local_list[change_pairs[i][0]] = local_list[change_pairs[i][1]];
    local_list[change_pairs[i][1]] = temp;
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
    prev = change_pairs[val-1][0];
    now = change_pairs[val-1][1];
  }

  draw_heap(local_list, n-1, 'kopiec-ex3', 'kopiec-ex3-div', 'kopiec-ex3-btn', pos_list_x, prev, now);
}
