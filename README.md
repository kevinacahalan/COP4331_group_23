# LAMP full-stack application

<img src="media/../src/media/gifs/lava-lamp.gif" alt="lava-lamp" width="120"  align="right"/>

Full-stack application using HTML, CSS, JS, PHP and mySQL. Application supports a login page and a user portal, where authenticated users can search for contacts in their remote contacts list. Contacts can be **C**reated, **R**ead, **U**pdated, and **D**eleted.

---

## Motivation

Created to satisfy the 'Small Project' group assignment for Prof. Rick Leinecker's COP4331 Processes of Object-Oriented Software during the Spring 2022 semester.

---

## Technical Requirements
Remote hosting is handled by [Digital Ocean](https://www.digitalocean.com/), where a single 'droplet' (Digital Ocean's smallest server-hosting size) was spun up with a [one-click LAMP stack](https://marketplace.digitalocean.com/apps/lamp).

The LAMP stack is composed of:
### **L**inux
The open-source operating system used on the remote server
### **A**pache
The open-source Web server used for hosting the remote content
### **M**ySql
The open-source <span title="Relational Database Management System">RDBMS</span><sup>*</sup> used for processing the data in the database
### **P**HP
The open-source, server-sided scripting language used for processing backend computations

---

## Repository overview
```
├── README.md
└── src
    ├── index.html
    ├── api
    ├── html
    ├── css
    ├── js    
    └── media
        ├── images
        └── gifs
```

---

## API Documentation

API endpoints are documented at [SwaggerHub](https://app.swaggerhub.com/apis/COP4331_group23/COP4331_group23/1.0.0).

---

## Running instructions

Visit [Collective Contacts](http://collectivecontacts.xyz) to log in.

Log in and, upon authentication, perform any of the following operations on the user's contact list:
- Create (add contact),
  - Users can select the 'Add' tab in the top to display the form to add contacts. After filling out all fields, users can submit the form contents using the Submit button at the bottom.
- Read (search contact list),
  - Users can select the 'Search' tab in the top to display the form to search contacts. Users can enter a first and last name to search in their contacts list. Any results matching first, last, and both names will be displayed in the contacts list panel to the right.
- Update (update contact information),
  - Users can select the button with the image of a person and a pencil to edit that contact. The button will open a modal for editing that particular contact.  After filling out all fields, users can submit the form contents using the Submit button at the bottom.
- Delete (delete contact from list)
  - Users can select the button with the image of a person and an x to edit that contact. The button will open a modal with a named prompt (ensuring selection of the correct contact) for deleting that particular contact. Users must provide their password to delete a contact, providing another layer of security against accidental deletions as well as third-party access.

---

## Contributors

Project Manager/Frontend: [Tam Nguyen](https://github.com/kaiyom90)

Frontend: [Justice Smith](https://github.com/jcode94)

API: [Kevin Cahalan](https://github.com/kevinacahalan) and [Kevin Jimenez](https://github.com/KevinJ0226)

Database: [Kelvin Florenciani](https://github.com/Sagerushboy)

![steve-carell-love-lamp](src/media/gifs/carell-lamp.gif)

