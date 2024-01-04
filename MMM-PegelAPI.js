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

  // Override start method
  start: function () {
    this.loaded = false;    
    this.url = `https://pegelonline.wsv.de/webservices/rest-api/v2/stations/${Object.keys(this.config.pegelName)}/W/measurements.json`;
    this.stationurl = `https://pegelonline.wsv.de/webservices/rest-api/v2/stations/${Object.keys(this.config.pegelName)}.json`;
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
      const formattedUtc = this.letzterPegelTime.split(' ').join('T');
      let date = new Date(formattedUtc);
      if (date.toString() === "Invalid Date")
        return "N/A";
      let dateString = date.toLocaleDateString("de-DE", {month: 'long', day: 'numeric', year: 'numeric'});
      let timeString = date.toLocaleTimeString("de-DE", {hour: 'numeric', minute: 'numeric', hour12: false});
      let formattedDate = dateString + " | " + timeString;
      this.letzterPegelTime = formattedDate;      
      this.loaded = true;
      this.updateDom();
    } catch (error) {
      Log.error(`Fehler beim Abrufen der Daten von Pegel API: ${error}`);
    };
    try {
      const stationResponse = await fetch(this.stationurl);
      const data = await stationResponse.json();            
      this.stationName = data['longname'];
      this.stationName = this.stationName.toLowerCase();
      this.stationName = `${this.stationName.charAt(0).toUpperCase()}${this.stationName.slice(1)}`
      this.stationKm = data['km'];
      this.stationWater = data['water']['longname'];
      this.stationWater = this.stationWater.toLowerCase();
      this.stationWater = `${this.stationWater.charAt(0).toUpperCase()}${this.stationWater.slice(1)}`;
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
    var waterNameHeader = document.createElement("th");
    waterNameHeader.innerHTML = "Fluss";
    headerRow.appendChild(waterNameHeader);
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
    pegelName.innerHTML = this.stationName;
    row.appendChild(pegelName);

    // Water Name
    var waterName = document.createElement("td");
    waterName.innerHTML = this.stationWater;
    
      
    
    row.appendChild(waterName);

     // Pegel Km
    var pegelKm = document.createElement("td");
    pegelKm.innerHTML = this.stationKm;
    row.appendChild(pegelKm);

    // Pegel Time
    var pegelTime = document.createElement("td");
    pegelTime.innerHTML = this.letzterPegelTime;
    row.appendChild(pegelTime);
    
    // Pegel Height
    var pegelHeight = document.createElement("td");
    pegelHeight.innerHTML = this.letzterPegel + " cm";
    row.appendChild(pegelHeight);

    wrapper.appendChild(row);

    return wrapper;
  }
});
