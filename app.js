let order = [];
let total = 0;

let dailySales = localStorage.getItem("dailySales")
  ? parseInt(localStorage.getItem("dailySales"))
  : 0;

document.getElementById("dailySales").innerText = dailySales;

function addItem(name, price) {
  order.push({ name, price });
  total += price;
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById("orderList");
  list.innerHTML = "";

  order.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.name} - ₱${item.price}`;
    list.appendChild(li);
  });

  document.getElementById("total").innerText = total;
}

function checkout() {
  const cash = document.getElementById("cash").value;
  if (cash < total) {
    alert("Insufficient cash!");
    return;
  }

  const change = cash - total;
  document.getElementById("change").innerText = `Change: ₱${change}`;

  dailySales += total;
  localStorage.setItem("dailySales", dailySales);
  document.getElementById("dailySales").innerText = dailySales;

  clearOrder();
}

function clearOrder() {
  order = [];
  total = 0;
  document.getElementById("orderList").innerHTML = "";
  document.getElementById("total").innerText = 0;
  document.getElementById("cash").value = "";
  document.getElementById("change").innerText = "";
}
