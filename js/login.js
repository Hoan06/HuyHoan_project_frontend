const inputEmail = document.querySelector("#input-email");
const inputPassword = document.querySelector("#input-password");
const btn = document.querySelector("#btn");
const errorEmail = document.querySelector("#error-email");
const errorPassword = document.querySelector("#error-password");
const emailList = JSON.parse(localStorage.getItem("email")) || [];
const checkLogin = JSON.parse(localStorage.getItem("checkLogin")) || 0;

if (checkLogin === 1){
    window.location.replace("../pages/dashboard.html");
};

function clearError(input, errorElement) {
    input.addEventListener("input", function () {
        errorElement.textContent = "";
        input.style.border = "1px solid #ccc"; 
    });
}

clearError(inputEmail, errorEmail);
clearError(inputPassword, errorPassword);

btn.addEventListener('click',function(){
    event.preventDefault();
    if (!inputEmail.value.trim()){
        errorEmail.textContent = "Email không được để trống";
        inputEmail.style.border = "2px solid red";
        return;
    } 
    if (!inputPassword.value.trim()){
        errorPassword.textContent = "Password không được để trống";
        inputPassword.style.border = "2px solid red";
        return;
    } 
    const check = emailList.find((user)=> 
        user.email === inputEmail.value && user.password === inputPassword.value);
if (check) {
    Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        if (check.email === "admin@gmail.com") {
            window.location.replace("../pages/category-manager.html");
            localStorage.setItem("checkLogin",1);
        } else {
            window.location.replace("../pages/dashboard.html");
            localStorage.setItem("checkLogin",1);
        }
    });
} else {
    Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại!",
        text: "Email hoặc mật khẩu không chính xác."
    });
}
});

