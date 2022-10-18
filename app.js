const incomeName = document.querySelector('#income-input');
const incomeValue = document.querySelector('#income-amount');
const addIncomeBtn = document.querySelector('#add-income');
const incomeList = document.querySelector('#income-list');
const totalIncome = document.querySelector('#total-month-income');
const expensesName = document.querySelector('#expense-input');
const expensesValue = document.querySelector('#expense-amount');
const addExpensesBtn = document.querySelector('#add-expense');
const expensesList = document.querySelector('#expense-list');
const totalExpenses = document.querySelector('#total-month-expense');
const totalMoney = document.querySelector('#total-money');
const logo = document.querySelector('#logo');
const headerText = document.querySelector('#header-text');
const inputCheck = document.querySelectorAll('.input-check');
//VARIABLES
let listArr;
let balance = 0;
let income = 0;
let expenses = 0;
const incomesString = 'incomes';
const expensesString = 'expenses';
//LOCAL STORAGE
listArr = JSON.parse(localStorage.getItem('listArr')) || [];
createNewTransaction();
//CHECKING IF VALUE OF INPUT IS NOT NEGATIVE
function checkValue(event) {
   if (event.target.value < 0) {
      event.target.value = event.target.value * -1;
   }
}

inputCheck.forEach((input) => {
   input.addEventListener('keyup', checkValue);
});
//FUNCTIONS THAT ARE NESTED LATER ON
function clearIncomeInputs() {
   incomeName.value = '';
   incomeValue.value = '';
}

function clearExpensesInputs() {
   expensesName.value = '';
   expensesValue.value = '';
}

function totalAmount(type, listArr) {
   let sum = 0;
   listArr.forEach((transaction) => {
      if (transaction.type === type) {
         sum += transaction.amount;
      }
   });
   return sum;
}

function headerMessage() {
   if (balance === 0) {
      headerText.innerHTML = 'Bilans wynosi zero';
      logo.style.color = '#F8E9DD';
   } else if (balance > 0) {
      headerText.innerHTML = 'Mozesz jeszcze wydać ' + `${balance}` + ' złotych';
      logo.style.color = '#93C572';
   } else {
      headerText.innerHTML = 'Bilans jest ujemny. Jesteś na minusie ' + `${balance * -1}` + ' złotych';
      logo.style.color = '#DC143C';
   }
}

function totalBalance(income, expenses) {
   return income - expenses;
}
//CREATING NEW DIV
function newData(list, type, title, amount, id) {
   const newTransaction = `<div id="${id}" class="${type}">
        <div class="transaction-name">${title}</div>
        <div class="transaction-amount">${amount} PLN</div>
        <div class="buttons-box">
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
        </div>
    </div>`;
   const position = 'afterbegin';
   list.insertAdjacentHTML(position, newTransaction);
}
//CLEARING INNER HTML OF EXPENSES&INCOMES LIST
function fieldEmpty(elements) {
   elements.forEach((element) => {
      element.innerHTML = '';
   });
}
//UPDATING THE DATA ON THE SITE AND CREATING NEW TRANSACTION DIV
function createNewTransaction() {
   income = totalAmount(incomesString, listArr);
   expenses = totalAmount(expensesString, listArr);
   balance = totalBalance(income, expenses);
   headerMessage();
   totalIncome.innerHTML = `${income} PLN`;
   totalExpenses.innerHTML = `${expenses} PLN`;
   totalMoney.innerHTML = `${balance} PLN`;
   fieldEmpty([incomeList, expensesList]);
   listArr.forEach((transaction, index) => {
      if (transaction.type === incomesString) {
         newData(incomeList, transaction.type, transaction.title, transaction.amount, index);
      } else if (transaction.type === expensesString) {
         newData(expensesList, transaction.type, transaction.title, transaction.amount, index);
      }
   });
   localStorage.setItem('listArr', JSON.stringify(listArr));
}
//CREATING INCOME&EXPENSES AS AN OBJECT IN ARRAY
function createNewIncome() {
   let income = {
      title: incomeName.value,
      amount: parseFloat(incomeValue.value),
      type: incomesString,
   };
   listArr.push(income);
   createNewTransaction();
   clearIncomeInputs();
}

function createNewExpenses() {
   let expenses = {
      title: expensesName.value,
      amount: parseFloat(expensesValue.value),
      type: expensesString,
   };
   listArr.push(expenses);
   createNewTransaction();
   clearExpensesInputs();
}
// TWO MAIN FUNCTIONS
function inputIncomeCorrect() {
   if (incomeName.value === '' || incomeValue.value === '') {
      alert('Please fill in required fields.');
   } else {
      createNewIncome();
   }
}

function inputExpensesCorrect() {
   if (expensesName.value === '' || expensesValue.value === '') {
      alert('Please fill in required fields.');
   } else {
      createNewExpenses();
   }
}
//EDIT AND DELETE BUTTONS
function editAndDelete(event) {
   const targetBtn = event.target;
   const btnBox = targetBtn.parentNode;
   const transaction = btnBox.parentNode;
   if (targetBtn.textContent === 'Delete') {
      deleteTransaction(transaction);
   } else if (targetBtn.textContent === 'Edit') {
      editTransaction(transaction);
   }
}

function deleteTransaction(transaction) {
   listArr.splice(transaction.id, 1);
   createNewTransaction();
}

function editTransaction(transaction) {
   let editedTransaction = listArr[transaction.id];
   if (editedTransaction.type === incomesString) {
      incomeName.value = editedTransaction.title;
      incomeValue.value = editedTransaction.amount;
   } else if (editedTransaction.type === expensesString) {
      expensesName.value = editedTransaction.title;
      expensesValue.value = editedTransaction.amount;
   }
   deleteTransaction(transaction);
}

addIncomeBtn.addEventListener('click', inputIncomeCorrect);
addExpensesBtn.addEventListener('click', inputExpensesCorrect);
incomeList.addEventListener('click', editAndDelete);
expensesList.addEventListener('click', editAndDelete);
