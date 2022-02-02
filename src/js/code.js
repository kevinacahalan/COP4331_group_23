const urlBase = "https://collectivecontacts.xyz/src/api/";
const extension = ".php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.replace("../index.html");
}

function getID() {
    const id = document.cookie.split("=")[3];
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
    if (userId < 0) {
        window.location.replace("../index.html");
    } else {
        document.getElementById("username-display").innerHTML =
            `${firstName} ${lastName}`;
    }
}

function searchContacts() {
    const endpoint = "/SearchContacts";
    let result = document.getElementById("post-result");
    
    const url = `${ urlBase }${ endpoint }${ extension }`;
    
    const fname = document.getElementById('search-fname').value;
    const lname = document.getElementById('search-lname').value;
    
    const jsonPayload = {
        "userId": getID(),
        "firstName": fname,
        "lastName": lname
    }
    
    let contactList = document.getElementById('contacts-list');
    result.innerHTML = "";
    
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            if (response.results.length > 0) {
                result.innerText = 'Contact(s) found!';
                response.results.forEach(el => contactList.append(buildContact(el)));
            } else {
                result.innerText = 'No contact(s) matching search parameters found!'
            }
        }
    }).catch(e => {
        console.log(`${e}`);
    })
}

function addContact() {
    const endpoint = "/AddContact.php";
    const opOutput = document.getElementById('post_result');
    
    const url = `${ urlBase }${ endpoint }${ extension }`;
    
    const fname = document.getElementById('add-fname').value;
    const lname = document.getElementById('add-lname').value;
    const email = document.getElementById('add-email').value;
    const phone = document.getElementById('add-phone').value;
    
    const jsonPayload = {
        'userId': getID(),
        'contact': {
            'firstName': fname,
            'lastName': lname,
            'email': email,
            'phoneNumber': phone
        }
    }
    
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            opOutput.innerText = 'Contact added successfully.';
        }
    }).catch(e => {
        console.log(`${e}`);
    })
}

function updateContact(button) {
    const endpoint = "/Update";
    const opOutput = document.getElementById('post_result');
    
    const url = `${ urlBase }${ endpoint }${ extension }`;
    
    const fname = document.getElementById(`${ button.dataset.contactId }-fname`).value;
    const lname = document.getElementById(`${ button.dataset.contactId }-lname`).value;
    const email = document.getElementById(`${ button.dataset.contactId }-email`).value;
    const phone = document.getElementById(`${ button.dataset.contactId }-phone`).value;
    const contactId = button.dataset.contactId;
    
    const jsonPayload = {
        'firstName': fname,
        'lastName': lname,
        'email': email,
        'phoneNumber': phone,
        'contactId': contactId
    }
    
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            opOutput.innerText = 'Contact updated successfully.';
        }
    }).catch(e => {
        console.log(`${e}`);
    })
}

function deleteContact(button) {
    const endpoint = "/Delete";
    const opOutput = document.getElementById('post_result');
    
    const url = `${ urlBase }${ endpoint }${ extension }`;
    
    const contactId = button.dataset.contactId;
    
    const jsonPayload = {
        'contactId': contactId
    }
    
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            opOutput.innerText = 'Contact deleted successfully.';
        }
    }).catch(e => {
        console.log(`${e}`);
    })
}

// Builds the elements to display in the contacts output table
function buildContact(data) {
    let contact = document.createElement('div');
    contact.classList.add('text-center w-full space-around');
    
    const fname = document.createElement('div')
    fname.innerText = `${ data.firstName }`;
    fname.id = `${ data.contactId }-fname`;
    
    const lname = document.createElement('div')
    lname.innerText = `${ data.lastName }`;
    lname.id = `${ data.contactId }-lname`;
    
    const email = document.createElement('div')
    email.innerText = `${ data.email }`;
    email.id = `${ data.contactId }-email`;
    
    const phone = document.createElement('div')
    phone.innerText = `${ data.phoneNumber }`;
    phone.id = `${ data.contactId }-phone`;
    
    contact.setAttribute('data-id', data.contactId);
    
    // Create Edit button
    const editButton = document.createElement('button');
    editButton.append('<i class="fas fa-user-edit"></i>');
    editButton.classList.add('flex', 'items-center');
    editButton.setAttribute('onclick', updateContact(this));
    editButton.setAttribute('data-contactId', data.contactId)
    
    // Create Delete button
    const deleteButton = document.createElement('button');
    deleteButton.append('<i class="fas fa-user-times"></i>');
    deleteButton.classList.add('flex', 'items-center');
    deleteButton.setAttribute('onclick', deleteContact(this));
    editButton.setAttribute('data-contactId', data.id);
    
    // Add both buttons to contact object
    contact.append(editButton, deleteButton);
    
    return contact;
}
