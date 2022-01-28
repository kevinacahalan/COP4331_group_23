const urlBase = "http://collectivecontacts.xyz/";
const extension = ".php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    //  let password = document.getElementById("loginPassword").value;
    var hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    //	let loginCredentials = {login: login, password: password};
    let loginCredentials = { login: login, password: hash };
    let jsonPayload = JSON.stringify(loginCredentials);

    let url = urlBase + "Login" + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML =
                        "User/Password combination incorrect";
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
        document.getElementById("loginResult").innerHTML = err.message;
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

function searchContact() {
    let endpoint = "/SearchContact";
    let contactList = document.getElementById('contacts-list');
    
    let formData = new FormData(document.querySelector('form'));
    formData.append('uid', getID());
    
    let url = `${urlBase}${endpoint}${extension}`;

    let result = document.getElementById("post-result");
    result.innerHTML = "";
    try {
        let jsonObj = requestHandler(url, formData);
        if (jsonObj.length > 0) {
            jsonObj.forEach(el => contactList.append(buildContact(jsonObj)));
            result.innerHTML = 'Contact(s) found!';
        } else {
            result.innerHTML = 'No contact(s) matching search parameters found!'
        }
    } catch (e) {
        result.innerHTML = e.message;
    }
}

// For all DB mutations
function modifyContacts(endpoint='/AddContact') {
    let formData = new FormData(document.querySelector('form'));
    formData.append('uid', getID());
    
    let url = `${urlBase}${endpoint}${extension}`;

    let result = document.getElementById("post-result");
    result.innerHTML = "";
    try {
        let response = requestHandler(url, formData);
        result.innerHTML = response;
    } catch (e) {
        result.innerHTML = e.message;
    }
}

// Builds the elements to display in the contacts output table
function buildContact(data) {
    let contact = document.createElement('div');
    contact.classList.add('flex', 'flex-row', 'gap-x-3');
    
    const editButton = document.createElement('button');
    editButton.append('<i class="fas fa-user-edit"></i>');
    editButton.classList.add('flex', 'items-center');
    editButton.setAttribute('onclick', modifyContacts('/EditContact'));
    
    const deleteButton = document.createElement('button');
    deleteButton.append('<i class="fas fa-user-times"></i>');
    deleteButton.classList.add('flex', 'items-center');
    deleteButton.setAttribute('onclick', modifyContacts('/DeleteContact'))
   
    
    data.forEach(el => {
        let col = document.createElement('div');
        col.innerText = el;
        contact.append(col);
    });
    
    contact.append(editButton, deleteButton);
    
    return contact;
}
