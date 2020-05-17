var data = {
  title: 'Maths',
  author: 'Nircek',
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
var main = document.getElementById('main');
if (main === null) {
  document.getElementsByClassName('question')[0].parentElement.id = 'main';
  var main = document.getElementById('main');
}
cmain = (x) =>
  ['p', 'img']
    .map((t) => main.getElementsByClassName(x)[0].getElementsByTagName(t))
    .map((t) => (t.length ? t[0] : null))
    .filter((t) => t !== null)[0];
var question_i = 0;
question_update = () => {
  cmain('question').innerHTML = data.questions[question_i].question;
};
question_update();
