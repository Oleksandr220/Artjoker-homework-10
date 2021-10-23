"use strict";

import { users } from "./users";
import usersMurkup from "./users.hbs";
import fetchApi from "../fetchCurencyApi";

const counter = document.querySelector(".count");
const userList = document.querySelector(".users__list");
const formAccounts = document.querySelector(".form__accounts");
const totalCount = document.getElementById("total-count");
const creditCount = document.getElementById("credit-count");
document.addEventListener("DOMContentLoaded", setUsersToLS(users));
document.addEventListener("DOMContentLoaded", render(users, "allAccount"));
formAccounts.addEventListener("submit", choiceAccounts);

const localUsers = localStorage.getItem("users");
const parseLocalUsers = JSON.parse(localUsers);

function choiceAccounts(event) {
  event.preventDefault();
  const curAccounts = formAccounts.bankUsers.value;
  const arrayAccounts = [];

  parseLocalUsers.map((user) => {
    if (curAccounts == "activeAccount") {
      if (user.isActive === true) {
        arrayAccounts.push(user);
      }
    }
    if (curAccounts == "disabledAccount") {
      if (user.isActive === false) {
        arrayAccounts.push(user);
      }
    }
    if (curAccounts == "allAccount") {
      arrayAccounts.push(user);
    }
  });
  render(arrayAccounts, curAccounts);
}
// Рендер
function render(users, curAccounts) {
  if (localUsers === null) {
    return addUsersToMarkup(parseLocalUsers);
  }
  addUsersToMarkup(users);
  onTotalAmountOdDebt(users, curAccounts);
}

// Добавление юзеров в localStorage
function setUsersToLS(clients) {
  if (parseLocalUsers !== undefined) {
    console.log(parseLocalUsers);
    return;
  }
  localStorage.setItem("users", JSON.stringify(clients));
}

// Создание разметки по шаблону
function addUsersToMarkup(users) {
  userList.innerHTML = "";
  counter.classList.add("show");
  users.map((user) => {
    const userMurkUp = usersMurkup({ user });
    return userList.insertAdjacentHTML("beforeend", userMurkUp);
  });
}

// Подсчет общего количества денег в банке
async function onTotalAmountOdDebt(clients, curAccounts) {
  let totalFounds = 0;
  let amountOfDebt = 0;
  if (curAccounts === "allAccount") {
    for (let client of clients) {
      const fetches = await fetchApi(client.currency);
      totalFounds += Math.floor(
        (client.account.debitAccount +
          client.account.creditAccount.personalFound +
          (client.account.creditAccount.creditFounds.limit -
            client.account.creditAccount.creditFounds.founds)) /
          fetches
      );
      amountOfDebt += Math.floor(
        (client.account.creditAccount.creditFounds.limit -
          client.account.creditAccount.creditFounds.founds) /
          fetches
      );
    }
    totalCount.innerHTML = `Общая сумма денег в банке: ${totalFounds} USD`;
    creditCount.innerHTML = `Общая сумма долга перед банком всех клиентов: ${amountOfDebt} USD`;
    return;
  }
  if (curAccounts === "activeAccount") {
    for (let client of clients) {
      const fetches = await fetchApi(client.currency);
      amountOfDebt += Math.floor(
        (client.account.creditAccount.creditFounds.limit -
          client.account.creditAccount.creditFounds.founds) /
          fetches
      );
    }
    creditCount.innerHTML = `Общая сумма долга перед банком активных клиентов: ${amountOfDebt} USD`;
    return;
  }
  if (curAccounts === "disabledAccount") {
    for (let client of clients) {
      const fetches = await fetchApi(client.currency);
      amountOfDebt += Math.floor(
        (client.account.creditAccount.creditFounds.limit -
          client.account.creditAccount.creditFounds.founds) /
          fetches
      );
    }
    creditCount.innerHTML = `Общая сумма долга перед банком не активных клиентов: ${amountOfDebt} USD`;
  }
}
