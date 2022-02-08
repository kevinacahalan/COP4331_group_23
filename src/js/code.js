const urlBase = "https://collectivecontacts.xyz/api";
const extension = ".php";

let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener(
    "DOMContentLoaded",
    function () {
        readCookie();

        document.getElementById("search-form").addEventListener("submit", function (e) {
            e.preventDefault();

            contact = new FormData(this);

            searchContacts(contact);
        });

        document.getElementById("add-form").addEventListener("submit", function (e) {
            e.preventDefault();

            contact = new FormData(this);

            addContact(contact);
        });

        document.getElementById("edit-form").addEventListener("submit", function (e) {
            e.preventDefault();

            contact = new FormData(this);
            contact.append(document.getElementById('edit-modal').dataset.contactId);

            updateContact(contact);
            
            this.reset();
        });

        document.getElementById("delete-form").addEventListener("submit", function (e) {
            e.preventDefault();

            contact = new FormData(this);
            contact.append('contactId', document.getElementById("delete-modal").dataset.contactId);

            deleteContact(contact);
            
            this.reset();
        });

        document.getElementById("search-open").addEventListener("click", function () {
            // Indicate selection
            this.classList.add("border-slate-400");

            // Reset additional states to inactive
            document.getElementById("add-open").classList.remove("border-slate-400");

            // Add to display
            document.getElementById("search-modal").classList.replace("hidden", "flex");

            // Remove additional states from display
            document.getElementById("add-modal").classList.add("hidden");

            // Move cursor to first field
            document.getElementById("search-fname").focus();
        });

        document.getElementById("add-open").addEventListener("click", function () {
            // Indicate selection
            this.classList.add("border-slate-400");

            // Reset additional states to inactive
            document.getElementById("search-open").classList.remove("border-slate-400");

            // Add to display
            document.getElementById("add-modal").classList.replace("hidden", "flex");

            // Remove additional states from display
            document.getElementById("search-modal").classList.add("hidden");

            // Move cursor to first field
            document.getElementById("add-fname").focus();
        });

        // edit-open and delete-open eventListeners are linked dynamically in buildContact(contact) at runtime.

        document.getElementById("edit-close").addEventListener("click", function () {
            // Remove from display
            document.getElementById("edit-modal").classList.add("hidden");

            // Reset dynamic fields
            document.getElementById("edit-form").reset();
        });

        document.getElementById("delete-close").addEventListener("click", function () {
            // Remove from display
            document.getElementById("delete-modal").classList.add("hidden");

            // Reset dynamic fields
            document.getElementById("delete-prompt").reset();
        });
    },
    false
);

function insertContacts(contacts) {
    let contactsList = document.getElementById("contacts-list");

    contacts.forEach((el) => contactsList.append(buildContactElement(el)));
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.replace("../index.html");
}

function getId() {
    const id = document.cookie.split("=")[3];
    if (!document.cookie || !id) {
        return new Error("getID error: invalid cookie");
    }
    return id;
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
        document.getElementById("username-display").innerHTML = `${firstName} ${lastName}`;
    }
}

function searchContacts(contact) {
    const endpoint = "/SearchContacts";
    let opOutput = document.getElementById("post-result");
    opOutput.innerHTML = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = {
        userId: getId(),
        firstName: contact.firstName,
        lastName: contact.lastName,
    };
    
    const response = handleRequest(url, request);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        if (response.results.length > 0) {
            opOutput.textContent = "Contact(s) found!";
            insertContacts(response.results);
        } else {
            opOutput.textContent = "No contact(s) matching search parameters found!";
        }
    }
}

function addContact(contact) {
    const endpoint = "/AddContact";
    const opOutput = document.getElementById("post-result");
    opOutput.innerHTML = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = {
        userId: getId(),
        contact: contact
    };
    
    let response = handleRequest(url, request);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        opOutput.textContent = "Contact added successfully.";
    }
}

function updateContact(contact) {
    const endpoint = "/Update";
    const opOutput = document.getElementById("post-result");
    opOutput.textContent = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = contact;
    
    const response = handleRequest(url, request)
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        opOutput.innerText = "Contact updated successfully.";
    }
}

function deleteContact(contact) {
    const endpoint = "/Delete";
    const opOutput = document.getElementById("post-result");
    opOutput.textContent = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = {
        userId: getId(),
        password: contact.password,
        contactId: contact.contactId,
    };

    const response = handleRequest(url, request);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const contactToDel = document.getElementById(`${contactId}`);
        contactToDel.remove();
        opOutput.innerText = "Contact deleted successfully.";
    }
}

function handleRequest(url, request) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: request,
    })
        .then(function (response) {
            return response;
        })
        .catch((e) => {
            console.log(`${e}`);
        });
}

// Builds the elements to display in the contacts output table
function buildContactElement(contact) {
    let newContact = document.createElement("div");
    newContact.id = `${contact.contactId}`;
    newContact.classList.add(
        "text-center",
        "w-full",
        "flex",
        "flex-row",
        "justify-center",
        "even:bg-slate-100"
    );

    newContact.style.justifyContent = "space-between";

    const fname = document.createElement("div");
    fname.innerHTML = `${contact.firstName}`;
    fname.id = `${contact.contactId}-fname`;
    fname.classList.add("w-full");
    newContact.append(fname);

    const lname = document.createElement("div");
    lname.innerText = `${contact.lastName}`;
    lname.id = `${contact.contactId}-lname`;
    lname.classList.add("w-full");
    newContact.append(lname);

    const email = document.createElement("div");
    email.innerText = `${contact.email}`;
    email.id = `${contact.contactId}-email`;
    email.classList.add("w-full");
    newContact.append(email);

    const phone = document.createElement("div");
    phone.innerText = `${contact.phoneNumber}`;
    phone.id = `${contact.contactId}-phone`;
    phone.classList.add("w-full");
    newContact.append(phone);

    newContact.setAttribute("data-contactId", contact.contactId);

    // Create Edit button
    const editButton = document.createElement("button");
    // Make and add icon
    let editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-user-edit");
    editButton.append(editIcon);
    // Button config
    editButton.classList.add("flex", "items-center", "px-2");
    editButton.setAttribute("data-contactId", contact.contactId);
    editButton.id = "edit-open";
    editButton.addEventListener("click", function () {
        document.getElementById("edit-form").reset();
        const editModal = document.getElementById("edit-modal");
        editModal.setAttribute("data-contactId", contact.contactId);
        editModal.classList.replace("hidden", "flex");
        document.getElementById("edit-fname").focus();
    });

    // Create Delete button
    const deleteButton = document.createElement("button");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-user-times");
    deleteButton.append(deleteIcon);
    deleteButton.classList.add("flex", "items-center", "px-2");
    deleteButton.setAttribute("data-contactId", contact.contactId);
    deleteButton.id = "delete-open";
    deleteButton.addEventListener("click", function () {
        document.getElementById("delete-form").reset();
        const fname = document.getElementById(`${this.dataset.contactid}-fname`).innerText;
        const lname = document.getElementById(`${this.dataset.contactid}-lname`).innerText;

        const prompt = `Deleting ${fname} ${lname}`;

        document.getElementById("delete-prompt").textContent = prompt;
        const deleteModal = document.getElementById("delete-modal");
        deleteModal.setAttribute("data-contactId", contact.contactId);
        deleteModal.classList.remove("hidden");
        document.getElementById("delete-password").focus();
    });

    // Add both buttons to contact object
    newContact.append(editButton, deleteButton);

    return newContact;
}
