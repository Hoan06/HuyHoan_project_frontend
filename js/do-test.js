const overlayForm = document.querySelector("#form-overlay");
const btnFinish = document.querySelector("#finish");
const iconCloseForm = document.querySelector("#icon-close");
const questionList = document.querySelector("#question-list");
const backHome = document.querySelector(".home");
const btnAgainDoTest = document.querySelector("#btn-again");
const btnHome = document.querySelector("#btn-home");
const btnBackQuestion = document.querySelector("#btn-back");
const btnNextQuestion = document.querySelector("#btn-next");
const testList = JSON.parse(localStorage.getItem("testList")) || [];

// Lấy index bài test từ trang chủ 
const urlParams = new URLSearchParams(window.location.search);
const testIndex = parseInt(urlParams.get("index"), 10);
// Lấy ra bài test hiện tại
const currentTest = testList[testIndex];

// Tạo 1 mảng để lưu đáp án người dùng chọn 
let userAnswers = [];

if (currentTest.questions && currentTest.questions.length > 0) {
    userAnswers = new Array(currentTest.questions.length);
    for (let i = 0; i < currentTest.questions.length; i++) {
        userAnswers[i] = -1; 
    }
} else {
    userAnswers = []; 
}


// Tạo 1 biến lưu câu hỏi hiện tại
let currentQuestionIndex = 0;

function renderBtn() {
    if (!currentTest || !currentTest.questions) {
        questionList.innerHTML = "<p>Không có câu hỏi nào để hiển thị.</p>";
        return;
    }

    questionList.innerHTML = "";
    currentTest.questions.forEach((question, index) => {
        const btn = document.createElement("button");
        btn.classList.add("question-btn");
        btn.textContent = index + 1; 
        btn.addEventListener("click", () => {
            currentQuestionIndex = index;
            showQuestion();
        });
        questionList.appendChild(btn);
    });
}

function showQuestion() {
    // Lấy các id liên quan đến câu hỏi và câu trả lời
    const questionElement = document.querySelector("#question");
    const answerArray = document.querySelectorAll("#answer");
    const infoQuestionElement = document.querySelector(".info-question");
    const titleTest = document.querySelector("#title-test");
    const timeDoTest = document.querySelector(".time-doTest");

    const currentQuestion = currentTest.questions[currentQuestionIndex];

    titleTest.textContent = `${currentTest.name}`;

    infoQuestionElement.textContent = `Câu hỏi ${currentQuestionIndex + 1} trên ${currentTest.questions.length} : `;

    questionElement.textContent = currentQuestion.questions;

    timeDoTest.textContent = `Thời gian : ${currentTest.time} phút`;

    answerArray.forEach((answerElement, index) => {
        const checkbox = answerElement.querySelector("input[type='radio']");
        const answerText = answerElement.querySelector("p");

        if (currentQuestion.answers && index < currentQuestion.answers.length) {
            const answerContent =  currentQuestion.answers[index].answer;
            answerText.textContent = answerContent;
            checkbox.checked = userAnswers[currentQuestionIndex] === index;
        }
    });

    if (currentQuestionIndex === 0){
        startTime();
    };

    checkAnswerHistory();
}

function startTime() {
    const timeRemaining = document.querySelector(".time-remaining");
    // Tạo 1 biến chuyển thời gian phút thành giây
    let totalTimeRemaining = currentTest.time * 60;
    
    const timeInterval = setInterval(function(){
        if (totalTimeRemaining <= 1){
            clearInterval(timeInterval);
            // Hiển thị luôn kết quả 
            overlayForm.style.display = "flex";

            let correctCount = 0;
            const totalQuestion = currentTest.questions.length;
            currentTest.questions.forEach((question,index) => {
                const userAnswer = userAnswers[index];
                const correctAnswer = question.correct;

                if (userAnswer !== -1 && userAnswer === correctAnswer){
                    correctCount++;
                }
            });

            const failCount = totalQuestion - correctCount;
            const score = (correctCount / totalQuestion) * 100;

            const resultScore = document.querySelector(".point");
            resultScore.textContent = `Điểm của bạn là : ${score}%`;
            const numberQuestion = document.querySelector(".number-question");
            numberQuestion.textContent = `${totalQuestion}`;
            const numberTrueAnswer = document.querySelector(".number-true-answer");
            numberTrueAnswer.textContent = `${correctCount}`;
            const numberFalseAnswer = document.querySelector(".number-false-answer");
            numberFalseAnswer.textContent = `${failCount}`;
            
        }
        // Tính giây
        totalTimeRemaining--; 
        const minutes = Math.floor(totalTimeRemaining / 60);
        const seconds = totalTimeRemaining % 60;
        timeRemaining.textContent = `Thời gian còn lại: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        return;
    }, 1000);
}

function checkAnswerHistory() {
    const answerElements = document.querySelectorAll("#answer");
    answerElements.forEach((answer, index) => {
        const radio = answer.querySelector("input[type='radio']");
        if (radio) {
            radio.addEventListener("change", function () {
                userAnswers[currentQuestionIndex] = index;
            });
        }
    });
}

btnBackQuestion.addEventListener("click",function(){
    if (currentQuestionIndex >= 1){
        currentQuestionIndex--;
    }
    showQuestion();
});
btnNextQuestion.addEventListener("click",function(){
    if (currentQuestionIndex < currentTest.questions.length - 1){
        currentQuestionIndex++;
    }
    showQuestion();
});

showQuestion();

renderBtn();

btnFinish.addEventListener('click',function(){
    overlayForm.style.display = "flex";

    // Biến tính điểm cho câu đúng
    let correctCount = 0;
    const totalQuestion = currentTest.questions.length;
    currentTest.questions.forEach((question,index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = question.answers.findIndex(answer => answer.correct === true);

        if (userAnswer !== -1 && userAnswer === correctAnswer){
            correctCount++;
        }
    });

    const failCount = totalQuestion - correctCount;
    const score = (correctCount / totalQuestion) * 100;

    const resultScore = document.querySelector(".point");
    resultScore.textContent = `Điểm của bạn là : ${score}%`;
    const numberQuestion = document.querySelector(".number-question");
    numberQuestion.textContent = `${totalQuestion}`;
    const numberTrueAnswer = document.querySelector(".number-true-answer");
    numberTrueAnswer.textContent = `${correctCount}`;
    const numberFalseAnswer = document.querySelector(".number-false-answer");
    numberFalseAnswer.textContent = `${failCount}`;

});

iconCloseForm.addEventListener("click",function(){
    overlayForm.style.display = "none";
    window.location.href = "../pages/dashboard.html";
});

btnHome.addEventListener('click',function () {
    event.preventDefault();
    window.location.href = "../pages/dashboard.html";
});

btnAgainDoTest.addEventListener("click", function() {
    event.preventDefault();
    window.location.href = `do-test.html?index=${testIndex}`;
});