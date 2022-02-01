const urlBase = "https://collectivecontacts.xyz/src/api/";
const extension = ".php";
//import { md5 } from './md5.js';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {

    const loginForm = document.querySelector("#login");

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    var hash = md5(password);
    let formData = new FormData();
    formData.append(login);
    formData.append(hash);

   // document.getElementById("loginResult").innerHTML = "";
   setFormMessage(loginForm, "Success", "");


    let url = urlBase + "Login" + extension;
    let response =  requestHandler(url, formData);

     userId = response.id;

    if (userId < 1) {
        // document.getElementById("loginResult").innerHTML =
            //   "User/Password combination incorrect";
         setFormMessage(loginForm, "error", "User/Password combination incorrect");
        return;
    }

    firstName = response.firstName;
    lastName = response.lastName;

    saveCookie();

    window.location.replace("../html/contacts.html");
 /*
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                   // document.getElementById("loginResult").innerHTML =
                     //   "User/Password combination incorrect";
                     setFormMessage(loginForm, "error", "User/Password combination incorrect");
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.replace("../html/contacts.html");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        //.getElementById("loginResult").innerHTML = err.message;
        setFormMessage(loginForm, "error", "Can't log in with credentials!");
    }

    */
}

function doSignUp(){
	userId = 0;

	
	var firstname = document.getElementById("firstName").value;
	var lastname = document.getElementById("lastName").value;
	var login = document.getElementById("signupUsername").value;


	var password = document.getElementById("signupPassword").value;
    var hash = md5( password );

	var confirmPass = document.getElementById("signupConfirmPassword").value;

    let formData = formData(document.querySelector("#createAccount"));
    formData.delete("password");
    formData.append(hash);

	if (password == confirmPass) 
	{
		document.getElementById("loginResult").innerHTML = "";

		// "email": "TestEmail@Test.com",
  		// "password": "password123",
  		// "firstname": "Landon",
  		// "lastname": "Russell",
  		// "phone": "407-938-4910"

		var json = { login: login, password: hash };

		// translating
		

		// console.log(jsonPayload);
		
		var url = urlBase + 'Signup' + extension;

		// console.log(url);
        let response = requestHandler(url, formData);
		
					userId = response.id;

					// console.log(userId);
					
					localStorage.setItem("userIDInput",userId);

					localStorage.getItem("userIDInput");
			
					firstName = response.firstName;
					lastName = response.lastName;

					saveCookie();
		
					window.location.href = "../html/contacts.html";
				
	}

	else {
		// make conf pass red
        document.getElementById("loginResult").innerHTML = "Passwords do not match";
	}	
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.replace("../index.html");
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

function getID() {
    const id = document.cookie.split(";")[0].split("=")[1];
    if (!document.cookie || !id) {
        return new Error("getID error: invalid cookie");
    }

    return id;
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }
    /*
    if (userId < 0) {
        window.location.replace("../index.html");
    } else {
        document.getElementById("username-display").innerHTML =
            `${firstName} ${lastName}`;
    }
*/
}

function requestHandler(url = "", formData = {}, rtype = "POST") {
    fetch(url, {
        method: rtype,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: formData
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).catch(e => {
        document.getElementById('post-result').innerHTML = `${e}`;
    })
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

function clearButtonResponseText(){
    document.getElementById("loginResult_Prime").innerHTML = "";
    document.getElementById("loginResult").innerHTML = "";
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

function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if ( username == "Formget" && password == "formget#123")
    {
        alert ("Login successfully");
        window.location = "../html/contacts.html"; // Redirecting to other page.
        return false;
    }}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const Pass = document.getElementById("signupPassword");

    //Create Account Link trigger
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        clearButtonResponseText();
        createAccountForm.classList.remove("form--hidden");
    });

    //Login Link Trigger
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        clearButtonResponseText();
        createAccountForm.classList.add("form--hidden");
    });

    //Controls Create Account Form Button Behavior
    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        //doSignUp();
       //alert ("Register successfully");
       // loginForm.classList.remove("form--hidden");
        //createAccountForm.classList.add("form--hidden");

        //Check if all the inputs have been filled, display message depending on it
        if( checkFormComplete() == true)
            {
              setFormMessage(createAccountForm, "success", "Congrats all fields are filled out!"); 
              //Now Perform the doSignUp(), but check to see if password matches confirm Passowrd
              doSignUp(); 
            }
        
        //If form isn't complete, don't allow for registration of new user
        else if(checkFormComplete() == false)
            {
                 setFormMessage(createAccountForm, "error", "At least one field is incomplete!");
            }
           
        

        //setFormMessage(createAccountForm, "success", "Congrats this test works!");

       

    });

    //Check login credentials and send via server using doLogin()
    loginForm.addEventListener("submit", e => {
        e.preventDefault();

       

        doLogin();
        //validate();
        
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