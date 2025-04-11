const overlayForm = document.querySelector("#overlay");
const btnAdd = document.querySelector("#btn-add");
const iconCloseForm = document.querySelector("#icon-close");
const iconCloseFix = document.querySelector("#icon-close-fix");
const btnCancelFix = document.querySelector("#btn-cancel-fix");
const btnCancelForm = document.querySelector("#btn-cancel");
const testList = JSON.parse(localStorage.getItem("testList")) || [];
const categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];

// Thêm câu hỏi và thêm bài test

const inputTestName = document.querySelector("#input-name-test");
const inputTestTime = document.querySelector("#input-time");
const tbody = document.querySelector("#tbody");
const btnSaveForm = document.querySelector("#btn-save-form");
const answersInputs = document.querySelectorAll(".input-answer-add");
const checkboxs = document.querySelectorAll(".checkbox input");
const inputQuestionAdd = document.querySelector(".input-question-add");
const btnSaveTest = document.querySelector("#btn-save");
const categorySelect = document.querySelector("#select-info");
const newQuestions = [];

let fixIndex = null; // Dùng để xem vị trí câu hỏi đang được click

// Phần modal cho nút sửa 
const inputQuestionAddFix = document.querySelector("#input-question-add-fix");
const btnSaveFormFix = document.querySelector("#btn-save-form-fix");
const overlayFormFix = document.querySelector("#overlay-fix");

// Lấy dữ liệu để sửa

const urlParams = new URLSearchParams(window.location.search);
const editIndex = urlParams.get('index'); // lấy giá trị index được truyền từ cửa sổ quản lí test

// Thêm option cho select về danh mục
const testCategorySelect = document.querySelector("#select-info");

/**
 * categoryList : danh sách các danh mục để hiển thị vào trong select 
 */
function renderCategoryDropdown() {
    testCategorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
    categoryList.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = `${category.emoji} ${category.name}`;
      testCategorySelect.appendChild(option);
    });
  }
  
  renderCategoryDropdown();

