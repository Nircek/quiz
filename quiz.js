'use strict';
var data;
var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    data = JSON.parse(this.responseText);
    init();
  }
};
xmlhttp.onerror = () =>
  alert('There was a problem with retrieving file with questions...');
xmlhttp.open('GET', './questions.json', true);
xmlhttp.send();

function permute(permutation) {
  // https://stackoverflow.com/a/37580979/6732111
  var length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1,
    k,
    p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

var format = (str, r = data) =>
  str.replace(/{\w+}/g, function (all) {
    let x = r[all.slice(1, -1)];
    if (typeof x == 'number') x = x.toString();
    return x || all;
  });

var main = document.getElementById('main');
var welcome = document.getElementById('welcome');

var cmain = (x, i = true, glob = main) =>
  i
    ? [...glob.getElementsByClassName(x)].map(
        (y) =>
          ['p', 'img']
            .map((t) => y.getElementsByTagName(t))
            .map((t) => (t.length ? t[0] : null))
            .filter((t) => t !== null)[0]
      )
    : [...glob.getElementsByClassName(x)];

var points_update = () => {
  for (let e of data.points_str_list)
    if (RegExp(e.split('-->')[0]).test(data.points_i.toString()))
      data.points_str = e.split('-->')[1];
  cmain('points')[0].innerHTML = format(data.points);
};
var question_update = (end = false) => {
  cmain('counter')[0].innerHTML = format(data.counter);
  points_update();
  let q = data.questions[data.question_i - 1];
  cmain('question')[0].innerHTML = format(q.question);
  let n = Math.min(cmain('answer').length, q.answers.length);
  let perms = permute([...Array(n).keys()]);
  perms = perms[(Math.random() * perms.length) | 0];
  if (!end)
    for (let i = 0; i < n; ++i) {
      let e = cmain('answer')[perms[i]];
      e.innerHTML = format(q.answers[i]);
      let seven = 7 * (((1 << 28) * Math.random() - 7) | 0);
      e.parentElement.setAttribute(
        'c',
        i ? seven : (seven + 1 + Math.random() * 6) | 0
      );
    }
  if (q.img) {
    cmain('pic', false)[0].parentElement.classList.remove('noimg');
    cmain('pic', false)[0].classList.remove('noimg');
    cmain('pic')[0].src = format(q.img);
  } else {
    cmain('pic', false)[0].parentElement.classList.add('noimg');
    cmain('pic', false)[0].classList.add('noimg');
  }
  cmain('footer')[0].innerHTML = data.author;
  // console.log(cmain('answer', 0).map((x) => x.getAttribute('c')%7));
};

var question_unlock = () =>
  cmain('answer', 0).map((x) => x.setAttribute('onclick', 'select(this)'));
var question_lock = () =>
  cmain('answer', 0).map((x) => x.removeAttribute('onclick'));

var timer_update = () => {
  let s = '';
  let t = Date.now() / 1000 - start;
  s += ('0' + ((t / 60) | 0)).slice(-2);
  s += ':';
  s += ('0' + (t % 60 | 0)).slice(-2);
  cmain('timer')[0].innerText = s;
  return s;
};

var select = (e) => {
  question_lock();
  let next = main.cloneNode(1);
  if (e.getAttribute('c') % 7) ++data.points_i;
  points_update();
  cmain('answer', 0).map((x) => {
    x.classList.remove('hovered');
    if (!(x.getAttribute('c') % 7)) {
      x.classList.add('incorrect');
      x.classList.remove('aa', 'ab', 'ac', 'ad');
    }
  });
  let end = ++data.question_i == data.questions.length + 1;
  if (end) {
    --data.question_i;
    clearInterval(timer);
    data.timer = timer_update();
    question_update(1);
    data.question_i = 1;

    welcome.id = 'welcome';
    points_update();
    cmain('title', 1, welcome)[0].innerHTML = format(data.title);
    cmain('welcome', 1, welcome)[0].innerHTML = format(data.end);
    cmain('play', 1, welcome)[0].innerHTML = format(data.try_again);
  }

  next.id = 'next';
  if (end) main.parentElement.append(welcome);
  main.parentElement.append(next);
  let prev = main;
  main = next;
  question_update();
  setTimeout(() => {
    prev.id = 'prev';
    main.id = 'main';
    setTimeout(() => {
      question_unlock();
      main.parentElement.removeChild(prev);
    }, 2000);
  }, 2000);
};

var start, timer;

var reset = () => {
  welcome.id = 'prev';
  data.points_i = 0;
  question_update();
  question_unlock();
  start = Date.now() / 1000;
  timer = setInterval(timer_update, 1000);
  setTimeout(() => {
    question_unlock();
    welcome.parentElement.removeChild(welcome);
  }, 2000);
};

var init = () => {
  data.question_i = 1;
  data.points_i = 0;
  data.length = data.questions.length;

  cmain('title', 1, welcome)[0].innerHTML = format(data.title);
  cmain('welcome', 1, welcome)[0].innerHTML = format(data.welcome);
  cmain('play', 1, welcome)[0].innerHTML = format(data.play);

  question_update();
};
