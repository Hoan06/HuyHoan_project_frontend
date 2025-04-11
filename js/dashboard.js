const contentMain = document.querySelector("#content-main");
const btnPlayRandom = document.querySelector("#btn-play");
const btnSortPlayUp = document.querySelector("#play-up");
const btnSortPlayDown = document.querySelector("#play-down");
const logOut = document.querySelector("#logOut");
const testList = JSON.parse(localStorage.getItem("testList")) || [];

// Phần phân trang

const btnPagesElement = document.querySelector("#btnPages");
const btnBackElement = document.querySelector("#page-btn-back");
const btnNextElement = document.querySelector("#page-btn-next");

let currentPage = 1;
const totalPerpage = 4;

const checkLogin = JSON.parse(localStorage.getItem("checkLogin")) || 0;

if (checkLogin !== 1){
    window.location.href = "../pages/login.html";
}

const renderPages = () => {
    
    const totalPage = Math.ceil(testList.length/totalPerpage);

    btnPagesElement.textContent = "";

    for (let i=1;i<=totalPage;i++){
        const btnElement = document.createElement("button");

        btnElement.textContent = i;

        btnElement.classList.add("page-btn");

        if (currentPage === i){
            btnElement.classList.remove("page-btn");
            btnElement.classList.add("page-btn-1");
        }

        if (currentPage === 1){
            document.querySelector("#page-btn-back").setAttribute("disabled","disabled");
        } else {
            document.querySelector("#page-btn-back").removeAttribute("disabled");
        }

        if (currentPage === totalPage){
            document.querySelector("#page-btn-next").setAttribute("disabled","disabled");
        } else {
            document.querySelector("#page-btn-next").removeAttribute("disabled");
        }

        btnElement.addEventListener('click',function(){
            currentPage = i;

            renderPages();
            renderQuiz();
        });

        btnPagesElement.appendChild(btnElement);
    }
}

btnSortPlayUp.addEventListener('click',function () {
    testList.sort((a,b) => (a.playCount || 0) - (b.playCount || 0));
    currentPage = 1;
    renderPages();
    renderQuiz();
});

btnSortPlayDown.addEventListener('click',function () {
    testList.sort((a,b) => (b.playCount || 0) - (a.playCount || 0));
    currentPage = 1;
    renderPages();
    renderQuiz();
});

btnNextElement.addEventListener('click',function(){
    const totalPage = Math.ceil(testList.length / totalPerpage);
    if(currentPage < totalPage){
        currentPage++;

        renderPages();
        renderQuiz();
    }
});
btnBackElement.addEventListener('click',function(){
    const totalPage = Math.ceil(testList.length / totalPerpage);
    if(currentPage > 1){
        currentPage--;

        renderPages();
        renderQuiz();
    }
});

renderPages();

btnPlayRandom.addEventListener("click",function(){
    if (testList.length === 0){
        Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Không có bài test nào để vào!",
          });
        return;
    }

    const randomIndex = Math.floor(Math.random() * testList.length);

    if (!testList[randomIndex].playCount){
        testList[randomIndex].playCount = 0;
    }
    testList[randomIndex].playCount++;

    localStorage.setItem("testList",JSON.stringify(testList));

    window.location.href = `../pages/do-test.html?index=${randomIndex}`;
});

function renderQuiz() {

    const getStartIndex = (currentPage - 1) * totalPerpage;
    const getEndIndex = totalPerpage * currentPage;

    const testListSlice = testList.slice(getStartIndex,getEndIndex);

    contentMain.innerHTML = "";

    if (testList.length === 0) {
        contentMain.innerHTML = "<p>Không có dữ liệu để hiển thị.</p>";
        return;
    }

    testListSlice.forEach((test, index) => {
        // Cho mỗi bài test là 1 lượt chơi riêng và là 0
        if (!test.playCount) {
            test.playCount = 0;
        }

        const div = document.createElement("div");
        div.classList.add("quiz-card");
        div.innerHTML = `
            <img src="../assets/images/quizi-logo.png" alt="Quiz Image" />
            <div class="quiz-info">
                <p class="category">${test.category}</p>
                <p class="quiz-title">${test.name}</p>
                <p class="quiz-details">${test.questions.length} câu hỏi - ${test.playCount} lượt chơi</p>
            </div>
            <button class="btn-play-quiz">Chơi</button>
        `;
        contentMain.appendChild(div);

        const playButton = div.querySelector(".btn-play-quiz");
        const realIndex = getStartIndex + index;
        playButton.addEventListener("click", () => {
            test.playCount++; 
            localStorage.setItem("testList", JSON.stringify(testList)); 
            window.location.href = `../pages/do-test.html?index=${realIndex}`;
        });
    });
}

renderQuiz();

logOut.addEventListener("click",function(){
    localStorage.setItem("checkLogin",0);
});