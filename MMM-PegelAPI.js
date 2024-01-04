Module.register("MMM-PegelAPI", {
    defaults: {
        category: "Programming",
        fetchInterval: 10 * 1000
    },
    getStyles() {
        return [
            this.file('style.css')
        ]
    },
    pegel: null,
    notificationReceived(notification, payload, sender) {
        if (notification === 'MODULE_DOM_CREATED') {
            this.getPegel();
            setInterval(() => {
                this.getPegel()
            }, this.config.fetchInterval);
        }
    },
    getDom() {
        const wrapper = document.createElement("div");

        if(this.pegel === null) return wrapper;

        this.setupHTMLStructure(wrapper);

        return wrapper;
    },
    setupHTMLStructure(wrapper) {
        if (this.pegel.type === 'single') {

            const pegel = document.createElement("h1");
            pegel.className = "bright medium light fadeInPegel";
            pegel.innerHTML = this.pegel.pegel;
            wrapper.appendChild(pegel);

        } else if (this.pegel.type === 'twopart') {

            const setup = document.createElement("h1");
            setup.className = "bright medium light no-wrap fadeInPegel";
            setup.innerHTML = this.pegel.setup;
            wrapper.appendChild(setup);

            const punchline = document.createElement("h2");
            punchline.className = "bright small light fadeInPunchline";
            punchline.innerHTML = this.pegel.delivery;
            wrapper.appendChild(punchline);
        }
    },
    getPegel() {
        fetch(`https://pegelonline.wsv.de/webservices/rest-api/v2/stations/a6ee8177-107b-47dd-bcfd-30960ccc6e9c/W/measurements.json`).then((response) => {
            response.json().then((pegel) => {
                this.pegel = pegel;
                this.updateDom();
            });
        });
    }
});
