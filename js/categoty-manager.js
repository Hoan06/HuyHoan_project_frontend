// Form thêm danh mục
const overlayForm = document.querySelector("#form-category");
const btnAddCategory = document.querySelector("#btn-add");
const iconCloseForm = document.querySelector("#icon-close");
const btnCancelForm = document.querySelector("#btn-cancel");
const btnSave = document.querySelector("#btn-save");
const inputNameCategory = document.querySelector("#input-name-category");
const inputEmoji = document.querySelector("#input-emoji");
const errorNameCategory = document.querySelector("#error-name-category");
const errorEmoji = document.querySelector("#error-emoji");

// Form sửa danh mục 
const overlayFormFix = document.querySelector("#form-category-fix");
const iconCloseFormFix = document.querySelector("#icon-close-fix");
const btnCancelFormFix = document.querySelector("#btn-cancel-fix");
const btnSaveFix = document.querySelector("#btn-save-fix");
const inputNameCategoryFix = document.querySelector("#input-name-category-fix");
const inputEmojiFix = document.querySelector("#input-emoji-fix");
const errorNameCategoryFix = document.querySelector("#error-name-category-fix");
const errorEmojiFix = document.querySelector("#error-emoji-fix");
let currentEditIndex = null;

// Form xác nhận xóa 
const overlayFormDelete = document.querySelector("#overlay-delete");
const btnDeleteCategory = document.querySelector("#btn-delete-form-delete");
const iconCloseFormDelete = document.querySelector("#icon-close-delete");
const btnCancelFormDelete = document.querySelector("#btn-cancel-delete");


const tbody = document.querySelector("#tbody");
const categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];

// Phân trang 

let currentPages = 1;
let totalPerpage = 3;
let totalPage = Math.ceil(categoryList.length / totalPerpage);
const btnPagesElement = document.querySelector("#btn-pages");
const btnBackElement = document.querySelector("#page-btn-back");
const btnNextElement = document.querySelector("#page-btn-next");


document.addEventListener('DOMContentLoaded',function(){
    const logOut = document.querySelector("#logOut");
    const checkLogin = JSON.parse(localStorage.getItem("checkLogin")) || 0;

    if (checkLogin !== 1){
        window.location.href = "../pages/login.html";
    }
});



// Hàm render các nút trang
const renderPages = () => {
    totalPage = Math.ceil(categoryList.length / totalPerpage);
    btnPagesElement.textContent = "";
    for(let i=1 ; i<=totalPage ;i++){
        const btnElement = document.createElement("button");
        
        btnElement.textContent = i;
        btnElement.classList.add("page-btn");

        // Kiểm tra button đang được active
        if (currentPages === i){
            btnElement.classList.remove("page-btn");
            btnElement.classList.add("page-btn-active");
        }

        // Disabled button
        if (currentPages === 1){
            document.querySelector("#page-btn-back").setAttribute("disabled","disabled");
        } else {
            document.querySelector("#page-btn-back").removeAttribute("disabled");
        }

        if (currentPages === totalPage){
            document.querySelector("#page-btn-next").setAttribute("disabled","disabled");
        } else {
            document.querySelector("#page-btn-next").removeAttribute("disabled");
        }

        btnElement.addEventListener('click',function(){
            
            currentPages = i;

            renderPages();
            renderCategory();
        });

        btnPagesElement.appendChild(btnElement);
    }
};

// Sự kiện cho 2 nút back và next page

btnNextElement.addEventListener('click',function(){
    if (currentPages < totalPage){
        currentPages++;

        renderPages();
        renderCategory();
    }
});

btnBackElement.addEventListener('click',function(){
    if (currentPages > 1){
        currentPages--;

        renderPages();
        renderCategory();
    }
});

renderPages();


renderCategory();

function clearError(input, errorElement) {
    input.addEventListener("input", function () {
        errorElement.textContent = "";
        input.style.border = "1px solid #ccc"; 
    });
}

clearError(inputNameCategory, errorNameCategory);
clearError(inputEmoji, errorEmoji);
clearError(inputNameCategoryFix, errorNameCategoryFix);
clearError(inputEmojiFix, errorEmojiFix);



