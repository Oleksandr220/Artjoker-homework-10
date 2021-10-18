"use strict";

const userList = document.querySelector(".users");
const formAccounts = document.querySelector(".form__accounts");

formAccounts.addEventListener("submit", choiceAccounts);

import { users } from "./users";
import usersMurkup from "./users.hbs";

const localUsers = localStorage.getItem("users");
const parseLocalUsers = JSON.parse(localUsers);

function choiceAccounts(event) {
  event.preventDefault();
  const arrayAccounts = [];
  const curAccounts = formAccounts.bankUsers.value;
  parseLocalUsers.map((user) => {
    if (curAccounts == "activeAccount") {
      if (user.isActive == true) {
        return arrayAccounts.push(user);
      }
    }
    if (curAccounts == "disabledAccount") {
      if (user.isActive == false) {
        return arrayAccounts.push(user);
      }
    }
    if (curAccounts == "allAccount") {
      return arrayAccounts.push(user);
    }
  });
  console.log(arrayAccounts);
}

function render(users) {
  if (localUsers !== null) {
    addUsersToMarkup(parseLocalUsers);
  } else {
    setUsersToLS(users);
    addUsersToMarkup(users);
  }
}

render(users);

function setUsersToLS(clients) {
  localStorage.setItem("users", JSON.stringify(clients));
}

function addUsersToMarkup(users) {
  users.map((user) => {
    const userMurkUp = usersMurkup({ user });
    return userList.insertAdjacentHTML("beforeend", userMurkUp);
  });
}
