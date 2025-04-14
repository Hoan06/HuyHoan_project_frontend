const inputName = document.querySelector("#input-name");
const inputEmail = document.querySelector("#input-email");
const inputPassword = document.querySelector("#input-password");
const inputPasswordCheck = document.querySelector("#input-password-check");
const btn = document.querySelector("#btn");
const errorName = document.querySelector("#error-name");
const errorEmail = document.querySelector("#error-email");
const errorPassword = document.querySelector("#error-password");
const errorPasswordCheck = document.querySelector("#error-password-check");
const emailList = JSON.parse(localStorage.getItem("email")) || [];

function clearError(input, errorElement) {
    input.addEventListener("input", function () {
        errorElement.textContent = "";
        input.style.border = "1px solid #ccc"; 
    });
}

clearError(inputName, errorName);
clearError(inputEmail, errorEmail);
clearError(inputPassword, errorPassword);
clearError(inputPasswordCheck, errorPasswordCheck);

btn.addEventListener('click',function(){
    event.preventDefault();

    let flag = true;

    if (!inputName.value.trim()){
        errorName.textContent = "Tên không được để trống";
        inputName.style.border = "2px solid red";
        flag = false;
    } 
    if(!inputEmail.value.trim()){
        errorEmail.textContent = "Email không được để trống";
        inputEmail.style.border = "2px solid red";
        flag = false;
    }
    const check = emailList.some((user)=> user.email === inputEmail.value);
    if (check){
        errorEmail.textContent = "Email đã tồn tại rồi";
        inputEmail.style.border = "2px solid red";
        flag = false;
    }
    if (!inputPassword.value.trim()){
        errorPassword.textContent = "Password không được để trống";
        inputPassword.style.border = "2px solid red";
        flag = false;
    }
    if (inputPassword.value.length < 8){
        errorPassword.textContent = "Password tối thiểu 8 ký tự";
        inputPassword.style.border = "2px solid red";
        flag = false;
    }
    if (inputPassword.value !== inputPasswordCheck.value){
        errorPasswordCheck.textContent = "Password không trùng khớp";
        inputPasswordCheck.style.border = "2px solid red";
        flag = false;
    }
    if (flag === false){
        return;
    }
    emailList.push({
        email : inputEmail.value,
        password : inputPassword.value
    });
    localStorage.setItem("email",JSON.stringify(emailList));
    Swal.fire({
        icon: "success",
        title: "Đăng ký thành công",
        text: "Chúc mừng bạn đã đăng ký tài khoản thành công!!!",
        confirmButtonText: "Đăng nhập ngay"
    }).then(() => {
        window.location.href = "../pages/login.html";
    });
});
