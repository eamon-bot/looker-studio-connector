google.charts.load('current', {packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = getSheetData(); // Simulated data fetching
  drawScatterChart(data);
}

function getSheetData() {
  // Simulated data for demonstration purposes
  return [
    ['Team', 'Month', 'Tooltip', 'Style', 'End Month', 'Team'],
    ['ESC', -40, 'Task: A<br>Team: ESC<br>Phase: Campus Planning<br>Duration: 2 months<br>Start: -40<br>End: -38', 'color: blue;', -38, 'ESC'],
    ['FEP', -36, 'Task: B<br>Team: FEP<br>Phase: IFC<br>Duration: 1 month<br>Start: -36<br>End: -35', 'color: green;', -35, 'FEP'],
    ['DCC', -28, 'Task: C<br>Team: DCC<br>Phase: Draft IFC<br>Duration: 4 months<br>Start: -28<br>End: -24', 'color: cyan;', -24, 'DCC'],
    // Add more rows as needed for testing
  ];
}

function drawScatterChart(data) {
  var container = document.getElementById('chart_div');
  var dataTable = new google.visualization.DataTable();
  
  dataTable.addColumn('number', 'Month');
  dataTable.addColumn('number', 'Team');
  dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': {'html': true} });
  dataTable.addColumn({ type: 'string', role: 'style' });
  dataTable.addColumn('number', 'End Month');
  dataTable.addColumn('number', 'Team');

  var teams = ['ESC', 'FEP', 'DCC', 'DX', 'DCK', 'DCS', 'DCNICON', 'EXE', 'VDC', 'QCx', 'EHS', 'FIA', 'SG'];
  var teamMapping = {};
  for (var i = 0; i < teams.length; i++) {
    teamMapping[teams[i]] = i + 1;
  }

  var colors = {
    'Unspecified': 'color: purple;',
    'Campus Planning': 'color: blue;',
    'BOD': 'color: teal;',
    'Draft IFC': 'color: cyan;',
    'IFC': 'color: green;',
    'Shell Ready': 'color: lime;',
    'Fit Out': 'color: yellow;',
    'Detailed Design': 'color: orange;',
    'CLSD': 'color: red;'
  };

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var team = row[0];
    var month = row[1];
    var tooltip = row[2];
    var style = row[3];
    var endMonth = row[4];
    var teamValue = teamMapping[team];
    
    dataTable.addRows([
      [month, teamValue, tooltip, style, endMonth, teamValue]
    ]);
  }

  var options = {
    title: 'Task Timeline',
    hAxis: {
      title: 'Month',
      ticks: [{v: -40, f: '-40'}, {v: -30, f: '-30'}, {v: -20, f: '-20'}, {v: -10, f: '-10'}, {v: 0, f: '0'}],
      minValue: -45,
      maxValue: 5
    },
    vAxis: {
      title: 'Team',
      ticks: teams.map((team, index) => ({v: index + 1, f: team})),
    },
    legend: { position: 'none' }, // Hide the default legend
    tooltip: { isHtml: true },
    series: {
      0: { pointShape: 'circle' }
    }
  };

  var chart = new google.visualization.ScatterChart(container);
  chart.draw(dataTable, options);

  // Create and populate the legend
  var legendContainer = document.getElementById('legend_div');
  var legendHTML = '<h2>Phase</h2><ul>';
  for (var phase in colors) {
    legendHTML += '<li>' +
                  '<span style="background-color: ' + colors[phase].replace('color: ', '').replace(';', '') + ';"></span>' +
                  phase +
                  '</li>';
  }
  legendHTML += '</ul>';
  legendContainer.innerHTML = legendHTML;
}

