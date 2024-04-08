const canvas = document.getElementById('myChart');

//Objekt worin die Analyseergebnisse gespeichert werden
//Key: Jahr, Value: Array mit Ausgaben für jeden Monat
let analysisObj = {};

//Array, worin die Objekte für den Datensatz für die Analyse gespeichert wird
let resDataset = [];

function prepareDataforBarchart() {
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

let myChart;


function generateBarchartForMonthlySpending(chartType) {
  
  //Erstellen eines Balkendiagramms für jährliche, monatliche Ausgaben
  myChart = new Chart(canvas, {
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
function prepareDataforMostProducts() {
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
  
  
  for (element of Object.keys(tempResult)) {
    document.getElementById("mostProductsTableContent").innerHTML += `
  <tr>
    <td>
      ${element}
    </td>
    <td>
      ${tempResult[element][0]}
    </td>
    <td>
      ${tempResult[element][1].toFixed(2)}
    </td>
  </tr>`;
  }
  $(document).ready(function() {
    $('#mostProductsTable').DataTable();
  });
}


function viewAnalysis(id) {
  for (element of document.getElementsByClassName("allCharts")) {
    element.style.display = "none";
  }
  document.getElementById(id).style.display = "block";
  
  if (id == "table") {
    prepareDataforMostProducts();
  } else if (id == "piechart") {

  }
}
