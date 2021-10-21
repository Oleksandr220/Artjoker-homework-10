"use strict";

import { users } from "./users";
import usersMurkup from "./users.hbs";
import fetchApi from "../fetchCurencyApi";

const counter = document.querySelector(".count");
const userList = document.querySelector(".users__list");
const formAccounts = document.querySelector(".form__accounts");
const totalCount = document.getElementById("total-count");
const creditCount = document.getElementById("credit-count");
formAccounts.addEventListener("submit", choiceAccounts);

const localUsers = localStorage.getItem("users");
const parseLocalUsers = JSON.parse(localUsers);

function choiceAccounts(event) {
  event.preventDefault();
  const arrayAccounts = [];
  const curAccounts = formAccounts.bankUsers.value;
  parseLocalUsers.map((user) => {
    if (curAccounts == "activeAccount") {
      if (user.isActive == true) {
        arrayAccounts.push(user);
      }
    }
    if (curAccounts == "disabledAccount") {
      if (user.isActive == false) {
        arrayAccounts.push(user);
      }
    }
    if (curAccounts == "allAccount") {
      arrayAccounts.push(user);
    }
  });
  render(arrayAccounts);
}
// Рендер
function render(users) {
  if (localUsers === null) {
    return addUsersToMarkup(parseLocalUsers);
  }
  addUsersToMarkup(users);
  totalBankFounds(users);
}

// Добавление юзеров в localStorage
function setUsersToLS(clients) {
  localStorage.setItem("users", JSON.stringify(clients));
}
setUsersToLS(users);

// Создание разметки по шаблону
function addUsersToMarkup(users) {
  userList.innerHTML = "";
  counter.classList.add("show");
  users.map((user) => {
    const userMurkUp = usersMurkup({ user });
    return userList.insertAdjacentHTML("beforeend", userMurkUp);
  });
}

// Запрос по курсу доллара

// Подсчет общего количества денег в банке
async function totalBankFounds(clients) {
  // curTotal = 0;
  let totalFounds = 0;
  let amountOfDebt = 0;

  const fetches = await fetchApi("usdrub")
    .then((response) => response.json())
    .then((res) => res.data)
    .then((res) => console.log(res.usdrub))
    .catch((err) => console.log(err.message));

  for (let client of clients) {
    totalFounds +=
      client.account.debitAccount +
      client.account.creditAccount.personalFound +
      (client.account.creditAccount.creditFounds.limit -
        client.account.creditAccount.creditFounds.founds);
  }

  const amountOfDebtArr = clients.map((client) => {
    return (amountOfDebt +=
      client.account.creditAccount.creditFounds.limit -
      client.account.creditAccount.creditFounds.founds);
  });

  totalCount.innerHTML = `Общая сумма денег в банке: ${totalFounds}`;
  creditCount.innerHTML = `Общая сумма долга перед банком: ${amountOfDebt}`;

  console.log(totalFounds);
  console.log(amountOfDebt);
}
