class user {
    constructor( User_id , First_Name , Last_Name , Email_Address , Country , State , City, Password){
        this.User_id = User_id;
        this.First_Name = First_Name;
        this.Last_Name = Last_Name;
        this.Email_Address = Email_Address;
        this.City = City;
        this.State = State;
        this.Country = Country;
        this.Password = Password;


    }

    getUserID(){
        return this.User_id;
    }

    setUserID(value){
        this.User_id= value;
    }

    getFirstName(){
        return this.First_Name;
    }

    setFirstName(value){
        this.First_Name= value;
    }

    getLastName(){
        return this.Last_Name;
    }

    setLastName(value){
        this.Last_Name= value;
    }

    getEmailAddress(){
        return this.Email_Address;
    }

    setEmailAddress(value){
        this.Email_Address= value;
    }

    getCountry(){
        return this.Country;
    }

    setCountry(value){
        this.Country= value;
    }

    getState(){
        return this.State;
    }

    setState(value){
        this.State= value;
    }

    getCity(){
        return this.City;
    }

    setCity(value){
        this.City= value;
    }

    getPassword(){
        return this.Password;
    }

    setPassword(value){
        this.Password= value;
    }

}


module.exports = user;