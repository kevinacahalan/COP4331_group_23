const urlBase = "https://collectivecontacts.xyz/api";
const extension = ".php";
let timeout = null;
let temp = null;

async function doLogin() {
    const endpoint = "/Login";
    const loginForm = document.querySelector("#login");

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    var hash = md5(password);

    let body = {
        login,
        password: hash,
    };

    // document.getElementById("loginResult").innerHTML = "";
    setFormMessage(loginForm, "Success", "");

    let url = `${urlBase}${endpoint}${extension}`;
    let response = await requestHandler(url, body);

    // If response error exists then do something?
    // if (response.error) {

    // }

    userId = response.id;

    if (userId < 1) {
        // document.getElementById("loginResult").innerHTML =
        //   "User/Password combination incorrect";
        setFormMessage(loginForm, "error", "User/Password combination incorrect");
        document.getElementById("loginResult").innerHTML = "Incorrect credentials, try again!";
        return;
    }

    firstName = response.firstName;
    lastName = response.lastName;

    saveCookie();

    window.location.replace("html/contacts.html");
}

async function doLoginFromSignUp() {
    const endpoint = "/Login";
    const createAccountForm = document.querySelector("#createAccount");

    var login = document.getElementById("signupUsername").value;

    var password = document.getElementById("signupPassword").value;
    var hash = md5(password);

    let body = {
        login,
        password: hash,
    };

    // document.getElementById("loginResult").innerHTML = "";
    setFormMessage(createAccountForm, "Success", "");

    let url = `${urlBase}${endpoint}${extension}`;
    let response = await requestHandler(url, body);

    // If response error exists then do something?
    // if (response.error) {

    // }

    userId = response.id;


    firstName = response.firstName;
    lastName = response.lastName;

    saveCookie();

    window.location.replace("html/contacts.html");
}

async function checkUsernameFree() {
    const endpoint = "/CheckAvailableUsername";
    const createAccountForm = document.querySelector("#createAccount");

    let login = document.getElementById("signupUsername").value;

    let body = {
        login,
    };

    let url = `${urlBase}${endpoint}${extension}`;

    temp = await requestHandler(url, body);

    console.log(temp)

    return !(temp === null || temp.error === "")
}

async function doDelayedSearch(callback) {
  if (timeout) { 
    console.log("Clearing timeout") 
    clearTimeout(timeout);
  }

  console.log("Setting timeout: function should run soon")
  timeout = setTimeout(await callback(), 500);
}

document.getElementById("signupUsername").addEventListener("keydown", (e) => {
    // await checkUsernameFree();
    if (temp) clearTimeout(temp);
})

document.getElementById("signupUsername").addEventListener("keyup", async (e) => {
   // e.preventDefault()
    console.log("Keyup: running check")
    doDelayedSearch(async () => { 
        let value = await checkUsernameFree();

        console.log("Validating username")
        validateUsername(value);
    })
})



