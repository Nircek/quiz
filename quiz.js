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
cmain = (x, i = true) =>
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
question_update = () => {
  cmain('counter')[0].innerHTML =
    data.title + ' ' + (question_i + 1) + '/' + data.questions.length;
  cmain('points')[0].innerHTML = points + ' ' + data.points;
  let q = data.questions[question_i];
  cmain('question')[0].innerHTML = q.question;
  n = Math.min(cmain('answer').length, q.answers.length);
  let perms = permute([...Array(n).keys()]);
  perms = perms[(Math.random() * perms.length) | 0];
  for (i = 0; i < n; ++i) {
    let e = cmain('answer')[perms[i]];
    e.innerHTML = q.answers[i];
    let seven = 7 * (((1 << 28) * Math.random() - 7) | 0);
    e.setAttribute('c', i == 0 ? seven : (seven + 1 + Math.random() * 6) | 0);
  }
  if (q.img) {
    cmain('question', false)[0].classList.remove('noimg');
    cmain('pic', false)[0].classList.remove('noimg');
    cmain('pic')[0].src = q.img;
  } else {
    cmain('question', false)[0].classList.add('noimg');
    cmain('pic', false)[0].classList.add('noimg');
  }
  // console.log(cmain('answer').map((x) => x.getAttribute('c')%7));
};
question_update();
var start = Date.now() / 1000;
timer_update = () => {
  let s = '';
  let t = Date.now() / 1000 - start;
  s += ('0' + ((t / 60) | 0)).slice(-2);
  s += ':';
  s += ('0' + (t % 60 | 0)).slice(-2);
  cmain('timer')[0].innerText = s;
  console.log(s);
};
var timer = setInterval(timer_update, 1000);
cmain('timer');
