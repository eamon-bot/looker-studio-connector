google.charts.load('current', {packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  google.script.run.withSuccessHandler(drawScatterChart).getSheetData();
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
    var phase = row[1];
    var taskName = row[2];
    var startMonth = parseInt(row[4]);
    var endMonth = parseInt(row[5]);
    var narrative = row[3];
    var collaborationPartner = row[6];
    var predecessor = row[7];

    var tooltip = '<div style="padding:5px;"><strong>Task Name:</strong> ' + taskName + '<br>' +
                  '<strong>Narrative:</strong> ' + (narrative || 'N/A') + '<br>' +
                  '<strong>Start Month:</strong> ' + startMonth + '<br>' +
                  '<strong>End Month:</strong> ' + endMonth + '<br>' +
                  '<strong>Collaboration Partner:</strong> ' + (collaborationPartner || 'N/A') + '<br>' +
                  '<strong>Predecessor:</strong> ' + (predecessor || 'N/A') + '</div>';
    
    var color = colors[phase] || 'color: gray;';
    var teamValue = teamMapping[team];

    dataTable.addRows([
      [startMonth, teamValue, tooltip, color, endMonth, teamValue]
    ]);
  }

  // Add rows for all teams to ensure they appear on the y-axis
  for (var team in teamMapping) {
    dataTable.addRows([
      [null, teamMapping[team], null, null, null, teamMapping[team]]
    ]);
  }

  var view = new google.visualization.DataView(dataTable);
  view.setColumns([0, 1, 2, 3]);

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
  chart.draw(view, options);

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
