export class DateLogicHandler {
    minDate;
    maxDate;
    currDate = new Date();
    constructor() {
        this.minDate = new Date(1900, 0, 1);
        this.maxDate = new Date(Date.now());
    }
    static randRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; //inclusive of both
    }
    static dateString(_date) {
        // Tuesday 10 June 2025
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = weekdays[_date.getDay()];
        const date = _date.getDate();
        const month = monthsShort[_date.getMonth()];
        const year = _date.getFullYear();
        return `${day}, ${date} ${month} ${year}`;
    }
    updateDates(birthDateIs) {
        // birthdate is higher or lower than randomly choosen date between mindate and maxdate
        switch (birthDateIs) {
            case ("later"): {
                //birthday is higher than random date
                this.minDate = this.currDate;
                break;
            }
            case ("earlier"): {
                //birthday is lower than random date
                this.maxDate = this.currDate;
                break;
            }
        }
    }
    randomDate() {
        const minTs = this.minDate.getTime();
        const maxTs = this.maxDate.getTime();
        const randTs = DateLogicHandler.randRange(minTs, maxTs);
        if (this.currDate.getTime() === randTs) {
            return this.randomDate();
        }
        this.currDate = new Date(randTs);
        return this.currDate;
    }
}
/**@d1vij */
