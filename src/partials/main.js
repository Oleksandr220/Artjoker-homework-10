"use strict";

import { users } from "./users";
import usersMurkup from "./users.hbs";

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

// class FetchCurrency {
//   url;
//   constructor(url) {
//     this.url = url;
//   }

//   get CurrencyApi() {
//     return fetch(this.url, {
//       method: "GET",
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//         "X-Authorization-Token": "20db3d99-1606-11ec-a1b1-8a04c6a70bd3",
//       },
//     })
//       .then((response) => response.json())
//       .then((res) => res.data)
//       .catch((err) => console.log(err.message));
//   }
// }

function fetchCurencyApi(url) {
  const fetchUrl = fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "X-Authorization-Token": "20db3d99-1606-11ec-a1b1-8a04c6a70bd3",
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err.message));
  return fetchUrl;
}
// Подсчет общего количества денег в банке
function totalBankFounds(clients) {
  // curTotal = 0;
  let totalFounds = 0;
  let amountOfDebt = 0;
  for (let client of clients) {
    console.log(client);
    let dollarRate = fetchCurencyApi(
      `https://evgeniychvertkov.com/api/exchange/?currency[]=${client.currency}`
    )
      .then((res) => res.data)
      .then((res) => res);
    console.log(dollarRate);
    totalFounds +=
      client.account.debitAccount +
      client.account.creditAccount.personalFound +
      (client.account.creditAccount.creditFounds.limit -
        client.account.creditAccount.creditFounds.founds);
    totalCount.innerHTML = `Общая сумма денег в банке: ${totalFounds}`;
  }

  const amountOfDebtArr = clients.map((client) => {
    return (amountOfDebt +=
      client.account.creditAccount.creditFounds.limit -
      client.account.creditAccount.creditFounds.founds);
  });

  creditCount.innerHTML = `Общая сумма долга перед банком: ${amountOfDebt}`;

  console.log(totalFounds);
  console.log(amountOfDebt);
}
