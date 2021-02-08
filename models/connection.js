
class connection {
    constructor() {
    }

    
    connection(file) {
        return {
            connectionId: file.connectionId,
            connectionHeading: file.connectionHeading,
            connectionName: file.connectionName,
            details: file.details,
            date: file.date,
            time: file.time,
            place: file.place,
            image: file.image,
            hostedBy: file.hostedBy,
            going: file.going
        };
    }

    
    setconnectionId(connectionId) {
        this.connectionId = connectionId;
    };

    getconnectionId() {
        return this.connectionId;
    };

    setname(name) {
        this.connectionName = name;
    };

    getname() {
        return this.connectionName;
    };

    setheading(heading) {
        this.connectionHeading = heading;
    };

    getheading() {
        return this.connectionHeading;
    };

    setdetails(details) {
        this.details = details;
    };

    getdetails() {
        return this.details;
    };

    settime(time) {
        this.time = time;
    };

    gettime() {
        return this.time;
    };

    setdate(date) {
        this.date = date;
    };

    getdate() {
        return this.date;
    };

    setplace(place) {
        this.place = place;
    };

    getplace() {
        return this.place;
    };

    sethostedBy(hostedBy) {
        this.hostedBy = hostedBy;
    };

    gethostedBy() {
        return this.hostedBy;
    };

    setimage(image) {
        this.image = image;
    };

    getimage() {
        return this.image;
    };

    setgoing(going) {
        this.going = going;
    };

    getgoing() {
        return this.going;
    };
}

module.exports = connection;
