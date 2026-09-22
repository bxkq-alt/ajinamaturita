const QUESTIONS = [
  {category:"Grammar",question:"Which sentence is grammatically correct?",answers:["She has lived here since five years.","She has lived here for five years.","She lives here since five years.","She is lived here for five years."],correct:1,explanation:"We use 'for' with a period of time: for five years."},
  {category:"Vocabulary",question:"What is the closest meaning of 'reliable'?",answers:["Funny","Expensive","Trustworthy","Dangerous"],correct:2,explanation:"'Reliable' means someone or something that can be trusted."},
  {category:"Grammar",question:"Complete the sentence: If I ___ more time, I would learn Spanish.",answers:["have","had","will have","am having"],correct:1,explanation:"The second conditional uses if + past simple and would + infinitive."},
  {category:"Tenses",question:"By the time we arrived, the film ___.",answers:["started","has started","had started","was starting"],correct:2,explanation:"Past perfect describes an action that happened before another past action."},
  {category:"Vocabulary",question:"What does 'environment' mean?",answers:["The natural world around us","A type of vehicle","A school subject only","A person's salary"],correct:0,explanation:"Environment refers to the surroundings, especially the natural world."},
  {category:"Grammar",question:"Choose the correct question.",answers:["How long are you living here?","How long you have lived here?","How long have you lived here?","How long did you lived here?"],correct:2,explanation:"'How long have you lived here?' correctly uses the present perfect."},
  {category:"Phrasal verbs",question:"What does 'give up' mean?",answers:["Continue","Quit or stop trying","Arrive","Wake up"],correct:1,explanation:"'Give up' means to stop trying or to quit."},
  {category:"Prepositions",question:"She is interested ___ learning languages.",answers:["on","at","in","for"],correct:2,explanation:"The fixed expression is 'interested in'."},
  {category:"Vocabulary",question:"Which word is an antonym of 'ancient'?",answers:["Modern","Historic","Old","Traditional"],correct:0,explanation:"'Modern' is the opposite of 'ancient'."},
  {category:"Grammar",question:"Choose the correct passive sentence: 'People speak English worldwide.'",answers:["English is spoken worldwide.","English speaks worldwide.","English was speak worldwide.","English is speaking worldwide."],correct:0,explanation:"Present simple passive uses am/is/are + past participle."},
  {category:"Conditionals",question:"If it rains tomorrow, we ___ at home.",answers:["stay","stayed","will stay","would stayed"],correct:2,explanation:"First conditional uses if + present simple and will + infinitive."},
  {category:"Vocabulary",question:"What is a 'deadline'?",answers:["A holiday","The latest time something must be completed","A type of examination","A meeting room"],correct:1,explanation:"A deadline is the final time or date by which something must be done."}
];

const TOTAL = 10;
let quizQuestions = [];
let current = 0;
let score = 0;
let answered = false;

const $ = id => document.getElementById(id);
const questionNumber = $("questionNumber");
const scoreEl = $("score");
const percentageEl = $("percentage");
const progress = $("progress");
const category = $("category");
const question = $("question");
const answers = $("answers");
const feedback = $("feedback");
const nextBtn = $("nextBtn");
const quizCard = $("quizCard");
const resultCard = $("resultCard");
const resultText = $("resultText");

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateStats() {
  questionNumber.textContent = `${Math.min(current + 1, TOTAL)} / ${TOTAL}`;
  scoreEl.textContent = score;
  const answeredCount = answered ? current + 1 : current;
  percentageEl.textContent = `${answeredCount ? Math.round(score / answeredCount * 100) : 0} %`;
}

function startQuiz() {
  quizQuestions = shuffle(QUESTIONS).slice(0, TOTAL);
  current = 0;
  score = 0;
  answered = false;
  quizCard.hidden = false;
  resultCard.hidden = true;
  showQuestion();
}

function showQuestion() {
  const q = quizQuestions[current];
  answered = false;
  category.textContent = q.category;
  question.textContent = q.question;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.disabled = true;
  nextBtn.textContent = current === TOTAL - 1 ? "Zobrazit výsledek" : "Další otázka";
  answers.innerHTML = "";

  q.answers.forEach((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.textContent = `${String.fromCharCode(65 + index)}. ${text}`;
    button.addEventListener("click", () => selectAnswer(index));
    answers.appendChild(button);
  });

  progress.style.width = `${current / TOTAL * 100}%`;
  updateStats();
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = quizQuestions[current];
  const buttons = [...answers.children];

  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === q.correct) button.classList.add("correct");
    if (i === index && i !== q.correct) button.classList.add("wrong");
  });

  if (index === q.correct) {
    score++;
    feedback.textContent = `✓ Správně! ${q.explanation}`;
    feedback.classList.add("correct");
  } else {
    feedback.textContent = `✗ Špatně. ${q.explanation}`;
    feedback.classList.add("wrong");
  }

  nextBtn.disabled = false;
  progress.style.width = `${(current + 1) / TOTAL * 100}%`;
  updateStats();
}

function nextQuestion() {
  if (!answered) return;
  if (current < TOTAL - 1) {
    current++;
    showQuestion();
  } else {
    const percent = Math.round(score / TOTAL * 100);
    resultText.textContent = `Získal/a jsi ${score} z ${TOTAL} bodů (${percent} %).`;
    quizCard.hidden = true;
    resultCard.hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("restartBtn").addEventListener("click", startQuiz);
  $("playAgainBtn").addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
  startQuiz();
});
