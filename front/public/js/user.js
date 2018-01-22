class User {

    constructor() {
        this.logout();
    }

    login(id, token) {
        this.loggedin = true;
        this.id = id;
        this.name = "Name Surname";
		this.token = token;
    }
    
    logout() {
        this.loggedin = false;
        this.id = -1;
        this.name = "";
		this.token = null;
    }

}

const user = new User();