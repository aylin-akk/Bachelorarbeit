const canvasBarchart = document.getElementById('myBarChart');
const canvasPiechart = document.getElementById('myPieChart');
const canvasLineChart = document.getElementById('myLineChart');

//Ermöglicht bei jedem Aufruf erneute generierung des Charts um aktuelle Charts auszugeben 
function checkChartForDestroy(chart){
  if (chart == undefined) {
    
  } else {
    chart.destroy();
  }
}



//Objekt worin die Analyseergebnisse gespeichert werden
//Key: Jahr, Value: Array mit Ausgaben für jeden Monat
let analysisObj = {};

//Array, worin die Objekte für den Datensatz für die Analyse gespeichert wird
let resDataset = [];

function prepareDataForBarchart() {
  analysisObj = {};
  //Datensatz für die jährlichen Monatsausgaben wird generiert
  for (receipt of globalReceiptsDB) {
    if (analysisObj[new Date(receipt.date).getFullYear().toString()]) {
      analysisObj[new Date(receipt.date).getFullYear()][new Date(receipt.date).getMonth()] += receipt.sum;
    } else {
      analysisObj[new Date(receipt.date).getFullYear()] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      analysisObj[new Date(receipt.date).getFullYear()][new Date(receipt.date).getMonth()] += receipt.sum;
    }
  }

  resDataset = [];
  for (year of Object.keys(analysisObj)) {
    resDataset.push({
      label: `${year}`,
      data: analysisObj[year],
      borderWidth: 1
    })
  }
  generateBarchartForMonthlySpending("bar");
}

let myBarchart;


function generateBarchartForMonthlySpending(chartType) {

  checkChartForDestroy(myBarchart);

  //Erstellen eines Balkendiagramms für jährliche, monatliche Ausgaben
  myBarchart = new Chart(canvasBarchart, {
    type: chartType,
    data: {
      labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      datasets: resDataset,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'black'
          }
        },
        x: {
          beginAtZero: true,
          ticks: {
            color: 'black'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'black'
          }, backgroundColor: ['rgba(255, 99, 132, 0.2)']
        }
      },
    }
  });
}


//Datensatz für die meist gekauften Produkte wird generiert
function prepareDataForMostProducts() {
  let tempResult = {};
  for (product of globalReiceiptProductsDB) {
    if (tempResult[product.name]) {
      tempResult[product.name][0] += 1;
      tempResult[product.name][1] += product.price;
    } else {
      tempResult[product.name] = [1, 0];
      tempResult[product.name][1] += product.price;
    }
  }
  generateTableForBestSellingProducts(tempResult);
}


function generateTableForBestSellingProducts(tableContent) {
  for (element of Object.keys(tableContent)) {
    document.getElementById("mostProductsTableContent").innerHTML += `
  <tr>
    <td>
      ${element}
    </td>
    <td>
      ${tableContent[element][0]}
    </td>
    <td>
      ${tableContent[element][1].toFixed(2)}
    </td>
  </tr>`;
  }
  $(document).ready(function () {
    $('#mostProductsTable').DataTable();
  });
}

//globalReiceiptProductsDB = data.resultProducts;
//globalReceiptsDB = data.resultReceipts;
function prepareDataForPiechart() {
  analysisObj = {};

  for (receipt of globalReceiptsDB) {
    if (analysisObj[new Date(receipt.date).getFullYear().toString()]) {
      analysisObj[new Date(receipt.date).getFullYear()] += receipt.sum;
    } else {
      analysisObj[new Date(receipt.date).getFullYear()] = receipt.sum;
    }
  }
  

  let tempArrYearlySum = [];

  //Object.keys(analysisObj) = Jahre
  for (year of Object.keys(analysisObj)) {
    tempArrYearlySum.push(analysisObj[year]);
  }

  let tempBgColors = ['rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(155, 162, 16, 0.6)',
    'rgba(54, 25, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)'];
  let tempBorderColors = ['rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(155, 162, 235, 1)',
    'rgba(54, 25, 235, 1)',
    'rgba(255, 206, 86, 1)'];

  //tempBgColors.slice(0, tempArrYearlySum.length) = Anzahl der Elemete gleich Anzahl der vorhandenen Jahre
  generatePiechartForYearlySpending(Object.keys(analysisObj), tempArrYearlySum, tempBgColors.slice(0, tempArrYearlySum.length), tempBorderColors.slice(0, tempArrYearlySum.length));
}


let myPiechart;

function generatePiechartForYearlySpending(labelYears, yearlySums, bgColors, borderColors) {

  checkChartForDestroy(myPiechart);

  myPiechart = new Chart(canvasPiechart, {
    type: 'pie',
    data: {
      labels: labelYears,
      datasets: [{
        label: 'Jahresausgabe',
        data: yearlySums,
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    }
  });
}

function prepareDataForLineChart(){

  analysisObj = {};
  //JoinedData = Objekt mit receiptID, date, name und price
  for (product of globalJoinedDataDB) {
    if(analysisObj[product.name]){
      let tempObj ={};
      tempObj[product.date] = product.price;
      analysisObj[product.name].push(tempObj);
    }else{
      let tempObj ={};
      analysisObj[product.name] = [];
      tempObj[product.date] = product.price;
      analysisObj[product.name].push(tempObj);
    }
  }
  
  for (productName of Object.keys(analysisObj)) {
    if(productName != "Eigenmarke: Pfand"){
      document.getElementById("lineChartProductsList").innerHTML +=`<option value="${productName}">${productName}</option>`;
    }
  }
}

let myLinechart; 

function generateLineChartForPriceChange(product) {

  checkChartForDestroy(myLinechart);
  
  if(product != "default"){

      let tempLineChartArr = [];
    
      for (productPriceDate of analysisObj[product]) {
        if(productPriceDate[Object.keys(productPriceDate)] > 0){
          tempLineChartArr.push({x: Object.keys(productPriceDate)[0],y: productPriceDate[Object.keys(productPriceDate)]});
        }
        
      }
    
      myLinechart = new Chart(canvasLineChart, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Preisentwicklung',
                data: tempLineChartArr,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
              }
            }
    });
  }
}


function viewAnalysis(id) {
  for (element of document.getElementsByClassName("allCharts")) {
    element.style.display = "none";
  }
  document.getElementById(id).style.display = "block";

  if (id == "table") {
    prepareDataForMostProducts();
  } else if (id == "piechart") {

  }
}