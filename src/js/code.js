const urlBase = "https://collectivecontacts.xyz/api";
const extension = ".php";

let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener(
    "DOMContentLoaded",
    function () {
        readCookie();

        document.getElementById("search-submit").addEventListener("click", function (e) {
            console.log(document.getElementById("search").value);
            searchContacts();

            document.getElementById("search").value = "";
        });

        document.getElementById("add-submit").addEventListener("click", function (e) {
            console.log(document.getElementById("add-fname").value);
            addContact();

            document.getElementById("add-fname").value = "";
            document.getElementById("add-lname").value = "";
            document.getElementById("add-email").value = "";
            document.getElementById("add-phone").value = "";
        });

        document.getElementById("edit-submit").addEventListener("click", function (e) {
            updateContacts();
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
    const id = document.cookie.split("=")[3].split(";")[0];
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
        document.getElementById(
            "username-display"
        ).innerHTML = `Logged in as ${firstName} ${lastName}`;
    }
}

function searchContacts() {
    const endpoint = "/SearchContacts";
    let opOutput = document.getElementById("search-post-result");
    opOutput.value = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = JSON.stringify({
        search: document.getElementById("search").value,
        userId: getId(),
    });

    console.log(JSON.stringify(request));

    handleRequest(url, request).then((data) => {
        if (data.error == "") {
            insertContacts(data.results);
            opOutput.textContent = "Contact(s) found!";
        } else {
            opOutput.textContent = "No contact(s) matching search parameters found!";
        }
    });
}

function addContact() {
    const endpoint = "/AddContact";
    const opOutput = document.getElementById("add-post-result");
    opOutput.value = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = JSON.stringify({
        userId: getId(),
        contact: {
            firstName: document.getElementById("add-fname").value,
            lastName: document.getElementById("add-lname").value,
            email: document.getElementById("add-email").value,
            phoneNumber: document.getElementById("add-phone").value,
        },
    });

    console.log(JSON.stringify(request));

    handleRequest(url, request).then((data) => {
        if (data.error == "") {
            opOutput.value = "Contact added successfully.";
        } else {
            opOutput.value = "Unable to add contact.";
        }
    });
}

function updateContact() {
    const endpoint = "/Update";
    const opOutput = document.getElementById("post-result");
    opOutput.textContent = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = {
        firstName: document.getElementById("edit-fname").value,
        lastName: document.getElementById("edit-lname").value,
        email: document.getElementById("edit-email").value,
        phoneNumber: document.getElementById("edit-phone").value,
        contactId: document.getElementById("edit-container").dataset.contactId,
    };

    console.log(JSON.stringify(request));

    handleRequest(url, request).then((data) => {
        if (data.error == "") {
            opOutput.textContent = "Contact updated successfully.";
            document.getElementById("edit-fname").value = "";
            document.getElementById("edit-lname").value = "";
            document.getElementById("edit-email").value = "";
            document.getElementById("edit-phone").value = "";
        } else {
            opOutput.textContent = "Unable to update contact.";
        }
    });
}

function deleteContact(id) {
    const endpoint = "/Delete";
    const opOutput = document.getElementById("post-result");
    opOutput.textContent = "";

    const url = `${urlBase}${endpoint}${extension}`;
    const request = {
        contactId: id,
    };

    console.log(JSON.stringify(request));

    handleRequest(url, request).then((data) => {
        if (data.error == "") {
            opOutput.textContent = "Contact deleted successfully.";
            if (
                document.getElementById("contacts-list").contains(document.getElementById(`${id}`))
            ) {
                document.getElementById(`${id}`).remove();
            }
        } else {
            opOutput.textContent = "Unable to delete contact.";
        }
    });
}

async function handleRequest(url, request) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: request,
    });

    return await response.json();
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
        "items-center",
        "even:bg-slate-100"
    );

    div.innerText = `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.phoneNumber}`;

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
        const editModal = document.getElementById("edit-container");
        editModal.setAttribute("data-contactId", contact.contactId);
        document.getElementsById("edit-fname").placeholder = contact.firstName;
        document.getElementsById("edit-lname").placeholder = contact.lastName;
        document.getElementsById("edit-email").placeholder = contact.email;
        document.getElementsById("edit-phone").placeholder = contact.phoneNumber;
        editModal.classList.replace("hidden", "flex");
        document.getElementById("edit-fname").focus();
    });

    // Create Delete button
    const deleteButton = document.createElement("button");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-user-times");
    deleteButton.append(deleteIcon);
    deleteButton.classList.add("flex", "items-center", "px-2");
    deleteButton.addEventListener("click", function () {
        if (confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
            deleteContact(contact.contactId);
        }
    });

    // Add both buttons to contact object
    newContact.append(editButton, deleteButton);

    return newContact;
}
