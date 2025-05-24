
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const ctx = document.getElementById("expenseChart").getContext("2d");

let localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter text and amount");
  } else {
    const transaction = {
      id: Math.floor(Math.random() * 100000000),
      text: text.value,
      amount: +amount.value
    };
    transactions.push(transaction);
    updateLocalStorage();
    updateUI();
    text.value = "";
    amount.value = "";
  }
});

function updateUI() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">🗑️</button>
  `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);
  balance.innerText = `₹${total}`;
  money_plus.innerText = `₹${income}`;
  money_minus.innerText = `₹${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  updateUI();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

let myChart;
function updateChart() {
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0) * -1;

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "₹",
        data: [income, expense],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff"
          }
        }
      }
    }
  });
}

updateUI();
