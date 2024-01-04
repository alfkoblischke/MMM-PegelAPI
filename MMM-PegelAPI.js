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
    this.url = `https://pegelonline.wsv.de/webservices/rest-api/v2/stations/${Object.keys(this.config.pegelName)}/W/measurements.json`;
    this.stationurl = `https://pegelonline.wsv.de/webservices/rest-api/v2/stations/${Object.keys(this.config.pegelName)}.json`;
    this.getData();
    setInterval(() => {
      this.getData();
      this.getStationData();
    }, this.config.updateInterval);
  },

  getFormalDateTime: function (utcDate) {
    const formattedUtc = utcDate.split(' ').join('T');
    let date = new Date(formattedUtc);
    if (date.toString() === "Invalid Date")
      return "N/A";
    let dateString = date.toLocaleDateString("de-DE", {month: 'long', day: 'numeric', year: 'numeric'});
    let timeString = date.toLocaleTimeString("de-DE", {hour: 'numeric', minute: 'numeric', hour12: false});
    let formattedDate = dateString + " | " + timeString;
    return formattedDate;
  },

  getData: async function () {
    try {
      const response = await fetch(this.url);
      const data = await response.json();            
      this.letzterPegel = data[data.length-1]['value'];
      this.letzterPegelTime = data[data.length-1]['timestamp'];
      console.log(this.letzterPegel);
      console.log(this.letzterPegelTime);
      this.loaded = true;
      this.updateDom();
    } catch (error) {
      Log.error(`Fehler beim Abrufen der Daten von Pegel API: ${error}`);
    }
  },

  getStationData: async function () {
    try {
      const stationResponse = await fetch(this.stationurl);
      const data = await stationResponse.json();            
      this.stationName = data['longname'];
      this.stationKm = data['km'];
      this.stationWater = data['water']['longname'];
      console.log(this.stationName);
      console.log(this.stationKm);
      console.log(this.stationWater);
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
    var row = document.createElement("tr");

    // Pegel Name
    var pegelName = document.createElement("td");
    pegelName.innerHTML = this.letzterPegel;
    row.appendChild(pegelName);

    // Status (open or closed)
    //var km = document.createElement("td");
    //status.innerHTML = stationData.km === "open" ? "geöffnet ✓" : "geschlossen ✗";
    //status.style.color = stationData.km === "open" ? "green" : "red";
    //row.appendChild(km);

    // Pegel Time
    var pegelTime = document.createElement("td");
    pegelTime.innerHTML = this.letzterPegelTime;
    row.appendChild(pegelTime);

    
     
    //row.appendChild(pegelValue);
     

    wrapper.appendChild(row);
    

    return wrapper;
  }
});
