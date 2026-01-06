// ====== INITIALIZATION ======
let items = JSON.parse(localStorage.getItem("items")) || [
  {name:"BBQ Stick", price:30, stock:100},
  {name:"Isaw", price:15, stock:50},
  {name:"Rice", price:20, stock:100},
  {name:"Softdrink", price:25, stock:50}
];

let order = [];
let total = 0;

let sales = JSON.parse(localStorage.getItem("sales")) || [];
let dailySales = parseInt(localStorage.getItem("dailySales")) || 0;

document.getElementById("dailySales").innerText = dailySales;

renderMenu();

// ====== RENDER MENU ======
function renderMenu(){
  const menuDiv = document.getElementById("items");
  menuDiv.innerHTML = "";
  items.forEach((item,index)=>{
    const btn = document.createElement("button");
    btn.innerText = `${item.name} - ₱${item.price} (${item.stock})`;
    btn.disabled = item.stock <= 0;
    btn.onclick = ()=>addItem(item.name,index);
    menuDiv.appendChild(btn);
  });
}

// ====== ADD ITEM TO ORDER ======
function addItem(name,index){
  if(items[index].stock <=0){
    alert("Out of stock!");
    return;
  }
  order.push({name, price: items[index].price});
  total += items[index].price;
  renderOrder();
}

// ====== RENDER ORDER ======
function renderOrder(){
  const list = document.getElementById("orderList");
  list.innerHTML = "";
  order.forEach(item=>{
    const li = document.createElement("li");
    li.innerText = `${item.name} - ₱${item.price}`;
    list.appendChild(li);
  });
  document.getElementById("total").innerText = total;
}

// ====== CHECKOUT ======
function checkout(){
  const cash = parseInt(document.getElementById("cash").value);
  if(isNaN(cash) || cash<total){
    alert("Insufficient cash!");
    return;
  }

  const change = cash - total;
  document.getElementById("change").innerText = `Change: ₱${change}`;

  // reduce stock
  order.forEach(o=>{
    const itemIndex = items.findIndex(i=>i.name===o.name);
    items[itemIndex].stock--;
  });

  // log sales
  sales.push(...order);
  dailySales += total;

  localStorage.setItem("sales", JSON.stringify(sales));
  localStorage.setItem("dailySales", dailySales);
  localStorage.setItem("items", JSON.stringify(items));

  // reset order
  order = [];
  total=0;
  renderOrder();
  renderMenu();
  document.getElementById("cash").value="";
}

// ====== DAILY RESET ======
function resetDay(){
  if(confirm("Reset daily sales?")){
    sales=[];
    dailySales=0;
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem("dailySales", dailySales);
    document.getElementById("dailySales").innerText=dailySales;
    document.getElementById("change").innerText="";
  }
}

// ====== CSV EXPORT ======
function downloadCSV(){
  if(sales.length==0){ alert("No sales today!"); return;}
  let csv="Item,Price\n";
  sales.forEach(s=>{
    csv+=`${s.name},${s.price}\n`;
  });
  const blob = new Blob([csv],{type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url;
  a.download="sales.csv";
  a.click();
  URL.revokeObjectURL(url);
}
