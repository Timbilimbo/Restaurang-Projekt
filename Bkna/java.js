// Bankhantering (A-nivå, Webbutveckling 1)

const storeKey = "bankAppData_v1";

const listEl = document.getElementById("customerList");
const newNameEl = document.getElementById("newName");
const newBalanceEl = document.getElementById("newBalance");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const amountEl = document.getElementById("amount");
const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const transferAmountEl = document.getElementById("transferAmount");
const transferToEl = document.getElementById("transferTo");
const transferBtn = document.getElementById("transferBtn");
const selectedNameEl = document.getElementById("selectedName");
const selectedBalanceEl = document.getElementById("selectedBalance");
const messageEl = document.getElementById("message");
const txListEl = document.getElementById("txList");
const statCustomersEl = document.getElementById("statCustomers");
const statTotalEl = document.getElementById("statTotal");
const searchInputEl = document.getElementById("searchInput");
const sortSelectEl = document.getElementById("sortSelect");

let customers = [];
let selectedId = null;
let nextId = 1;

function formatMoney(value) {
  return value.toLocaleString("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 });
}

function nowText() {
  return new Date().toLocaleString("sv-SE");
}

function save() {
  localStorage.setItem(storeKey, JSON.stringify({ customers, selectedId, nextId }));
}

function load() {
  const data = localStorage.getItem(storeKey);
  if (data) {
    const parsed = JSON.parse(data);
    customers = parsed.customers || [];
    selectedId = parsed.selectedId || null;
    nextId = parsed.nextId || 1;
    return;
  }
  customers = [
    { id: 1, name: "Anna", balance: 1200, tx: [] },
    { id: 2, name: "Kalle", balance: 300, tx: [] },
    { id: 3, name: "Maja", balance: 800, tx: [] }
  ];
  nextId = 4;
}

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "");
}

function getSelectedCustomer() {
  return customers.find(c => c.id === selectedId) || null;
}

function addTx(customer, type, amount, note) {
  customer.tx.unshift({
    type,
    amount,
    note: note || "",
    date: nowText()
  });
  if (customer.tx.length > 20) customer.tx.length = 20;
}

function renderStats() {
  statCustomersEl.textContent = customers.length;
  const total = customers.reduce((sum, c) => sum + c.balance, 0);
  statTotalEl.textContent = formatMoney(total);
}

function getFilteredCustomers() {
  const q = searchInputEl.value.trim().toLowerCase();
  let list = customers.filter(c => c.name.toLowerCase().includes(q));
  if (sortSelectEl.value === "balance") {
    list.sort((a, b) => b.balance - a.balance);
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }
  return list;
}

function renderList() {
  listEl.innerHTML = "";
  const list = getFilteredCustomers();

  if (list.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Inga kunder";
    li.style.cursor = "default";
    listEl.appendChild(li);
    return;
  }

  list.forEach(customer => {
    const li = document.createElement("li");
    if (customer.id === selectedId) li.classList.add("selected");
    const name = document.createElement("span");
    name.textContent = customer.name;
    const balance = document.createElement("span");
    balance.textContent = formatMoney(customer.balance);
    li.appendChild(name);
    li.appendChild(balance);
    li.addEventListener("click", () => {
      selectedId = customer.id;
      render();
      save();
    });
    listEl.appendChild(li);
  });
}

function renderTransferOptions() {
  transferToEl.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Välj mottagare";
  transferToEl.appendChild(placeholder);

  customers.forEach(customer => {
    if (customer.id === selectedId) return;
    const option = document.createElement("option");
    option.value = customer.id;
    option.textContent = customer.name;
    transferToEl.appendChild(option);
  });
}

