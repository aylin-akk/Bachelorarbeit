//Logik fürs Frontend beim Speichern von geänderten Input-Feldern
function saveChanges(inputID) {
  if(inputID == "location"){
    for(e of document.getElementsByClassName('location')){
      e.readOnly = true;
      e.style.border = 'none';
      e.classList.remove("border-2","border-danger","border-warning");
      e.classList.add("border-0")
      e.style.backgroundColor = 'white';
    }
  }else{
    document.getElementById(inputID).readOnly = true;
    document.getElementById(inputID).style.border = 'none';
    document.getElementById(inputID).classList.remove("border-2","border-danger","border-warning");
    document.getElementById(inputID).classList.add("border-0")
    document.getElementById(inputID).style.backgroundColor = 'white';
  }
}

function updateReceiptSum(productPriceList) {
  let sum= 0;
 const priceList = document.getElementsByClassName(productPriceList);
 for (let index = 0; index < priceList.length; index++) {
 
  let cent = convertEurotoCent(priceList[index].value);
  sum += cent/100;
  }
  const updatedSum = sum.toFixed(2);
  
  document.getElementById('receiptSum').value = updatedSum;

}

function convertEurotoCent(euroValue){
  euroValue = euroValue.replace(',', '.');
  let valueInFloat = parseFloat(euroValue);
  let cent =  Math.round(valueInFloat * 100);
  return cent;
}

function editRow(inputID) {
  if(inputID == "location"){
    for(e of document.getElementsByClassName('location')){
      e.readOnly = false;
      e.classList.remove("border-0");
      e.classList.add("border-2");
      e.classList.add("border-warning");
    }
  }else{
    document.getElementById(inputID).readOnly = false;
    document.getElementById(inputID).classList.remove("border-0");
    document.getElementById(inputID).classList.add("border-2")
    document.getElementById(inputID).classList.add("border-warning");
  }
}


function deleteProductRow(rowID) {
  document.getElementById(rowID).remove();
}


function updateRowNumbers() {
  let i = 1;
  for (e of document.getElementsByClassName("rowNumber")) {
    e.innerHTML = i;
    i++;
  }
}

function addEmptyProductRow(lastRow) {
  lastRow.remove();
  let i = document.getElementById("productList").children.length + 1;
  document.getElementById("productList").innerHTML += `
  <tr id="row${i}">
  <th scope="row" class="rowNumber">${i}</th>
  <td>
  <input id="product${i}" type="text" class="fs-6 text" value="" placeholder="z.B. Käse" style="border:0; background-color: white">
  </td>
  <td>
  <input id="price${i}" type="number" class="pricesForSum fs-6 text" value="" placeholder="z.B. 3,99" style="border:0; background-color: white">
  </td>
  <td>
      <button onclick="document.getElementById('product${i}').readOnly = true; document.getElementById('price${i}').readOnly = true; document.getElementById('product${i}').style.border = 'none'; document.getElementById('price${i}').style.border = 'none'; updateReceiptSum('pricesForSum');" type="button" class="btn btn-success btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
        <path d="M11 2H9v3h2z"/>
        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
        </svg>
      </button>
      <button onclick="document.getElementById('product${i}').readOnly = false;document.getElementById('price${i}').readOnly = false; document.getElementById('product${i}').style.border='2px solid gold'; document.getElementById('price${i}').style.border='2px solid gold';" type="button" class="btn btn-warning btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
      </button>
      <button onclick="deleteProductRow('row${i}'); updateRowNumbers(); updateReceiptSum('pricesForSum');" type="button" class="btn btn-danger btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
        </svg>
      </button>
    </td>
</tr>

<tr>
  <td>
  </td>
  <td>
  </td>
  <td>
  <button onclick="addEmptyProductRow(this.parentElement.parentElement)" type="button" class="btn btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg></button>
  </td>
  <td>
  </td>
</tr>`;
}

const formReceiptUpload = document.getElementById('uploadForm');

formReceiptUpload.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const response = await fetch('/upload', {
    method: 'POST',
    body: formData
  });
  const uploadResult = await response.json();

  document.getElementById('errorMessage').innerHTML = uploadResult.message;
  document.getElementById('receiptInfos').innerHTML = uploadResult.resultInfos;
  document.getElementById('productsTable').innerHTML = uploadResult.resultProducts;
  document.getElementById('loadingSpinner').style.display = "none";
  
  updateReceiptSum('pricesForSum');
});


const formReceiptSave = document.getElementById('receiptForm');

formReceiptSave.addEventListener('submit', async (event) => {   
  event.preventDefault();
  const formData = new FormData(event.target); 
  const response = await fetch('/saveReceiptToDatabase', {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
});