function renderQuestions() {
  tbody.innerHTML = "";
  newQuestions.forEach((question,index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="td-id">${index + 1}</td>
      <td class="td-question">${question.questions}</td>
      <td class="td-act">
        <button class="btn-fix" data-index="${index}">Sửa</button>
        <button class="btn-delete" data-index="${index}">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

renderQuestions();


// truyền vào type = "add" là để hiểu nó đang ở chế độ thêm còn nếu không là chế độ sửa trong js mặc định type sẽ trả về "add" nếu không truyền tham số type
function resetForm (type = "add"){
  if (type === "add") {
    const inputQuestionAdd = document.querySelector(".input-question-add");
    const answersInputs = document.querySelectorAll(".input-answer-add");
    const checkboxs = document.querySelectorAll(".checkbox input");
    inputQuestionAdd.value = "";
    answersInputs.forEach((input) => input.value = "");
    checkboxs.forEach((checkbox) => checkbox.checked = false);
} else {
    const inputQuestionAddFix = document.querySelector("#input-question-add-fix");
    const answersInputsFix = document.querySelectorAll(".input-answer-add-fix");
    const checkboxsFix = document.querySelectorAll(".checkbox-fix input");
    inputQuestionAddFix.value = "";
    answersInputsFix.forEach((input) => input.value = "");
    checkboxsFix.forEach((checkbox) => checkbox.checked = false);
}
};

function resetTestForm (){
  inputTestName.value = "";
  inputTestTime.value = "";
  categorySelect.value = "";
  newQuestions.length = 0;
  renderQuestions();  
};

// Hàm điền dữ liệu vào form sửa
function fillFormFix(index) {
  const question = newQuestions[index];
  inputQuestionAddFix.value = question.questions;
  const answersInputsFix = document.querySelectorAll(".input-answer-add-fix");
  const checkboxsFix = document.querySelectorAll(".checkbox-fix input");
  question.answers.forEach((answer,index) => {
    if (answersInputsFix[index]){
      answersInputsFix[index].value = answer.answer;
      checkboxsFix[index].checked = answer.correct;
    }
  });
}

if (editIndex !== null) {
  const test = testList[editIndex];
  inputTestName.value = test.name;
  inputTestTime.value = test.time;
  test.questions.forEach(question => {
      newQuestions.push(question);
  });
  renderCategoryDropdown(); // Gọi trước để tạo danh sách danh mục
  categorySelect.value = test.category; 
} else {
  renderCategoryDropdown();
}

renderQuestions();

btnSaveForm.addEventListener('click',function(e){
  e.preventDefault();

  const answersInputs = document.querySelectorAll(".input-answer-add");
  const checkboxs = document.querySelectorAll(".checkbox input");

  const answers = [];
  answersInputs.forEach((input,index) => {
    if (input.value.trim() !== ""){
      answers.push({
        answer : input.value,
        correct : checkboxs[index].checked
      });
    }
  });

  if (inputQuestionAdd.value.trim() === "") {
    Swal.fire({
      icon: "error",
        title: "Vui lòng nhập câu hỏi.",
  });
    return;
  }
  if (answers.length < 2) {
    Swal.fire({
      icon: "error",
        title: "Vui lòng nhập ít nhất 2 câu trả lời.",
  });
    return;
  }

  const checkTrueAnswer = answers.some(answer => answer.correct === true);
  if (checkTrueAnswer === false){
    Swal.fire({
      icon: "error",
        title: "Vui lòng chọn ít nhất 1 câu trả lời đúng.",
  });
    return;
  }

  if (checkAnswerOverlap(answers)){
      return;
  }

  const question = {
    questions : inputQuestionAdd.value,
    answers : answers
  };


  newQuestions.push(question);
  overlayForm.style.display = "none";
  resetForm();
  renderQuestions();
});

function checkAnswerOverlap (array){
  for (let i=0;i<array.length;i++){
    for (let j=i+1;j<array.length;j++){
      if (array[i].answer.trim() === array[j].answer.trim()){
        Swal.fire({
          icon: "error",
            title: "Đáp án không được trùng nhau.",
            text : "Vui lòng nhập lại câu trả lời.",
        });
        return true;
      }
    }
  }
}

btnSaveFormFix.addEventListener('click',function(e){
  e.preventDefault();
  const answersInputsFix = document.querySelectorAll(".input-answer-add-fix");
  const checkboxsFix = document.querySelectorAll(".checkbox-fix input");

  const answers = [];
  answersInputsFix.forEach((input,index) => {
    if (input.value.trim() !== ""){
      answers.push({
        answer : input.value,
        correct : checkboxsFix[index].checked
      });
    }
  });

  if (inputQuestionAddFix.value.trim() === "") {
    Swal.fire({
      icon: "error",
        title: "Vui lòng nhập câu hỏi.",
  });
    return;
  }
  if (answers.length === 0) {
    Swal.fire({
      icon: "error",
        title: "Vui lòng nhập ít nhất 1 câu trả lời.",
  });
    return;
  }

  if (checkAnswerOverlap(answers)){
    return;
  }

  const updatedQuestion = {
    questions: inputQuestionAddFix.value,
    answers: answers,
  };

  newQuestions[fixIndex] = updatedQuestion;
  overlayFormFix.style.display = "none";
  resetForm("fix");
  renderQuestions();
});

btnSaveTest.addEventListener('click',function(){
  const testName = inputTestName.value.trim();
  const testTime = inputTestTime.value.trim();
  const categoryName = categorySelect.value;

  if (testName === "" || testTime === "" ){
    Swal.fire({
      icon: "error",
        title: "Vui lòng nhập đầy đủ thông tin.",
  });
    return;
  }

  if (testTime < 1 || testTime >120 ){
    Swal.fire({
      icon: "error",
        title: "Thời gian không hợp lệ.",
        text : "Vui lòng nhập lại thời gian.",
  });
    return;
  }

  if (!categoryName){
    Swal.fire({
      icon: "error",
        title: "Danh mục không được để trống.",
        text : "Vui lòng chọn danh mục.",
  });
    return;
  }

  if (newQuestions.length === 0){
    Swal.fire({
      icon: "error",
        title: "Vui lòng nhập ít nhất 1 câu hỏi.",
  });
    return;
  }

  const checkTestName = testList.some(test => test.name === testName);
  if (checkTestName){
    Swal.fire({
      icon: "error",
        title: "Tên bài test đã tồn tại.",
        text : "Vui lòng nhập tên khác.",
  });
    return;
  }

// Kiểm tra để lấy cả emoji

const selectCategory = categoryList.find(category => category.name === categoryName);
const categoryWithEmoji = selectCategory ? `${selectCategory.emoji} ${selectCategory.name}` : categoryName;

//  mảng dùng để sao chép câu hỏi
  const questionsCopy = []; 
    newQuestions.forEach(question => {
        questionsCopy.push(question); // Sao chép từng câu hỏi
    });

  const newTest = {
    id : testList.length + 1,
    name : testName,
    category : categoryWithEmoji,
    time : testTime,
    questions: questionsCopy
  };

  if (editIndex !== null) {
    testList[editIndex] = newTest;
    localStorage.setItem("testList", JSON.stringify(testList));
    alert("Đã cập nhật bài test!");
    window.location.href = '../pages/test-manager.html';
    resetTestForm();
  } else {
    testList.push(newTest);
    localStorage.setItem("testList",JSON.stringify(testList));
    resetTestForm();
    Swal.fire({
      icon: "success",
      title: "Thêm bài test thành công",
      text: "Chúc mừng bạn đã thêm bài test thành công!",
  });
  }

});

btnAdd.addEventListener('click',function(){
    overlayForm.style.display = "flex";
});

iconCloseForm.addEventListener("click",function(){
    overlayForm.style.display = "none";
});

btnCancelForm.addEventListener("click",function(){
    overlayForm.style.display = "none";
});

iconCloseFix.addEventListener("click",function(){
  overlayFormFix.style.display = "none";
});

btnCancelFix.addEventListener("click",function(){
  event.preventDefault();
  overlayFormFix.style.display = "none";
});

tbody.addEventListener("click", function (e) {
  const index = e.target.getAttribute("data-index");

  if (e.target.classList.contains("btn-delete")) {
    Swal.fire({
      title: "Bạn có chắc muốn xóa câu hỏi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        newQuestions.splice(index, 1);
        renderQuestions();
        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Câu hỏi đã được xóa thành công.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  } else if (e.target.classList.contains("btn-fix")) {
    Swal.fire({
      title: "Bạn muốn sửa câu hỏi này?",
      text: "Bạn sẽ chỉnh sửa câu hỏi hiện tại.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sửa",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        fixIndex = index;
        fillFormFix(index);
        overlayFormFix.style.display = "flex";
      }
    });
  }
});

