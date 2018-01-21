class User {

    constructor() {
        this.login(2);
    }

    login(id) {
        this.loggedin = true;
        this.id = id;
        this.name = "Name Surname";
		this.token = null;
    }
    
    logout() {
        this.loggedin = false;
        this.id = -1;
        this.name = "";
    }

}

const user = new User();