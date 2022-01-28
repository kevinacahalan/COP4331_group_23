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

function checkFormComplete(){
    var fnameVal = document.getElementById('firstName').value.length;
    var lnameVal = document.getElementById('lastName').value.length;
    var unameVal = document.getElementById('signupUsername').value.length;
    var pnameVal = document.getElementById('signupPassword').value.length;
    var cpnameVal = document.getElementById('signupConfirmPassword').value.length;

    //If any of the fields are null, return boolean for incomplete TRUE
     if (fnameVal== "" || lnameVal == "" || unameVal == ""  || pnameVal== "" || cpnameVal==""  ) {
         //alert("The field needs a value!")
         return false;
     }
     else
     {
         return true;
     }

}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const Pass = document.getElementById("signupPassword");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    //Controls Create Account Form Button Behavior
    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
       // loginForm.classList.remove("form--hidden");
        //createAccountForm.classList.add("form--hidden");

        //Check if all the inputs have been filled, display message depending on it
        if( checkFormComplete() == true)
            {
              setFormMessage(createAccountForm, "success", "Congrats all fields are filled out!");  
            }
        
        
        else if(checkFormComplete() == false)
            setFormMessage(createAccountForm, "error", "At least one field is incomplete!");
        
        //setFormMessage(createAccountForm, "success", "Congrats this test works!");

       

    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login

        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    //Perform error handling of user input field information
    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }

            else if (e.target.id === "signupPassword" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Password must be at least 10 characters in length");
            }

            else if (e.target.id === "signupConfirmPassword" && Pass.value != e.target.value) {
                setInputError(inputElement, "Confirm password doesn't match password");
            }

        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});