function renderSelected() {
  const customer = getSelectedCustomer();
  if (!customer) {
    selectedNameEl.textContent = "Ingen vald";
    selectedBalanceEl.textContent = formatMoney(0);
    txListEl.innerHTML = "";
    return;
  }
  selectedNameEl.textContent = customer.name + " (id " + customer.id + ")";
  selectedBalanceEl.textContent = formatMoney(customer.balance);

  txListEl.innerHTML = "";
  if (customer.tx.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Inga transaktioner än.";
    li.style.cursor = "default";
    txListEl.appendChild(li);
    return;
  }
  customer.tx.forEach(t => {
    const li = document.createElement("li");
    const left = document.createElement("span");
    left.textContent = t.date + " - " + t.type + (t.note ? " (" + t.note + ")" : "");
    const right = document.createElement("span");
    right.textContent = (t.type === "Uttag" || t.type === "Överför" ? "-" : "+") + formatMoney(t.amount);
    li.appendChild(left);
    li.appendChild(right);
    li.style.cursor = "default";
    txListEl.appendChild(li);
  });
}

function render() {
  renderStats();
  renderList();
  renderSelected();
  renderTransferOptions();
}

addBtn.addEventListener("click", () => {
  const name = newNameEl.value.trim();
  const balance = Number(newBalanceEl.value || 0);

  if (!name) return setMessage("Skriv ett namn.", "error");
  if (balance < 0) return setMessage("Startsaldo kan inte vara negativt.", "error");
  if (customers.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    return setMessage("Namnet finns redan.", "error");
  }

  const customer = { id: nextId++, name, balance, tx: [] };
  customers.push(customer);
  if (balance > 0) addTx(customer, "Insättning", balance, "Startsaldo");
  selectedId = customer.id;
  newNameEl.value = "";
  newBalanceEl.value = "";
  setMessage("Kund skapad.", "ok");
  render();
  save();
});

deleteBtn.addEventListener("click", () => {
  const customer = getSelectedCustomer();
  if (!customer) return setMessage("Välj en kund först.", "error");

  if (!confirm("Radera " + customer.name + "?")) return;
  customers = customers.filter(c => c.id !== customer.id);
  selectedId = null;
  setMessage("Kund raderad.", "ok");
  render();
  save();
});

function changeBalance(type) {
  const customer = getSelectedCustomer();
  const amount = Number(amountEl.value);

  if (!customer) return setMessage("Välj en kund först.", "error");
  if (!amount || amount <= 0) return setMessage("Skriv ett belopp större än 0.", "error");
  if (type === "withdraw" && customer.balance < amount) {
    return setMessage("Inte tillräckligt med pengar.", "error");
  }

  if (type === "deposit") {
    customer.balance += amount;
    addTx(customer, "Insättning", amount);
    setMessage("Insättning klar.", "ok");
  } else {
    customer.balance -= amount;
    addTx(customer, "Uttag", amount);
    setMessage("Uttag klart.", "ok");
  }

  amountEl.value = "";
  render();
  save();
}

depositBtn.addEventListener("click", () => changeBalance("deposit"));
withdrawBtn.addEventListener("click", () => changeBalance("withdraw"));

transferBtn.addEventListener("click", () => {
  const from = getSelectedCustomer();
  const toId = Number(transferToEl.value);
  const amount = Number(transferAmountEl.value);

  if (!from) return setMessage("Välj en avsändare först.", "error");
  if (!toId) return setMessage("Välj en mottagare.", "error");
  if (from.id === toId) return setMessage("Du kan inte överföra till samma konto.", "error");
  if (!amount || amount <= 0) return setMessage("Skriv ett belopp större än 0.", "error");

  const to = customers.find(c => c.id === toId);
  if (!to) return setMessage("Mottagaren finns inte.", "error");
  if (from.balance < amount) return setMessage("Inte tillräckligt med pengar.", "error");

  from.balance -= amount;
  to.balance += amount;
  addTx(from, "Överför", amount, "Till " + to.name);
  addTx(to, "Insättning", amount, "Från " + from.name);

  transferAmountEl.value = "";
  transferToEl.value = "";
  setMessage("Överföring klar.", "ok");
  render();
  save();
});

searchInputEl.addEventListener("input", renderList);
sortSelectEl.addEventListener("change", renderList);

load();
render();
