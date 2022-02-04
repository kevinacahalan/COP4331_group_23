let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener(
    "DOMContentLoaded",
    function () {
        saveCookie();
        readCookie();

        let contacts = [
            {
                firstName: "Thomas",
                lastName: "Jefferson",
                email: "tjinva@gmail.com",
                phoneNumber: "1234567890",
                contactId: "1123",
            },
            {
                firstName: "George",
                lastName: "Washington",
                email: "wowiewash@yahoo.com",
                phoneNumber: "1234567890",
                contactId: "1235",
            },
        ];
        for (let i = 0; i < 4; i++) insertContacts(contacts);

        document.getElementById("search-open").addEventListener("click", function () {
            this.classList.add("border-slate-400");
            document.getElementById("add-open").classList.remove("border-slate-400");

            document.getElementById("search-modal").classList.replace("hidden", "flex");
            document.getElementById("add-modal").classList.add("hidden");
            document.getElementById("search-fname").focus();
        });

        document.getElementById("add-open").addEventListener("click", function () {
            this.classList.add("border-slate-400");
            document.getElementById("search-open").classList.remove("border-slate-400");

            document.getElementById("add-modal").classList.replace("hidden", "flex");
            document.getElementById("search-modal").classList.add("hidden");
            document.getElementById("add-fname").focus();
        });

        document.getElementById("edit-submit").addEventListener("click", function () {
            document.getElementById("edit-modal").classList.add("hidden");
        });

        document.getElementById("edit-close").addEventListener("click", function () {
            document.getElementById("edit-modal").classList.add("hidden");
        });

        document.getElementById("delete-submit").addEventListener("click", function () {
            let pwd = document.getElementById("delete-pwd").value;
            let contactId = document.getElementById("delete-modal").dataset.contactId;
            document.getElementById("delete-modal").classList.add("hidden");

            deleteContact(contactId, md5(pwd));
        });

        document.getElementById("delete-close").addEventListener("click", function () {
            document.getElementById("delete-prompt").textContent = "";
            document.getElementById("delete-modal").classList.add("hidden");
        });
    },
    false
);

function insertContacts(contacts) {
    let contactList = document.getElementById("contacts-list");

    contacts.forEach((el) => contactList.append(buildContact(el)));
}

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

function searchContacts() {
    const endpoint = "/SearchContacts";
    let result = document.getElementById("post-result");

    const url = `${urlBase}${endpoint}${extension}`;

    const fname = document.getElementById("search-fname").value;
    const lname = document.getElementById("search-lname").value;

    const jsonPayload = {
        userId: getID(),
        firstName: fname,
        lastName: lname,
    };

    let contactList = document.getElementById("contacts-list");
    result.innerHTML = "";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                if (response.results.length > 0) {
                    result.innerText = "Contact(s) found!";
                    response.results.forEach((el) => contactList.append(buildContact(el)));
                } else {
                    result.innerText = "No contact(s) matching search parameters found!";
                }
            }
        })
        .catch((e) => {
            console.log(`${e}`);
        });
}

function addContact() {
    const endpoint = "/AddContact.php";
    const opOutput = document.getElementById("post_result");

    const url = `${urlBase}${endpoint}${extension}`;

    const fname = document.getElementById("add-fname").value;
    const lname = document.getElementById("add-lname").value;
    const email = document.getElementById("add-email").value;
    const phone = document.getElementById("add-phone").value;

    const jsonPayload = {
        userId: getID(),
        contact: {
            firstName: fname,
            lastName: lname,
            email: email,
            phoneNumber: phone,
        },
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                opOutput.innerText = "Contact added successfully.";
            }
        })
        .catch((e) => {
            console.log(`${e}`);
        });
}

function updateContact() {
    const endpoint = "/Update";
    const opOutput = document.getElementById("post_result");

    const url = `${urlBase}${endpoint}${extension}`;

    const fname = document.getElementById(`${button.dataset.contactId}-fname`).value;
    const lname = document.getElementById(`${button.dataset.contactId}-lname`).value;
    const email = document.getElementById(`${button.dataset.contactId}-email`).value;
    const phone = document.getElementById(`${button.dataset.contactId}-phone`).value;
    const contactId = button.dataset.contactId;

    const jsonPayload = {
        firstName: fname,
        lastName: lname,
        email: email,
        phoneNumber: phone,
        contactId: contactId,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                opOutput.innerText = "Contact updated successfully.";
            }
        })
        .catch((e) => {
            console.log(`${e}`);
        });
}

function deleteContact(contactId, pwd) {
    const endpoint = "/Delete";
    const opOutput = document.getElementById("post_result");

    const url = `${urlBase}${endpoint}${extension}`;

    const jsonPayload = {
        contactId: contactId,
        userId: getID(),
        password: pwd,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: jsonPayload,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                opOutput.innerText = "Contact deleted successfully.";
            }
        })
        .catch((e) => {
            console.log(`${e}`);
        });
}

// Builds the elements to display in the contacts output table
function buildContact(contact) {
    let newContact = document.createElement("div");
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
        document.getElementById('edit-fname').focus();
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
        document.getElementById('delete-pw').focus();
    });

    // Add both buttons to contact object
    newContact.append(editButton, deleteButton);

    return newContact;
}
