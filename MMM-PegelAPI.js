Module.register("MMM-PegelAPI", {
  defaults: {    
    updateInterval: 600000,
    pegelName: {
      "a6ee8177-107b-47dd-bcfd-30960ccc6e9c": "Köln"      
    },    
  },

  getStyles: function () {
    return ["style.css"];
  },

  // Override start method
  start: function () {
    this.loaded = false;
    this.prices = {};
    this.url = `https://pegelonline.wsv.de/webservices/rest-api/v2/stations/${Object.keys(this.config.pegelName)}/W/measurements.json`;
    this.getData();
    setInterval(() => {
      this.getData();
    }, this.config.updateInterval);
  },

  getData: async function () {
    try {
      const response = await fetch(this.url);
      const data = await response.json();            
      this.letzterPegel = data[data.length-1]['value'];
      this.letzterPegelTime = data[data.length-1]['timestamp'];
      this.loaded = true;
      this.updateDom();
    } catch (error) {
      Log.error(`Fehler beim Abrufen der Daten von Pegel API: ${error}`);
    }
  },

  getHeader: function () {
    return "Meine Pegelstände";
  },

  getDom: function () {
    var wrapper = document.createElement("table");
    wrapper.className = "small pegel-table";

    if (!this.loaded) {
      wrapper.innerHTML = "Lade Pegelstände...";
      wrapper.className = "dimmed light";
      return wrapper;
    }

    // Header Row
    var headerRow = document.createElement("tr");
    var stationNameHeader = document.createElement("th");
    stationNameHeader.innerHTML = "Ort";
    headerRow.appendChild(stationNameHeader);
    var kmHeader = document.createElement("th");
    kmHeader.innerHTML = "Km";
    headerRow.appendChild(kmHeader);
    var timeHeader = document.createElement("th");
    timeHeader.innerHTML = "Datum";
    headerRow.appendChild(timeHeader);
    var pegelHeader = document.createElement("th");
    pegelHeader.innerHTML = "Pegel";
    headerRow.appendChild(pegelHeader);
    wrapper.appendChild(headerRow);

    // Data Rows
    for (var pegel in this.pegel) {
      var pegelData = this.pegel[pegelId];
      var row = document.createElement("tr");

      // Station Name
      var stationName = document.createElement("td");
      stationName.innerHTML = this.config.pegelNames[pegelId];
      row.appendChild(pegelnName);

      // Status (open or closed)
      var status = document.createElement("td");
      status.innerHTML = stationData.status === "open" ? "geöffnet ✓" : "geschlossen ✗";
      status.style.color = stationData.status === "open" ? "green" : "red";
      row.appendChild(status);

      // Fuel Prices
     
      row.appendChild(pegelValue);
     

      wrapper.appendChild(row);
    }

    return wrapper;
  }
});
