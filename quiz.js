'use strict';
var data = {
  title: 'Maths - question',
  author: 'Nircek',
  points: 'points',
  questions: [
    {
      question: '2+2=?',
      img: null,
      answers: ['4', '3', '5', '2'],
    },
    {
      question: '2*2=?',
      img: 'https://images.pexels.com/photos/374918/pexels-photo-374918.jpeg',
      answers: ['4', '16', '7', '6'],
    },
    {
      question: '2*2=?',
      img: 'https://images.pexels.com/photos/374918/pexels-photo-374918.jpeg',
      answers: ['4', '16', '7', '6'],
    },
    {
      question: '2*2=?',
      img: 'https://images.pexels.com/photos/374918/pexels-photo-374918.jpeg',
      answers: ['4', '16', '7', '6'],
    },
  ],
};

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

var main = document.getElementById('main');
if (main === null) {
  document.getElementsByClassName('question')[0].parentElement.id = 'main';
  var main = document.getElementById('main');
}
var cmain = (x, i = true) =>
  i
    ? [...main.getElementsByClassName(x)].map(
        (y) =>
          ['p', 'img']
            .map((t) => y.getElementsByTagName(t))
            .map((t) => (t.length ? t[0] : null))
            .filter((t) => t !== null)[0]
      )
    : [...main.getElementsByClassName(x)];
var question_i = 0;
var points = 0;
cmain('footer')[0].innerHTML = data.author;
var question_update = (end = false) => {
  cmain('counter')[0].innerHTML =
    data.title + ' ' + (question_i + 1) + '/' + data.questions.length;
  cmain('points')[0].innerHTML = points + ' ' + data.points;
  let q = data.questions[question_i];
  cmain('question')[0].innerHTML = q.question;
  let n = Math.min(cmain('answer').length, q.answers.length);
  let perms = permute([...Array(n).keys()]);
  perms = perms[(Math.random() * perms.length) | 0];
  if (!end)
    for (let i = 0; i < n; ++i) {
      let e = cmain('answer')[perms[i]];
      e.innerHTML = q.answers[i];
      let seven = 7 * (((1 << 28) * Math.random() - 7) | 0);
      e.parentElement.setAttribute(
        'c',
        i ? seven : (seven + 1 + Math.random() * 6) | 0
      );
    }
  if (q.img) {
    cmain('question', false)[0].classList.remove('noimg');
    cmain('pic', false)[0].classList.remove('noimg');
    cmain('pic')[0].src = q.img;
  } else {
    cmain('question', false)[0].classList.add('noimg');
    cmain('pic', false)[0].classList.add('noimg');
  }
  // console.log(cmain('answer', 0).map((x) => x.getAttribute('c')%7));
};
var question_unlock = () =>
  cmain('answer', 0).map((x) => x.setAttribute('onclick', 'select(this)'));
var question_lock = () =>
  cmain('answer', 0).map((x) => x.removeAttribute('onclick'));
question_update();
var start = Date.now() / 1000;
var timer_update = () => {
  let s = '';
  let t = Date.now() / 1000 - start;
  s += ('0' + ((t / 60) | 0)).slice(-2);
  s += ':';
  s += ('0' + (t % 60 | 0)).slice(-2);
  cmain('timer')[0].innerText = s;
};
var timer = setInterval(timer_update, 1000);
cmain('timer');
var select = (e) => {
  question_lock();
  if (e.getAttribute('c') % 7) ++points;
  if (++question_i == data.questions.length) {
    --question_i;
    clearInterval(timer);
    question_update(1);
  } else {
    let next = main.cloneNode(1);
    next.id = 'next';
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
    }, 100);
  }
};
question_unlock();
