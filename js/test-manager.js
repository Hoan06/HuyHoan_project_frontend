const overlayForm = document.querySelector("#overlay");
const btnDeleteForm = document.querySelector(".btn-delete-form");
const btnDeleteCategory = document.querySelectorAll(".btn-delete");
const iconCloseForm = document.querySelector("#icon-close");
const btnCancelForm = document.querySelector("#btn-cancel");
const btnAddTest = document.querySelector("#btn-add");
const tbody = document.querySelector("#tbody");
const testList = JSON.parse(localStorage.getItem("testList")) || [];

const btnPagesElement = document.querySelector("#btnPages");
const btnBackElement = document.querySelector("#page-btn-back");
const btnNextElement = document.querySelector("#page-btn-next");

// Gọi ra cái select để sắp xếp
const selectSort = document.querySelector(".select-sort");

// Gọi phần tìm kiếm tên 
const inputSearch = document.querySelector("#input-search");
// Sao chép toàn bộ dữ liệu testList sang
let filterTestList = testList.slice();

let deleteIndex = null; // Vị trí bài test cần xóa

let currentPage = 1;
const totalPerpage = 3;

document.addEventListener('DOMContentLoaded',function(){
    const logOut = document.querySelector("#logOut");
    const checkLogin = JSON.parse(localStorage.getItem("checkLogin")) || 0;

    if (checkLogin !== 1 && checkLogin !== 2){
        window.location.href = "../pages/login.html";
    }

    const testLink = document.querySelector("#pageTest");
    testLink.classList.add("active");
});


// Hàm render các nút 
const renderPages = () => {
    
    const totalPage = Math.ceil(filterTestList.length/totalPerpage);

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
            renderTest();
        });

        btnPagesElement.appendChild(btnElement);
    }
}

btnNextElement.addEventListener('click',function(){
    const totalPage = Math.ceil(filterTestList.length / totalPerpage);
    if(currentPage < totalPage){
        currentPage++;

        renderPages();
        renderTest();
    }
});
btnBackElement.addEventListener('click',function(){
    const totalPage = Math.ceil(filterTestList.length / totalPerpage);
    if(currentPage > 1){
        currentPage--;

        renderPages();
        renderTest();
    }
});

renderPages();

btnDeleteCategory.forEach(button => {
    button.addEventListener('click', function() {
        overlayForm.style.display = "flex";
    });
}); 

function renderTest (){
    
    const getStartIndex = (currentPage - 1) * totalPerpage;
    const getEndIndex = totalPerpage * currentPage;

    const testListSlice = filterTestList.slice(getStartIndex,getEndIndex);

    tbody.innerHTML = "";
    testListSlice.forEach((test,index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="td-id">${index + 1}</td>
            <td class="td-name">${test.name}</td>
            <td class="td-category">${test.category}</td>
            <td class="td-question">${test.questions.length}</td>
            <td class="td-time">${test.time} min</td>
            <td class="td-act">
                <button class="btn-fix" data-index="${index}">Sửa</button>
                <button class="btn-delete" data-index="${index}">Xóa</button>
            </td>

        `;
        tbody.appendChild(tr);
    });
};

// Truyền vào sortType là để kiểm tra cái value ng dùng chọn là gì 
function sortTestList(sortType) {
    if (sortType === "sortName") {
        filterTestList.sort((a, b) => a.name.localeCompare(b.name)); // localeCompare hàm sắp xếp từ A-Z
    } else if (sortType === "sortTime") {

        // Kiểm tra nếu < 0 thì a lên trước b và ngược lại còn nếu = 0 thì giữ nguyên vị trí cả 2

        filterTestList.sort((a, b) => parseInt(a.time) - parseInt(b.time)); // Sắp xếp theo thời gian (tăng dần)
    }
    currentPage = 1; 
    renderPages();
    renderTest();
}

function searchTestList(searchValue) {
    filterTestList = testList.filter(test => {
        return test.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    currentPage = 1;
    renderPages();
    renderTest();
}


// Sự kiện thay đổi sắp xếp
selectSort.addEventListener('change', function() {
    const sortType = selectSort.value;
    if (sortType) {
        sortTestList(sortType);
    }
}); 


inputSearch.addEventListener('keydown',function(event){
    if (event.key === 'Enter'){
        event.preventDefault();
        const searchValue = inputSearch.value.trim();
        searchTestList(searchValue);
    }
});

renderPages();
renderTest();

tbody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const sliceIndex = parseInt(e.target.getAttribute('data-index')); 
        const startIndex = (currentPage - 1) * totalPerpage; 
        deleteIndex = startIndex + sliceIndex; 
        overlayForm.style.display = "flex";
    } else if (e.target.classList.contains('btn-fix')) {
        const sliceIndex = parseInt(e.target.getAttribute('data-index'));
        const startIndex = (currentPage - 1) * totalPerpage;
        const realIndex = startIndex + sliceIndex;
        window.location.href = `../pages/add-fix-test.html?index=${realIndex}`;
    }
});

btnDeleteForm.addEventListener('click',function(e){
    e.preventDefault();
    if (deleteIndex !== null) {
        const itemToDelete = filterTestList[deleteIndex];
        const realIndex = testList.findIndex(test => test.name === itemToDelete.name && test.category === itemToDelete.category); 
        if (realIndex !== -1) {
            testList.splice(realIndex, 1); 
            localStorage.setItem("testList", JSON.stringify(testList));
            filterTestList = testList.slice(); 
            currentPage = 1; 
            renderPages(); 
            renderTest(); 
        }
        overlayForm.style.display = "none";
        deleteIndex = null;
    }
});

iconCloseForm.addEventListener("click",function(){
    overlayForm.style.display = "none";
});

btnCancelForm.addEventListener("click",function(){
    overlayForm.style.display = "none";
});

btnAddTest.addEventListener('click',function(){
    window.location.href = "../pages/add-fix-test.html";
});

logOut.addEventListener('click',function(){
    localStorage.setItem("checkLogin",0);
});