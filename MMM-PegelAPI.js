Module.register("MMM-PegelAPI", {
  defaults: {    
    updateInterval: 600000,
    pegelName: {
      "a6ee8177-107b-47dd-bcfd-30960ccc6e9c": "Köln"      
    },    
  },

  getStyles: function () {
    return ["pegel.css"];
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
      this.letzterPegel1 = data[data.length-1]['value'];
      this.letzterPegel2 = data[data.length-5]['value'];
      this.letzterPegel3 = data[data.length-9]['value'];
      this.letzterPegel4 = data[data.length-13]['value'];
      this.letzterPegel5 = data[data.length-17]['value'];
      this.letzterPegelTime1 = data[data.length-1]['timestamp'];      
      const formattedUtc = this.letzterPegelTime1.split(' ').join('T');
      let date = new Date(formattedUtc);
      if (date.toString() === "Invalid Date")
        return "N/A";      
      let timeString = date.toLocaleTimeString("de-DE", {hour: 'numeric', minute: 'numeric', hour12: false});
      let formattedDate = timeString;
      this.letzterPegelTime1 = formattedDate;      

      this.letzterPegelTime2 = data[data.length-5]['timestamp'];      
      const formattedUtc2 = this.letzterPegelTime2.split(' ').join('T');
      let date2 = new Date(formattedUtc2);
      if (date2.toString() === "Invalid Date")
        return "N/A";      
      let timeString2 = date2.toLocaleTimeString("de-DE", {hour: 'numeric', minute: 'numeric', hour12: false});
      let formattedDate2 = timeString2;
      this.letzterPegelTime2 = formattedDate2;

      this.letzterPegelTime3 = data[data.length-9]['timestamp'];      
      const formattedUtc3 = this.letzterPegelTime3.split(' ').join('T');
      let date3 = new Date(formattedUtc3);
      if (date3.toString() === "Invalid Date")
        return "N/A";      
      let timeString3 = date3.toLocaleTimeString("de-DE", {hour: 'numeric', minute: 'numeric', hour12: false});
      let formattedDate3 = timeString3;
      this.letzterPegelTime3 = formattedDate3;

      this.letzterPegelTime4 = data[data.length-13]['timestamp'];      
      const formattedUtc4 = this.letzterPegelTime4.split(' ').join('T');
      let date4 = new Date(formattedUtc4);
      if (date4.toString() === "Invalid Date")
        return "N/A";      
      let timeString4 = date4.toLocaleTimeString("de-DE", {hour: 'numeric', minute: 'numeric', hour12: false});
      let formattedDate4 = timeString4;
      this.letzterPegelTime4 = formattedDate4;      
      this.loaded = true;
      this.updateDom();
    } catch (error) {
      Log.error(`Fehler beim Abrufen der Daten von Pegel API: ${error}`);
    }
    try {
      const stationResponse = await fetch(this.stationurl);
      const data = await stationResponse.json();            
      this.stationName = data['longname'];     
      this.stationKm = data['km'];
      this.stationWater = data['water']['longname'];      
      this.loaded = true;
      this.updateDom();
    } catch (error) {
      Log.error(`Fehler beim Abrufen der Daten von Pegel API: ${error}`);
    }    
  },
  
  getHeader: function () {
    return "Meine Pegelstände in " + this.stationName + " am " + this.stationWater;
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
    var kmHeader = document.createElement("th");
    kmHeader.innerHTML = "Km";
    kmHeader.setAttribute("class", "km");
    headerRow.appendChild(kmHeader);    
    var timeHeader = document.createElement("th");
    timeHeader.innerHTML = "Uhrzeit";
    timeHeader.setAttribute("class", "time");
    headerRow.appendChild(timeHeader);
    var pegelHeader = document.createElement("th");
    pegelHeader.innerHTML = "Pegel";
    pegelHeader.setAttribute("class", "pegel");
    headerRow.appendChild(pegelHeader);
    wrapper.appendChild(headerRow);

    // 1 Data Row
    var row = document.createElement("tr");

     // Pegel Km
    var pegelKm = document.createElement("td");
    pegelKm.innerHTML = this.stationKm;
    pegelKm.setAttribute("class", "km");
    row.appendChild(pegelKm);

    // Pegel Time
    var pegelTime = document.createElement("td");
    pegelTime.innerHTML = this.letzterPegelTime1;
    pegelTime.setAttribute("class", "time");
    row.appendChild(pegelTime);
    
    // Pegel Height
    var pegelHeight = document.createElement("td");
    pegelHeight.innerHTML = this.letzterPegel1 <= this.letzterPegel2 ? this.letzterPegel1 + " cm 😊" : this.letzterPegel1 + " cm 😡";
    pegelHeight.style.color = this.letzterPegel1 < this.letzterPegel2 ? "green" : "red";
    pegelHeight.setAttribute("class", "pegel");
    row.appendChild(pegelHeight);

    wrapper.appendChild(row);

    // 2 Data Row
    var row = document.createElement("tr");   

     // Pegel Km
    var pegelKm = document.createElement("td");
    pegelKm.innerHTML = this.stationKm;
    pegelKm.setAttribute("class", "km");
    row.appendChild(pegelKm);

    // Pegel Time
    var pegelTime = document.createElement("td");
    pegelTime.innerHTML = this.letzterPegelTime2;
    pegelTime.setAttribute("class", "time");
    row.appendChild(pegelTime);
    
    // Pegel Height
    var pegelHeight = document.createElement("td");
    pegelHeight.innerHTML = this.letzterPegel2 <= this.letzterPegel3 ? this.letzterPegel2 + " cm 😊" : this.letzterPegel2 + " cm 😡";      
    pegelHeight.style.color = this.letzterPegel2 < this.letzterPegel3 ? "green" : "red";
    pegelHeight.setAttribute("class", "pegel");
    row.appendChild(pegelHeight);

    wrapper.appendChild(row);

    // 3 Data Row
    var row = document.createElement("tr");   

     // Pegel Km
    var pegelKm = document.createElement("td");
    pegelKm.innerHTML = this.stationKm;
    pegelKm.setAttribute("class", "km");
    row.appendChild(pegelKm);

    // Pegel Time
    var pegelTime = document.createElement("td");
    pegelTime.innerHTML = this.letzterPegelTime3;
    pegelTime.setAttribute("class", "time");
    row.appendChild(pegelTime);
    
    // Pegel Height
    var pegelHeight = document.createElement("td");
    pegelHeight.innerHTML = this.letzterPegel3 <= this.letzterPegel4 ? this.letzterPegel3 + " cm 😊" : this.letzterPegel3 + " cm 😡";      
    pegelHeight.style.color = this.letzterPegel3 < this.letzterPegel4 ? "green" : "red";
    pegelHeight.setAttribute("class", "pegel");
    row.appendChild(pegelHeight);

    wrapper.appendChild(row);

    // 4 Data Row
    var row = document.createElement("tr");

     // Pegel Km
    var pegelKm = document.createElement("td");
    pegelKm.innerHTML = this.stationKm;
    pegelKm.setAttribute("class", "km");
    row.appendChild(pegelKm);

    // Pegel Time
    var pegelTime = document.createElement("td");
    pegelTime.innerHTML = this.letzterPegelTime4;
    pegelTime.setAttribute("class", "time");
    row.appendChild(pegelTime);
    
    // Pegel Height
    var pegelHeight = document.createElement("td");
    pegelHeight.innerHTML = this.letzterPegel4 <= this.letzterPegel5 ? this.letzterPegel4 + " cm 😊" : this.letzterPegel4 + " cm 😡";      
    pegelHeight.style.color = this.letzterPegel4 < this.letzterPegel5 ? "green" : "red";
    pegelHeight.setAttribute("class", "pegel");
    row.appendChild(pegelHeight);

    wrapper.appendChild(row);    
    return wrapper;
  }
});
