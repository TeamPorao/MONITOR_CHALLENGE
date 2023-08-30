document.addEventListener("DOMContentLoaded", function () {
  // Fetch data from the JSON file
  fetch('captured_data.json')
    .then(response => response.json())
    .then(data => createCharts(data));

  // Function to create charts
  function createCharts(data) {
    const ipSources = {};
    const packetCount = {};
    const protocolData = {};

    data.forEach(packet => {
      const ipSrc = packet._source.layers["ip.src"] ? packet._source.layers["ip.src"][0] : "Unknown";
      const protocol = packet._source.layers["_ws.col.Protocol"][0];
      const info = packet._source.layers["_ws.col.Info"][0];

      // Column chart data for IP sources
      ipSources[ipSrc] = (ipSources[ipSrc] || 0) + 1;

      // Packet count for different info
      packetCount[info] = (packetCount[info] || 0) + 1;

      // Protocol data for pie chart
      protocolData[protocol] = (protocolData[protocol] || 0) + 1;
    });

    // Create Column Chart for IP sources
    new Chart(document.getElementById("ipChart"), {
      type: 'bar',
      data: {
        labels: Object.keys(ipSources),
        datasets: [{
          label: 'IP Sources',
          data: Object.values(ipSources),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Create Column Chart for Packet Count
    new Chart(document.getElementById("packetCount"), {
      type: 'bar',
      data: {
        labels: Object.keys(packetCount),
        datasets: [{
          label: 'Packet Count',
          data: Object.values(packetCount),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Create Pie Chart for Protocol distribution
    new Chart(document.getElementById("protocolChart"), {
      type: 'pie',
      data: {
        labels: Object.keys(protocolData),
        datasets: [{
          data: Object.values(protocolData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            // Add more colors as needed
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            // Add more colors as needed
          ],
          borderWidth: 1
        }]
      }
    });
  }
});