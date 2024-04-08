const { isValid, parse, isBefore, isEqual, getYear, format } = require('date-fns');

const saveButtonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy"
viewBox="0 0 16 16">
<path d="M11 2H9v3h2z" />
<path
  d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
</svg>`;
const editButtonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square"
viewBox="0 0 16 16">
<path
  d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
<path fill-rule="evenodd"
  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
</svg>`;
const deleteButtonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3"
viewBox="0 0 16 16">
<path
  d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
</svg>`;


async function extractReceiptData(ocrText) {

  const streetMatch = ocrText.match(/\b[A-Za-zäüßöÄÜÖ.-]{6,}[ ]+\d{1,3}-?\d{1,3}?[ ]*[A-Fa-f]?\b/);
  const locationMatch = ocrText.match(/\b(\d{5})[ ]+([A-Za-zäüßöÄÜÖ.-]{5,})\b/);
  const dateMatch = ocrText.match(/(\d{2})\.(\d{2})\.(\d{2})/);
  const timeMatch = ocrText.match(/\d{2}:\d{2}/);
  const productsPattern = /([A-ZÄÖÜäöüß].{2,})[ ]+(-?\d{1,3}([,.]\d{2}))/g;



  //überprüfen, ob die Ortsangaben im OCR-Text gefunden werden konnten, wenn nicht wird der 
  //Nutzer aufgefordert, die Informationen für die Ortsangabe manuell nachzutragen
  const aldiSuedLocation = (locationMatch && streetMatch) ? `
  <input name="location" class="location text-center border border-0" type="text" value="${streetMatch[0]}, ${locationMatch[0]}" readonly
  background-color: white;">` :
    (streetMatch) ? `
    <input name="location" type="text" class="location text-center border border-0" value="${streetMatch[0]}" readonly
  background-color: white">, 
  <input name="location2" class="location border border-2 border-danger text-center" type="text" placeholder="z.B. 40210 Düsseldorf" style="background-color: #FFD0C5">` :
      (locationMatch) ? `
    <input name="location" class="location border border-2 border-danger text-center" type="text" placeholder="z.B. Universitätsstraße 1" style="background-color: #FFD0C5">,
    <input name="location2" type="text" class="location text-center border border-0" value="${locationMatch[0]}" readonly background-color: white">` :
        !(locationMatch && streetMatch)`
  <input name="location" type="text" class="location border border-2 border-danger text-center" placeholder="z.B. Universitätsstraße 1"
  style="background-color: #FFD0C5">, 
  <input name="location2" class="location border border-2 border-danger text-center" type="text" placeholder="z.B. 40210 Düsseldorf" style="background-color: #FFD0C5">`;



  let receiptDate = '';
  if (dateMatch != null) {
    const today = new Date();
    const extractedDate = dateMatch[0];
    const dateFormat = "dd.MM.yy";
    const date = parse(extractedDate, dateFormat, new Date());
    //Überprüfen, ob das mit Tesseract extrahierte Datum nicht in der Zukunft liegt
    const isNotFuture = isBefore(date, today) || isEqual(date, today);
    const year = getYear(date);
    //Überprüfen, ob das mit Tesseract extrahierte Datum nicht vor dem Jahr 2020 liegt
    const isAfter2020 = year >= 2020;
    const dateForInput = format(date, 'yyyy-MM-dd');
    //überprüfen, ob das Einkaufsdatum im OCR-Text gefunden werden konnte bzw. ob das gefundene Datum valide ist
    //Wenn nicht wird der Nutzer aufgefordert, das Datum manuell nachzutragen
    receiptDate = (dateMatch && isValid(date) && isNotFuture && isAfter2020) ? `<input name="date" id="date" type="date" class="text-center border border-0" value="${dateForInput}"  style=" background-color: white;" readonly>` :
      `<input name="date" id="date" type="date" class="border border-2 border-danger text-center" style="background-color: #FFD0C5">`;
  } else {
    receiptDate = `<input name="date" id="date" type="date" class="border border-2 border-danger text-center" style="background-color: #FFD0C5">`;
  }


  let receiptTime = '';
  if (timeMatch != null) {
    const extractedTime = timeMatch[0];
    const timeFormat = "HH:mm";
    const referenceDate = new Date();
    const parsedTime = parse(extractedTime, timeFormat, referenceDate);
    //überprüfen, ob die Uhrzeit im OCR-Text gefunden werden konnte bzw. ob die gefundene Uhrzeit valide ist
    //Wenn nicht wird der Nutzer aufgefordert, die Uhrzeit manuell nachzutragen
    receiptTime = (timeMatch && isValid(parsedTime)) ? `<input name="time" id="time" class="text-center border border-0" type="text" value="${timeMatch[0]}" readonly style="background-color: white;"></input>` :
      `<input name="time" id="time" type="text" class="text-center border border-2 border-danger" placeholder= "z.B. 18:15" style="background-color: #FFD0C5">`;
  } else {
    receiptTime = `<input name="time" id="time" type="text" class="text-center border border-2 border-danger" placeholder= "z.B. 18:15" style="background-color: #FFD0C5">`;
  }


  const string1 = `
<tbody>
  <tr>
    <th scope="row" class="text-body fw-semibold">Discounter</th>
    <td class="fs-6 text text-center">
    <div class="row"> 
      <div class="col text-center"><h6>ALDI SÜD</h6></div>
      <div class="col-3 text-end"></div>
    </div>
    </td>
  </tr>
  <tr>
    <th scope="row" class="text-body fw-semibold">Filiale</th>
    <td>
    <div class="row"> 
      <div class="col text-center">${aldiSuedLocation}</div>
      <div class="col-3 text-end">
        <button onclick="saveChanges('location')" type="button" class="btn btn-success btn-sm">
          ${saveButtonIcon}
        </button>
        <button onclick="editRow('location');" type="button" class="btn btn-warning btn-sm">
          ${editButtonIcon}
        </button>
      </div>
      </div>
    </td>

  </tr>
  <tr>
    <th scope="row" class="text-body fw-semibold">Datum</th>
    <td>
    <div class="row"> 
      <div class="col text-center">${receiptDate}</div>
      <div class="col-3 text-end">
        <button onclick="saveChanges('date')" type="button" class="btn btn-success btn-sm">
        ${saveButtonIcon}
        </button>
        <button onclick="editRow('date');" type="button" class="btn btn-warning btn-sm">
        ${editButtonIcon}
        </button>
      </div>
      </div>
    </td>
  </tr>
  <tr>
    <th scope="row" class="text-body fw-semibold">Uhrzeit</th>
    <td colspan="2">
    <div class="row"> 
      <div class="col text-center">${receiptTime}</div>
      <div class="col-3 text-end">
        <button onclick="saveChanges('time')" type="button" class="btn btn-success btn-sm">
        ${saveButtonIcon}
        </button>
        <button onclick="editRow('time');" type="button" class="btn btn-warning btn-sm">
        ${editButtonIcon}
        </button>
      </div>
      </div>
    </td>
  </tr>
</tbody>`;

  let i = 1;

  let productsHTML = `<thead>
  <tr class="table-dark">
    <th scope="col" class="text-light fw-light">Artikel</th>
    <th scope="col" class="text-light fw-light">Artikelbeschreibung</th>
    <th scope="col" class="text-light fw-light">Preis</th>
    <th scope="col" class="text-light fw-light"></th>
  </tr>
</thead>
<tbody id="productList">`;

  let priceListForSum = [];
  let match;
  let sumMatch = ocrText.match(/(S+u(m|n)+e)/gi);
  if (sumMatch == null) {
    sumMatch = "";
  }

  while ((match = productsPattern.exec(ocrText)) !== null) {
    console.log(match[1], sumMatch[0])
    if (!(match[1].includes(sumMatch[0]))) {
      priceListForSum.push(match[2].replace(',', '.'));
      productsHTML += `
      <tr id="row${i}">
      <th scope="row" class="rowNumber">${i}</th>
      <td>
        <input name="product${i}" id="product${i}" type="text" class="fs-6 border border-0 text" value="${match[1].trim()}" readonly
          style="background-color: white">
      </td>
      <td>
        <input name="price${i}" id="price${i}" type="number" class="fs-6 border border-0 text pricesForSum" value="${match[2].replace(',', '.')}" readonly
          style="background-color: white">
      </td>
      <td>
        <button onclick="saveChanges('product${i}'); saveChanges('price${i}'); updateReceiptSum('pricesForSum');" type="button"
          class="btn btn-success btn-sm">
          ${saveButtonIcon}
        </button>
        <button onclick="editRow('product${i}'); editRow('price${i}');" type="button" class="btn btn-warning btn-sm">
        ${editButtonIcon}
        </button>
        <button onclick="deleteProductRow('row${i}'); updateRowNumbers(); updateReceiptSum('pricesForSum');" type="button" class="btn btn-danger btn-sm">
        ${deleteButtonIcon}
        </button>
      </td>
    </tr>
    `
      i++;
    }
  }


  let totalSumMatch = ocrText.match(/\b(Su(m|n)*m*e)[ ]+(-?\d{1,3}(,\d{2}))\b/i);
  let sum = 0;
  let receiptSum;

  if (totalSumMatch) {
    for (const itemPrice of priceListForSum) {
      let cent = convertEurotoCent(itemPrice);
      sum += cent;
    }
    let sumMatchinCent = convertEurotoCent(totalSumMatch[3]);

    if ((sum / 100) == (sumMatchinCent / 100)) {
      receiptSum = sumMatchinCent / 100;
    }
  }


  function convertEurotoCent(euroValue) {
    euroValue = euroValue.replace(',', '.');
    let valueInFloat = parseFloat(euroValue);
    let cent = Math.round(valueInFloat * 100);
    return cent;
  }


  productsHTML += `<tr>
  <td>
  </td>
  <td>
  </td>
  <td>
    <button onclick="addEmptyProductRow(this.parentElement.parentElement)" type="button"
      class="btn btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        class="bi bi-plus" viewBox="0 0 16 16">
        <path
          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
      </svg></button>
  </td>
  <td>
  </td>
</tr>
</tbody>
<tfoot>
<tr class="table-dark">
<td><h5>Summe</h5></td>
<td></td>
<td> <input class="border border-0 bg-dark text-light" name="receiptSum" id="receiptSum" value="${(receiptSum == undefined ? '' : receiptSum)}" readonly></td>
<td><button type="submit" class="btn btn-primary btn-sm">Kassenbon speichern
</button></td>
</tr>
</tfoot>`;

  return { products: productsHTML, infos: string1 };
}

module.exports = extractReceiptData;