function renderCategory() {
    tbody.innerHTML = "";

    const getStartIndex = (currentPages - 1) * totalPerpage;
    const getEndIndex = totalPerpage * currentPages;

    const categorySlices = categoryList.slice(getStartIndex,getEndIndex);

    categorySlices.forEach((item,index) => {
        let tr = document.createElement("tr");
        const globalIndex = getStartIndex + index + 1;
        tr.innerHTML = `
        <td class="td-id">${globalIndex}</td>
        <td class="td-name">${item.emoji}${item.name}</td>
        <td class="td-act">
            <button id="btn-fix" class="btn-fix" data-index=${index}>Sửa</button>
            <button id="btn-delete" class="btn-delete" data-index=${index}>Xóa</button>
        </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-fix').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            openEditForm(index);
        });
    });
    document.querySelectorAll('.btn-delete').forEach((btn,index) => {
        btn.addEventListener('click', function() {
            overlayFormDelete.style.display = "flex";
            const indexDelete = this.getAttribute("data-index");
            overlayFormDelete.setAttribute("data-index",indexDelete);
        });
    });
    renderPages();
}

btnDeleteCategory.addEventListener('click',function(event){
    event.preventDefault();
    let indexDelete = overlayFormDelete.getAttribute("data-index");
    if (indexDelete !== null){
        categoryList.splice(indexDelete,1);
        localStorage.setItem("categoryList",JSON.stringify(categoryList));
        renderCategory();
    }
    overlayFormDelete.style.display = "none";
});

btnSave.addEventListener('click',function(){
    event.preventDefault();
    if (!inputNameCategory.value.trim()){
        errorNameCategory.textContent = "Tên danh mục không được để trống ";
        inputNameCategory.style.border = "2px solid red";
        return;
    }

    if (inputNameCategory.value.trim().length < 5){
        errorNameCategory.textContent = "Tên danh mục tối thiểu 5 kí tự ";
        inputNameCategory.style.border = "2px solid red";
        return;
    }

    if (!inputEmoji.value.trim()){
        errorEmoji.textContent = "Emoji không được để trống ";
        inputEmoji.style.border = "2px solid red";
        return;
    }

    const isDuplicate = categoryList.some(item => item.name.trim().toLowerCase() === inputNameCategory.value.trim().toLowerCase());
    if (isDuplicate) {
        errorNameCategory.textContent = "Tên danh mục đã tồn tại";
        inputNameCategory.style.border = "2px solid red";
        return;
    }

    categoryList.push({name : inputNameCategory.value,
        emoji : inputEmoji.value
    })
    localStorage.setItem("categoryList",JSON.stringify(categoryList));  
    renderCategory();
    inputNameCategory.value = "";
    inputEmoji.value = "";
    overlayForm.style.display = "none";
});

function openEditForm(index) {
    currentEditIndex = index;
    const category = categoryList[index];
    inputNameCategoryFix.value = category.name;
    inputEmojiFix.value = category.emoji;
    overlayFormFix.style.display = "flex";
}

btnSaveFix.addEventListener('click', function(event) {
    event.preventDefault();
    
    if (!inputNameCategoryFix.value.trim()) {
        errorNameCategoryFix.textContent = "Tên danh mục không được để trống";
        inputNameCategoryFix.style.border = "2px solid red";
        return;
    }

    if (!inputEmojiFix.value.trim()) {
        errorEmojiFix.textContent = "Emoji không được để trống";
        inputEmojiFix.style.border = "2px solid red";
        return;
    }

    const isDuplicate = categoryList.some((item, index) => 
        index !== parseInt(currentEditIndex) && 
        item.name.trim().toLowerCase() === inputNameCategoryFix.value.trim().toLowerCase()
    );
    if (isDuplicate) {
        errorNameCategoryFix.textContent = "Tên danh mục đã tồn tại";
        inputNameCategoryFix.style.border = "2px solid red";
        return;
    }

    categoryList[currentEditIndex] = {
        name: inputNameCategoryFix.value.trim(),
        emoji: inputEmojiFix.value.trim()
    };

    localStorage.setItem("categoryList", JSON.stringify(categoryList));
    
    overlayFormFix.style.display = "none";
    renderCategory();
});

iconCloseFormFix.addEventListener("click", function() {
    overlayFormFix.style.display = "none";
});

btnCancelFormFix.addEventListener("click", function() {
    overlayFormFix.style.display = "none";
});

btnAddCategory.addEventListener('click',function(){
    overlayForm.style.display = "flex";
});

iconCloseForm.addEventListener("click",function(){
    overlayForm.style.display = "none";
});

btnCancelForm.addEventListener("click",function(){
    overlayForm.style.display = "none";
});

iconCloseFormDelete.addEventListener('click',function(){
    overlayFormDelete.style.display = "none";
});

btnCancelFormDelete.addEventListener('click',function(){
    overlayFormDelete.style.display = "none";
});

logOut.addEventListener('click',function(){
    localStorage.setItem("checkLogin",0);
});