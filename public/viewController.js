//Funktion, um den Inhalt im Frontend auszublenden
function changeContent(id) {
  for (const view of document.getElementsByClassName("views")) {
    view.style.display = 'none';
  }
  document.getElementById(id).style.display = 'block';
}


//Fetch-Anfrage, um Daten aus der Datenbank zu holen
async function getAllReceipts() {
  try {
    const response = await fetch('/getAllReceipts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json();
    
    document.getElementById('meineKassenbonsView').innerHTML = generateReceiptList(data);
    
  } catch (error) {
    console.error('Fehler:', error.message);
  }
}


const deleteButtonIcon =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3"
viewBox="0 0 16 16">
<path
  d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
</svg>`;

//Generiert Liste der hochgeladenen Kassenbons mit Datum, Uhrzeit und Summe fürs Frontend
function generateReceiptList(receiptsList) {
  
  let resultHTML = `<div class="row justify-content-center">
  <div class="col-11 col-lg-6 mt-3 text-center">
  <table class="table table-hover table-sm table-responsive" id="productsTable">
  <thead>
  <tr class="table-dark">
  <th scope="col" class="text-light fw-light">Datum</th>
  <th scope="col" class="text-light fw-light">Uhrzeit</th>
  <th scope="col" class="text-light fw-light">Summe</th>
  <th scope="col" class="text-light fw-light"></th>
  </tr>
      </thead>
      <tbody id="receiptList">`;
 
      for (const receipt of receiptsList) {
        resultHTML += `<tr>
        <td>
        ${receipt.date}
          </td>
          <td>
            ${receipt.time}
          </td>
          <td>
            ${receipt.sum}
          </td>
          <td>
          <button onclick="deleteReceipt(${receipt.receiptID});" type="button" class="btn btn-danger btn-sm">
            ${deleteButtonIcon}
          </button>
          </td>
        </tr>`;
  }
  resultHTML += `</tbody>
  </table>
  </div>
  </div>`

  return resultHTML;
}

let globalReceiptsDB;
let globalReiceiptProductsDB;
let globalJoinedDataDB;

//Holt Daten für Analysen aus der Datenbank
async function getAllDataForAnalysis() {
  try {
    const response = await fetch('/getAllDataForAnalysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json();
    globalReiceiptProductsDB = data.resultProducts;
    globalReceiptsDB = data.resultReceipts;
    globalJoinedDataDB = data.joinedTableData;
   
    prepareDataForBarchart();
    prepareDataForPiechart();
    prepareDataForLineChart();

    
  } catch (error) {
    console.error('Fehler:', error.message);
  }
}
