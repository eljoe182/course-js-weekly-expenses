const expensesList = document.querySelector("#gastos ul");
const form = document.querySelector("#agregar-gasto");

class Budget {
  constructor(amount) {
    this.amount = Number(amount);
    this.balance = Number(amount);
    this.expenses = [];
  }
  updateExpenses(newExpense) {
    const { amount } = newExpense;
    this.expenses = [...this.expenses, newExpense];
    this.recalculateBalance();
  }
  recalculateBalance() {
    const balance = this.expenses.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );
    this.balance = Number(this.amount) - balance;
  }
  removeExpense(id) {
    this.expenses = this.expenses.filter(
      (expense) => expense.id !== Number(id)
    );
    this.recalculateBalance();
  }
}

function removeExpense(e) {
  e.preventDefault();
  budget.removeExpense(e.target.dataset.id);
  ui.addExpenseToList(budget.expenses);
  ui.updateAmountBalance(budget.balance);
  ui.levelBudget(budget);
}

class UI {
  setAmount(values) {
    const { amount, balance } = values;
    document.querySelector("#total").textContent = amount;
    document.querySelector("#restante").textContent = balance;
  }
  showMessage(message, type) {
    const div = document.createElement("div");
    div.innerText = message;
    div.classList.add("text-center", "alert");

    if (type === "error") {
      div.classList.add("alert-danger");
    } else {
      div.classList.add("alert-success");
    }

    document.querySelector(".primario").insertBefore(div, form);

    setTimeout(() => {
      div.remove();
    }, 3000);
  }
  updateAmountBalance(value) {
    document.querySelector("#restante").textContent = value;
  }
  addExpenseToList(expenses) {
    expensesList.innerHTML = "";
    expenses.forEach((expense) => {
      const { id, description, amount } = expense;
      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      const spanDescription = document.createElement("span");
      spanDescription.innerText = description;

      const spanAmount = document.createElement("span");
      spanAmount.innerText = `$ ${amount}`;
      spanAmount.classList.add("badge", "badge-primary", "badge-pill");

      const btnRemove = document.createElement("button");
      btnRemove.classList.add("btn", "btn-danger", "btn-sm", "ml-2");
      btnRemove.innerText = "Remove";
      btnRemove.dataset.id = id;
      btnRemove.addEventListener("click", removeExpense);

      li.appendChild(spanDescription);
      li.appendChild(spanAmount);
      li.appendChild(btnRemove);
      expensesList.appendChild(li);
    });
    form.reset();
  }
  levelBudget({ balance, amount }) {
    const balanceInfo = document.querySelector(".restante");
    const level = balance / amount;
    if (level < 0.25) {
      balanceInfo.classList.remove("alert-success", "alert-warning");
      balanceInfo.classList.add("alert-danger");
    } else if (level < 0.5) {
      balanceInfo.classList.remove("alert-success", "alert-danger");
      balanceInfo.classList.add("alert-warning");
    } else {
      balanceInfo.classList.remove("alert-danger", "alert-warning");
      balanceInfo.classList.add("alert-success");
    }
  }
}

let budget;
const ui = new UI();

function promptQuestion() {
  const response = prompt("what is your budget?");
  if (
    response === null ||
    response === "" ||
    isNaN(response) ||
    Number(response) <= 0
  ) {
    window.location.reload();
  }
  budget = new Budget(response);
  ui.setAmount(budget);
}

function addExpense(e) {
  e.preventDefault();
  const description = document.querySelector("#gasto").value;
  const amount = Number(document.querySelector("#cantidad").value);

  if (
    description === "" ||
    amount === "" ||
    isNaN(amount) ||
    amount <= 0 ||
    amount > budget.balance
  ) {
    ui.showMessage("Please, set a expense name and amount", "error");
    return;
  }

  const newExpense = {
    description,
    amount,
    id: Date.now(),
  };
  budget.updateExpenses(newExpense);

  ui.updateAmountBalance(budget.balance);
  ui.addExpenseToList(budget.expenses);
  ui.levelBudget(budget);
  ui.showMessage("Expense add successfully", "success");
}

eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", promptQuestion);
  form.addEventListener("submit", addExpense);
}
