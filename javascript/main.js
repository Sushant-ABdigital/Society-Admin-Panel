$(window).on('load', function(){
  $('.pro-bar').each(function(){
    $(this).find('.pro-bar-frontside').css("width", $(this).attr('data-percent'));
    $(this).find('.pro-bar-frontside').addClass('grow');
  });
});

//Google Chart Script
// google.charts.load('current', {packages: ['corechart']});
// google.charts.setOnLoadCallback(drawCharts);
// function drawCharts() {
// var pieData = google.visualization.arrayToDataTable([
// ['Items', 'Amount'],
// ['Fixed Assets',      10000],
// ['Investments',   40000],
// ['Current Assets',   30000],
// ['Reserve Funds',    10000],
// ['Deficit / Surplus',  4000],
// ['Current Liabilities',  6000]
// ]);
// var pieOptions = {
// backgroundColor: 'transparent',
// pieHole: 0.5,
// slices: [{
// offset: '0.1'
// }],
// colors: [ "#ee99fd", 
//     "#949ed5", 
//     "#fd6e6e", 
//     "#e6ddda", 
//     "#fdcf57", 
//     "#51b8ae"
//    ],
// pieSliceText: 'percentage',
// tooltip: {
// text: 'value',
// trigger: 'selection'
// },
// fontName: 'Open Sans',
// chartArea: {
// width: '80%',
// height: '80%'
// },
// legend: {
// position: 'labeled',
// alignment: 'center',
// textStyle: {
// fontSize: 13,
// }
// }
// };
// var pieChart = new google.visualization.PieChart(document.getElementById('pie-chart'));
// pieChart.draw(pieData, pieOptions);
// }

google.charts.load('current', {
  packages: ['controls', 'corechart']
}).then(function () {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Name');
  data.addColumn('number', 'Donuts eaten');
  data.addRows([
    ['Fixed Assets' , 28000],
    ['Investments', 8000],
    ['Current Assets', 10000],
    ['Reserve Funds', 12000],
    ['Deficit/Surplus', 22000],
    ['Current Liabilities', 20000]
  ]);
  var dashboard = new google.visualization.Dashboard(
    document.getElementById('dashboard_div')
  );

  var donutRangeSlider = new google.visualization.ControlWrapper({
    controlType: 'NumberRangeFilter',
    containerId: 'filter_div',
    options: {
      filterColumnLabel: 'Donuts eaten'
    }
  });

  var pieChart = new google.visualization.ChartWrapper({
    chartType: 'PieChart',
    containerId: 'chart_div',
    options: {
      title: 'Balance Sheet',
      width: 240,
      height: 220,
      pieSliceText: 'percentage',
      legend: 'none',
      slices: [{
        offset: '0.1'
        }],
      tooltip: { trigger: 'selection' }, 
      chartArea: {'width': '100%', 'height': '90%'},
      colors: [
        "#ee99fd",
        "#949ed5",
        "#fd6e6e",
        "#e6ddda",
        "#fdcf57",
        "#51b8ae"
      ],
      pieHole: 0.4
    }
  });

  function addLegendMarker(markerProps) {
    var legendMarker = document.getElementById('template-legend-marker').innerHTML;
    for (var handle in markerProps) {
      if (markerProps.hasOwnProperty(handle)) {
        legendMarker = legendMarker.replace('{{' + handle + '}}', markerProps[handle]);
      }
    }
    document.getElementById('legend_div').insertAdjacentHTML('beforeEnd', legendMarker);
  }
  google.visualization.events.addListener(pieChart, 'ready', function () {
    var legend = document.getElementById('legend_div');
    legend.innerHTML = '';
    // use filtered data table from piechart
    for (var i = 0; i < pieChart.getDataTable().getNumberOfRows(); i++) {
      var markerProps = {};
      markerProps.index = i;
      markerProps.color = pieChart.getOption('colors')[i];
      markerProps.label = pieChart.getDataTable().getValue(i, 0);
      markerProps.value = pieChart.getDataTable().getValue(i, 1);
      console.log(markerProps);
      addLegendMarker(markerProps);
    }
    // add legend hover
    var markers = legend.getElementsByTagName('DIV');
    Array.prototype.forEach.call(markers, function(marker) {
      marker.addEventListener('mouseover', function (e) {
        var marker = e.target || e.srcElement;
        if (marker.className !== 'legend-marker') {
          marker = marker.parentNode;
        }
        var rowIndex = parseInt(marker.getAttribute('data-rowIndex'));
        pieChart.getChart().setSelection([{row: rowIndex}]);
      }, false);
      marker.addEventListener('mouseout', function (e) {
        var marker = e.target || e.srcElement;
        if (marker.className !== 'legend-marker') {
          marker = marker.parentNode;
        }
        var rowIndex = parseInt(marker.getAttribute('data-rowIndex'));
        var selection = pieChart.getChart().getSelection();
        if (selection.length > 0) {
          if (selection[0].row === rowIndex) {
            pieChart.getChart().setSelection([]);
          }
        }
      }, false);
    });
  });

  dashboard.bind(donutRangeSlider, pieChart);
  dashboard.draw(data);
});