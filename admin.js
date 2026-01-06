const ADMIN_PASS = "1234"; // Change this to your desired password

function login(){
  const input = document.getElementById("adminPassword").value;
  if(input===ADMIN_PASS){
    document.getElementById("loginDiv").style.display="none";
    document.getElementById("adminContent").style.display="block";
    renderItemList();
  } else{
    alert("Incorrect password!");
  }
}

function logout(){
  document.getElementById("adminContent").style.display="none";
  document.getElementById("loginDiv").style.display="block";
}

function renderItemList(){
  const list = document.getElementById("itemList");
  list.innerHTML="";
  let items = JSON.parse(localStorage.getItem("items")) || [];
  items.forEach((item,index)=>{
    const li = document.createElement("li");
    li.innerText = `${item.name} - ₱${item.price} - Stock: ${item.stock}`;
    const delBtn = document.createElement("button");
    delBtn.innerText="Delete";
    delBtn.onclick=()=>{deleteItem(index);}
    const editBtn = document.createElement("button");
    editBtn.innerText="Edit";
    editBtn.onclick=()=>{editItem(index);}
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function addItemAdmin(){
  const name = document.getElementById("itemName").value;
  const price = parseInt(document.getElementById("itemPrice").value);
  const stock = parseInt(document.getElementById("itemStock").value);
  if(!name || isNaN(price) || isNaN(stock)){ alert("Fill all fields!"); return;}
  let items = JSON.parse(localStorage.getItem("items")) || [];
  items.push({name,price,stock});
  localStorage.setItem("items",JSON.stringify(items));
  renderItemList();
  document.getElementById("itemName").value="";
  document.getElementById("itemPrice").value="";
  document.getElementById("itemStock").value="";
}

function deleteItem(index){
  let items = JSON.parse(localStorage.getItem("items")) || [];
  if(confirm("Delete this item?")){
    items.splice(index,1);
    localStorage.setItem("items",JSON.stringify(items));
    renderItemList();
  }
}

function editItem(index){
  let items = JSON.parse(localStorage.getItem("items")) || [];
  const name = prompt("Item name:",items[index].name);
  const price = prompt("Price:",items[index].price);
  const stock = prompt("Stock:",items[index].stock);
  if(name && price && stock){
    items[index]={name:name, price:parseInt(price), stock:parseInt(stock)};
    localStorage.setItem("items",JSON.stringify(items));
    renderItemList();
  }
}

function goHome() {
  window.location.href = "index.html"; // Redirects to the POS home screen
}
