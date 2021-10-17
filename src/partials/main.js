"use strict";

import { users } from "./users";

const userList = document.querySelector(".users");

userList.innerHTML =
  "<ul class=class__list>" +
  users
    .map(
      ({ name, currency, regDate, finalDate, account }) =>
        "<li class=class__list--item>" +
        name +
        "<br>" +
        "Валюта: " +
        currency +
        "<br>" +
        "От: " +
        regDate +
        "<br>" +
        "До: " +
        finalDate +
        "<br>" +
        "Дебитовый счет: " +
        account.debitAccount +
        currency +
        "<br>" +
        "Кредитовый счет: " +
        account.creditAccount.personalFound +
        currency +
        "<br>" +
        "Кредитные средства: " +
        account.creditAccount.creditFounds.founds +
        currency +
        "<br>" +
        "Кредитный лимит: " +
        account.creditAccount.creditFounds.limit +
        currency +
        "</li>"
    )
    .join("<br>") +
  "</ul>";
