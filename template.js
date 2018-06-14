module.exports = (transactions) => (
  {
    "Data": {
      "Transaction": transactions
    },
    "Links": {
      "Self": "https://api.alphabank.com/open-banking/v2.0/accounts/22289/transactions/"
    },
    "Meta": {
      "TotalPages": 1,
      "FirstAvailableDateTime": "2017-05-03T00:00:00+00:00",
      "LastAvailableDateTime": "2017-12-03T00:00:00+00:00"
    }
  }
);