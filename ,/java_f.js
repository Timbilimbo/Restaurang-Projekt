let kunder = [
  { id: 1, namn: "Anna", saldo: 1000 },
  { id: 2, namn: "Olle", saldo: 500 },
  { id: 3, namn: "Sara", saldo: 800 }
];
let nästaId = 4;

const lista = document.getElementById("lista");
const namn = document.getElementById("namn");
const saldo = document.getElementById("saldo");
const skapa = document.getElementById("skapa");
const valdkund = document.getElementById("valdkund");
const radera = document.getElementById("radera");
const belopp = document.getElementById("belopp");
const insatt = document.getElementById("insatt");
const ut = document.getElementById("ut");

const belopp2 = document.getElementById("belopp2");
const till = document.getElementById("till");
const overfor = document.getElementById("overfor");

function visa() {
  // Lista
  lista.innerHTML = "";
  for (let k of kunder) {
    let li = document.createElement("li");
    li.textContent = k.namn + " (" + k.saldo + " kr)";
    lista.appendChild(li);
  }

  // Dropdowns
  valdkund.innerHTML = "";
  till.innerHTML = "";

  let start1 = document.createElement("option");
  start1.value = "";
  start1.textContent = "Välj kund";
  valdkund.appendChild(start1);

  let start2 = document.createElement("option");
  start2.value = "";
  start2.textContent = "Välj mottagare";
  till.appendChild(start2);

  for (let k of kunder) {
    let o1 = document.createElement("option");
    o1.value = k.id;
    o1.textContent = k.namn + " (id " + k.id + ")";
    valdkund.appendChild(o1);

    let o2 = document.createElement("option");
    o2.value = k.id;
    o2.textContent = k.namn + " (id " + k.id + ")";
    till.appendChild(o2);
  }
}

skapa.addEventListener("click", function () {
  let n = namn.value.trim();
  let s = Number(saldo.value);

  if (n === "") return alert("Skriv ett namn");
  if (isNaN(s)) s = 0;
  if (s < 0) return alert("Startsaldo kan inte vara negativt");

  kunder.push({ id: nästaId, namn: n, saldo: s });
  nästaId++;

  namn.value = "";
  saldo.value = "";
  visa();
});

radera.addEventListener("click", function () {
  let id = Number(valdkund.value);
  if (!id) return alert("Välj en kund");

  let index = kunder.findIndex(k => k.id === id);
  if (index !== -1) kunder.splice(index, 1);

  visa();
});

insatt.addEventListener("click", function () {
  let id = Number(valdkund.value);
  let b = Number(belopp.value);

  if (!id) return alert("Välj en kund");
  if (!b || b <= 0) return alert("Skriv ett belopp över 0");

  let k = kunder.find(k => k.id === id);
  if (!k) return alert("Kund finns inte");

  k.saldo += b;
  belopp.value = "";
  visa();
});

ut.addEventListener("click", function () {
  let id = Number(valdkund.value);
  let b = Number(belopp.value);

  if (!id) return alert("Välj en kund");
  if (!b || b <= 0) return alert("Skriv ett belopp över 0");

  let k = kunder.find(k => k.id === id);
  if (!k) return alert("Kund finns inte");
  if (k.saldo < b) return alert("Inte tillräckligt med pengar");

  k.saldo -= b;
  belopp.value = "";
  visa();
});

overfor.addEventListener("click", function () {
  let frånId = Number(valdkund.value);
  let tillId = Number(till.value);
  let b = Number(belopp2.value);

  if (!frånId) return alert("Välj avsändare");
  if (!tillId) return alert("Välj mottagare");
  if (frånId === tillId) return alert("Du kan inte välja samma kund");
  if (!b || b <= 0) return alert("Skriv ett belopp över 0");

  let från = kunder.find(k => k.id === frånId);
  let mott = kunder.find(k => k.id === tillId);

  if (!från || !mott) return alert("Kund saknas");
  if (från.saldo < b) return alert("Inte tillräckligt med pengar");

  från.saldo -= b;
  mott.saldo += b;

  belopp2.value = "";
  till.value = "";
  visa();
});

visa();