async function doSignUp() {
    userId = 0;
    const endpoint = "/Registration";
    const createAccountForm = document.querySelector("#createAccount");

    var firstname = document.getElementById("firstName").value;
    var lastname = document.getElementById("lastName").value;
    var login = document.getElementById("signupUsername").value;

    var password = document.getElementById("signupPassword").value;
    var hash = md5(password);

    var confirmPass = document.getElementById("signupConfirmPassword").value;
    var unCheck = document.getElementById("un_Check");
    //let formData = formData(document.querySelector("#createAccount"));

    if (password == confirmPass) {
        document.getElementById("loginResult").innerHTML = "";

        let url = `${urlBase}${endpoint}${extension}`;

        let body = {
            firstName: firstname,
            lastName: lastname,
            password: hash,
            login,
        };
        
        let response = await requestHandler(url, body);

        // TODO: show error for site and stop from auto-redirect
        if (response.error) {
            setFormMessage(createAccountForm, "error", "Username already in use, please try again");
            unCheck.innerHTML= '<i class="fa fa-window-close"></i>'
            unCheck.style.color = '#ff0000';
            return;
        }
        console.log(response);

        userId = response.id;

        localStorage.setItem("userIDInput", userId);

        localStorage.getItem("userIDInput");

        firstName = response.firstName;
        lastName = response.lastName;

        saveCookie();
        doLoginFromSignUp();
        
        //window.location.replace("html/contacts.html");
    } else {
        // make conf pass red
        document.getElementById("loginResult").innerHTML = "Passwords do not match";
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();
}

// TODO: Think over removal of default values
async function requestHandler(url = "", formData = {}, rtype = "POST") {
    if (formData === {}) {
        console.log("Bad input data");
        return await { error: "No input data" };
    }

    let response = await fetch(url, {
        method: rtype,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        document.getElementById("post-result").innerHTML = `${response.status}`;

        // TODO: Make better error response message
        return await { error: "Bad response from API" };
    }

    return await response.json();
}

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

function clearButtonResponseText() {
    document.getElementById("loginResult_Prime").innerHTML = "";
    document.getElementById("loginResult").innerHTML = "";
}

//Clear input error that gets triggered by submission
function clearInputFields(){
    const createAccountForm = document.querySelector("#createAccount");
    createAccountForm.reset();
    var fname = document.getElementById("firstName");
    var lname = document.getElementById("lastName");
    var uname = document.getElementById("signupUsername");
    var pass = document.getElementById("signupPassword");
    var cpname = document.getElementById("signupConfirmPassword");

    clearInputError(fname);
    clearInputError(lname);
    clearInputError(uname);
    clearInputError(pass);
    clearInputError(cpname);
    clearChecks();
    setFormMessage(createAccountForm, "success", "");
    //alert("Fields have been cleared!");
}

function clearInputFields(){
    const createAccountForm = document.querySelector("#createAccount");
    createAccountForm.reset();
    var fname = document.getElementById("firstName");
    var lname = document.getElementById("lastName");
    var uname = document.getElementById("signupUsername");
    var pass = document.getElementById("signupPassword");
    var cpname = document.getElementById("signupConfirmPassword");

    clearInputError(fname);
    clearInputError(lname);
    clearInputError(uname);
    clearInputError(pass);
    clearInputError(cpname);
    clearChecks();
    setFormMessage(createAccountForm, "success", "");
    //alert("Fields have been cleared!");
}

//Remove checks by removing the icon tags
function clearChecks(){
    var fnCheck = document.getElementById("fn_Check");
    var lnCheck = document.getElementById("ln_Check");
    var unCheck = document.getElementById("un_Check");
    var passCheck = document.getElementById("pw_Check");
    var cpCheck = document.getElementById("cp_Check");

    fnCheck.innerHTML="";
    fnCheck.style.color = '';
    lnCheck.innerHTML="";
    lnCheck.style.color = '';
    unCheck.innerHTML="";
    unCheck.style.color = '';
    passCheck.innerHTML="";
    passCheck.style.color = '';
    cpCheck.innerHTML="";
    cpCheck.style.color = '';
    


}

function clearfnChecks(){
    var fnCheck = document.getElementById("fn_Check");
    

    fnCheck.innerHTML="";
    fnCheck.style.color = '';

}

function clearlnChecks(){
    
    var lnCheck = document.getElementById("ln_Check");
   
    lnCheck.innerHTML="";
    lnCheck.style.color = '';


}

function clearunChecks(){
   
    var unCheck = document.getElementById("un_Check");
    

   
    unCheck.innerHTML="";
    unCheck.style.color = '';
}

function clearpassChecks(){
   
    var passCheck = document.getElementById("pw_Check");
    

   
    passCheck.innerHTML="";
    passCheck.style.color = '';
}

function clearcpChecks(){
    
    var cpCheck = document.getElementById("cp_Check");

    cpCheck.innerHTML="";
    cpCheck.style.color = '';
    

}

//Checks validity of name and display visual check
function validateName(){
    var fname = document.getElementById("firstName").value;
    var fnCheck = document.getElementById("fn_Check");
    if(fname.length > 0)
    {
        fnCheck.innerHTML='<i class ="fas fa-check-circle"></i>';
        //fnCheck.innerHTML= '<i class="fa fa-window-close"></i>';
        fnCheck.style.color = '#2e8b57';
        //fnCheck.innerHTML="Valid input";
    }
   else
    {
        fnCheck.innerHTML="";
        fnCheck.style.color = '';
        //fnCheck.innerHTML="Valid input";
    }
}

function validatelName(){
    var lname = document.getElementById("lastName").value;
    var lnCheck = document.getElementById("ln_Check");
    if(lname.length > 0)
    {
        lnCheck.innerHTML='<i class ="fas fa-check-circle"></i>';
        //lnCheck.innerHTML= '<i class="fa fa-window-close"></i>';
        lnCheck.style.color = '#2e8b57';
        //fnCheck.innerHTML="Valid input";
    }
   else
    {
        lnCheck.innerHTML= '';
        lnCheck.style.color = '';
       
    }
}

function validateUsername(value) {
    var uname = document.getElementById("signupUsername").value;
    var unCheck = document.getElementById("un_Check");

    console.log(value)

    if(!value)
    {
        unCheck.innerHTML='<i class ="fas fa-check-circle"></i>';
        unCheck.style.color = '#2e8b57';
        //fnCheck.innerHTML="Valid input";
    }
   else 
    {
        console.log("Bad temp: Show error")
        console.log(temp, value)
        unCheck.innerHTML= '<i class="fa fa-window-close"></i>'
        unCheck.style.color = '#ff0000';
        //fnCheck.innerHTML="Valid input";
    }
    
}

function validatePassword(){
    var pass = document.getElementById("signupPassword").value;
    var passCheck = document.getElementById("pw_Check");
    if(pass.length > 9)
    {
        passCheck.innerHTML='<i class ="fas fa-check-circle"></i>';
        passCheck.style.color = '#2e8b57';
        //fnCheck.innerHTML="Valid input";
    }
   else
    {
        passCheck.innerHTML= '';
        passCheck.style.color = '';
        //fnCheck.innerHTML="Valid input";
    }
}

function validateconfirmPassword(){
    var pass = document.getElementById("signupPassword").value;
    var cpname = document.getElementById("signupConfirmPassword").value;
    var cpCheck = document.getElementById("cp_Check");
    if(pass == cpname)
    {
        cpCheck.innerHTML='<i class ="fas fa-check-circle"></i>';
        cpCheck.style.color = '#2e8b57';
        //fnCheck.innerHTML="Valid input";
    }
   else
    {
        cpCheck.innerHTML= '';
        cpCheck.style.color = '';
        //fnCheck.innerHTML="Valid input";
    }
}


function checkFormComplete() {
    var fnameVal = document.getElementById("firstName").value.length;
    var lnameVal = document.getElementById("lastName").value.length;
    var unameVal = document.getElementById("signupUsername").value.length;
    var pnameVal = document.getElementById("signupPassword").value.length;
    var cpnameVal = document.getElementById("signupConfirmPassword").value.length;

    //If any of the fields are null, return boolean for incomplete TRUE
    if (fnameVal == "" || lnameVal == "" || unameVal == "" || pnameVal == "" || cpnameVal == "") {
        //alert("The field needs a value!")
        return false;
    } else {
        return true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const Pass = document.getElementById("signupPassword");

    //Create Account Link trigger
    document.querySelector("#linkCreateAccount").addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        //clearButtonResponseText();
        createAccountForm.classList.remove("form--hidden");
    });

    //Login Link Trigger
    document.querySelector("#linkLogin").addEventListener("click", (e) => {
        e.preventDefault();
        clearInputFields();
        loginForm.classList.remove("form--hidden");
        //clearButtonResponseText();
        createAccountForm.classList.add("form--hidden");
    });

    //Controls Create Account Form Button Behavior
    createAccountForm.addEventListener("submit", (e) => {
        e.preventDefault();
      //  checkUsernameFree();
        //doSignUp();
        //alert ("Register successfully");
        // loginForm.classList.remove("form--hidden");
        //createAccountForm.classList.add("form--hidden");

        //Check if all the inputs have been filled, display message depending on it
        if (checkFormComplete() == true) {
            setFormMessage(createAccountForm, "success", "Congrats all fields are filled out!");
            //Now Perform the doSignUp(), but check to see if password matches confirm Passowrd
           // clearInputFields();
            doSignUp();
           // clearInputFields();
        }

        //If form isn't complete, don't allow for registration of new user
        else if (checkFormComplete() == false) {
            setFormMessage(createAccountForm, "error", "* At least one field is incomplete!");
            
        }
        
        //setFormMessage(createAccountForm, "success", "Congrats this test works!");
    });

    //Check login credentials and send via server using doLogin()
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        doLogin();
       
    });

    //Perform error handling of user input field information
    document.querySelectorAll(".form__input").forEach((inputElement) => {
        inputElement.addEventListener("blur", (e) => {
            if (
                e.target.id === "signupUsername" &&
                e.target.value.length > 0 &&
                e.target.value.length < 10 
            ) {
                clearunChecks();
                setInputError(inputElement, "* Username must be at least 10 characters in length");
            } else  if (
                e.target.id === "firstName" &&
                e.target.value.length > 0 && 
                //!e.target.value.match(/^[A-Z]*$/)
               ( /[A-Z]/.test( e.target.value.charAt(0))== false)
            ) {
                clearfnChecks();
                setInputError(inputElement, "* First name should be capitalized");
            }  else  if (
                e.target.id === "lastName" &&
                e.target.value.length > 0 && 
                //!e.target.value.match(/^[A-Z]*$/)
               ( /[A-Z]/.test( e.target.value.charAt(0))== false)
            ) {
                clearlnChecks();
                setInputError(inputElement, "* Last name should be capitalized");
            }else if (
                e.target.id === "signupPassword" &&
                e.target.value.length > 0 &&
                e.target.value.length < 10
            ) {
                clearpassChecks();
                setInputError(inputElement, "* Password must be at least 10 characters in length");
            } else if (e.target.id === "signupConfirmPassword" && Pass.value != e.target.value) {
                setInputError(inputElement, "* Confirm password doesn't match password");
            }
        });

        inputElement.addEventListener("input", (e) => {
            clearInputError(inputElement);
        });
    });
});
