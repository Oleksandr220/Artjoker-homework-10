async function fetchCurencyApi(curency) {
  let dollarRate = `https://evgeniychvertkov.com/api/exchange/?currency[]=${curency}`;
  const fetchUrl = await fetch(dollarRate, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "X-Authorization-Token": "20db3d99-1606-11ec-a1b1-8a04c6a70bd3",
    },
  });

  return fetchUrl;
}

export default fetchCurencyApi;
