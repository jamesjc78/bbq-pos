// ====== Ate Terry's BBQ POS ======

// ====== INITIALIZATION ======
let items = JSON.parse(localStorage.getItem("items")) || [
  {name:"BBQ Stick", price:30, stock:100},
  {name:"Isaw", price:15, stock:50},
  {name:"Rice", price:20, stock:100},
  {name:"Softdrink", price:25, stock:50}
];

let order = [];
let total = 0;

// Initialize sales and dailySales robustly
let sales = JSON.parse(localStorage.getItem("sales")) || [];

let dailySales = localStorage.getItem("dailySales");
if (!dailySales || isNaN(parseInt(dailySales))) {
    dailySales = 0;
    localStorage.setItem("dailySales", dailySales);
} else {
    dailySales = parseInt(dailySales);
}

document.getElementById("dailySales").innerText = dailySales;

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

  order.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerText = `${item.name} - ₱${item.price} `;

    // Create remove button
    const removeBtn = document.createElement("button");
    removeBtn.innerText = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = () => removeOrderItem(index);

    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  document.getElementById("total").innerText = total;
}

// ====== REMOVE ORDER ======
function removeOrderItem(index){
  // Subtract the price from total
  total -= order[index].price;

  // Remove the item from the order array
  order.splice(index, 1);

  // Re-render the order list
  renderOrder();
}

// ====== CHECKOUT ======
function checkout(){
  const cash = parseInt(document.getElementById("cash").value);
  if(isNaN(cash) || cash < total){
    alert("Insufficient cash!");
    return;
  }

  const change = cash - total;
  document.getElementById("change").innerText = `Change: ₱${change}`;

  // reduce stock
  order.forEach(o=>{
    const itemIndex = items.findIndex(i=>i.name===o.name);
    if(itemIndex !== -1){
        items[itemIndex].stock--;
    }
  });

  // log sales
  sales.push(...order);

  // update daily sales
  dailySales += total;
  localStorage.setItem("dailySales", dailySales);
  document.getElementById("dailySales").innerText = dailySales;

  // save sales and items
  localStorage.setItem("sales", JSON.stringify(sales));
  localStorage.setItem("items", JSON.stringify(items));

  // reset order
  order = [];
  total = 0;
  renderOrder();
  renderMenu();
  document.getElementById("cash").value = "";
}

// ====== DAILY RESET ======
function resetDay(){
  if(confirm("Reset daily sales for Ate Terry's BBQ?")){
    sales=[];
    dailySales=0;
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem("dailySales", dailySales);
    document.getElementById("dailySales").innerText=dailySales;
    document.getElementById("change").innerText="";
  }
}

// ====== CSV EXPORT WITH DETAILED SUMMARY ======
function downloadCSV(){
  if(sales.length == 0){ 
    alert("No sales today!"); 
    return;
  }

  // Count sales per item
  let itemSummary = {};
  let grandTotal = 0;
  let totalItemsSold = 0;

  sales.forEach(s => {
    grandTotal += s.price;
    totalItemsSold++;
    if(itemSummary[s.name]){
      itemSummary[s.name].quantity++;
      itemSummary[s.name].total += s.price;
    } else {
      itemSummary[s.name] = {
        price: s.price,
        quantity: 1,
        total: s.price
      };
    }
  });

  // CSV header
  let csv = "Item,Price per Item,Quantity Sold,Total Revenue\n";

  // Add each item row
  for(let item in itemSummary){
    csv += `${item},${itemSummary[item].price},${itemSummary[item].quantity},${itemSummary[item].total}\n`;
  }

  // Add detailed summary
  csv += `\nTotal Items Sold,,${totalItemsSold}\n`;
  csv += `Grand Total,₱,,${grandTotal}\n`;

  // Download CSV
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "AteTerryBBQ_sales.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ====== INITIAL RENDER ======
renderMenu();




