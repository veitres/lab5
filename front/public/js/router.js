class Route {
    constructor(url, handler) {
        this._url = url;
        this._handler = handler;
    }

    load(param,router) {
        document.getElementsByClassName("error")[0].innerHTML = "";
        const pages = document.getElementsByClassName("content__page");
        for(let p = 0; p < pages.length; p++) {
            pages[p].style.display = "none";
        }
        this._handler(param,router);
        if(this._url != "delete" && this._url != "logout") {
            document.getElementsByClassName("content__page_" + this._url)[0].style.display = "block";
        }      
    }
}

class Router {
    
    constructor(user) {
        this.handlers = [];
        this.addHandler("login", this.loginF);
        this.addHandler("spec", this.specF);
        this.addHandler("lk", this.lkF);
        this.addHandler("delete", this.deleteF);
        this.addHandler("nv", this.nvF);
		this.addHandler("logout", this.logoutF);

        this.listenLinks();

        let R;
        if (user.loggedin) {
            document.getElementsByClassName("nav_login")[0].style.display = "block";
            R = this.handlers.filter(function(urlObj) {
                return (urlObj._url == 'spec');
            })[0];
        } else {
            document.getElementsByClassName("nav_nologin")[0].style.display = "block";
            R = this.handlers.filter(function(urlObj) {
                return (urlObj._url == 'spec');
            })[0];
        }
  
        R.load();
    }

    addHandler(url, handler) {
        const H = new Route(url, handler);
		this.handlers.push(H);
    }

    listenLinks() {
        const _this =this;
        const links = document.getElementsByTagName('a');
        for(let i = 0; i < links.length; i++) {
            const url = links[i].getAttribute('href');
            let urlarr = url.split("/");
            links[i].addEventListener('click', event => {
                event.preventDefault();
                const R = this.handlers.filter(function(urlObj) {
                    return (urlObj._url == urlarr[0]);
                })[0];   
                R.load(urlarr,_this);
            });
        }
		const login_form = document.getElementById("login_form");
		login_form.addEventListener('submit', event => {
			event.preventDefault();
			const login = document.getElementsByClassName("login__input")[0].value;
			const pass = document.getElementsByClassName("login__input")[1].value;
			
			if (login != '') document.getElementsByClassName("login__input")[0].style.backgroundColor = "#ffffff";
			else document.getElementsByClassName("login__input")[0].style.backgroundColor = "#ffbbbb";
			
			if (pass != '') document.getElementsByClassName("login__input")[1].style.backgroundColor = "#ffffff";
			else document.getElementsByClassName("login__input")[1].style.backgroundColor = "#ffbbbb";
			
			
			api.requestData("authenticate", "POST", {login: login, password: pass})
				.then(function(response) {
					if (typeof(response.error) != 'undefined') {
						console.dir(response);
						user.logout();
						if (response.error == 'User with such login not found') {
							console.log("wrgUser");
							document.getElementsByClassName("login__input")[0].style.backgroundColor = "#ffbbbb";
						}
						
						if (response.error == 'Wrong password') {
							console.log("wrgPass");
							document.getElementsByClassName("login__input")[1].style.backgroundColor = "#ffbbbb";
						}
						
					} else {
						user.login(response.user, response.token);
						document.getElementsByClassName("nav_login")[0].style.display = "block";
						document.getElementsByClassName("nav_nologin")[0].style.display = "none";
						const R = _this.handlers.filter(function(urlObj) {
							return (urlObj._url == 'spec');
						})[0];
						R.load();
					}
				});
		});
    }

    loginF(param) {
       // console.log("login")
    }
	
	logoutF(param, router) {
		user.logout();
		document.getElementsByClassName("nav_login")[0].style.display = "none";
		document.getElementsByClassName("nav_nologin")[0].style.display = "block";
		const R = router.handlers.filter(function(urlObj) {
			return (urlObj._url == 'spec');
		})[0];
		R.load();
		// Request to logout function (on server)
		
	}

    nvF(param,router) {
        const place = document.getElementsByClassName("nv__content")[0];
        place.innerHTML = '';
        let selSpec = document.createElement("select");
        let optSpec = document.createElement("option");
        optSpec.text = "Выберите специализацию";
        optSpec.value = -1;
        selSpec.add(optSpec);
        
        place.appendChild(selSpec);

        let selDoc = document.createElement("select");
        selDoc.setAttribute("id", "seldoc");
        let optDoc = document.createElement("option");
        optDoc.text = "Выберите доктора";
        optDoc.value = -1;
        selDoc.add(optDoc);
        
        place.appendChild(selDoc);

        let selDate = document.createElement("select");
        let optDate = document.createElement("option");
        selDate.setAttribute("id", "seldate");
        optDate.text = "Выберите дату";
        optDate.value = -1;
        selDate.add(optDate);
        place.appendChild(selDate);

        let button = document.createElement("button");
        button.setAttribute("id", "selbutton");
        button.classList.add("btn");
        button.innerHTML = "Записаться";
        
        place.appendChild(button);

        api.requestData("specs?page=0&size=100", "GET")
		.then(function(response) {
            response.rows.forEach(function(item, index) {
                let optSpec = document.createElement("option");
                optSpec.text = item.spec;
                optSpec.value = item.id;
                selSpec.add(optSpec);
            }); 
        });

        selSpec.addEventListener("change", function() {
            const seldoc = document.getElementById("seldoc");
            const seldate = document.getElementById("seldate");
			
			//while (seldoc.firs
			
			
			/*const seldoclen = seldoc.options.length;
            for (let i = 1; i < seldoclen; i++) {
				//console.log(i, seldoc.options[i], seldoc.options);
				console.log("D");
				//seldoc.remove(i);
                seldoc.options[i] = null;
            }*/
			
			let children = seldoc.childNodes;
			let childrenAmnt = children.length;
			for (let i = childrenAmnt-1; i > 0; i--) {
				 seldoc.removeChild(children[i]);
            }
			
			children = seldate.childNodes;
			childrenAmnt = children.length;;
			for (let i = childrenAmnt-1; i > 0; i--) {
				 seldate.removeChild(children[i]);
            }
			
            if(selSpec.value != -1) {
                api.requestData("doctors?spec=" + selSpec.value + "&page=0&size=100", "GET")
				.then(function(response) {
					response.rows.forEach(function(item, index) {
                        let optDoc = document.createElement("option");
                        optDoc.text = item.fio;
                        optDoc.value = item.id;
                        seldoc.add(optDoc);
					});
				});
            }
        });
        const _this = router;
        button.addEventListener("click", function() {
            const seldate = document.getElementById("seldate");
            if(selDate.value != -1) {
                api.requestData("users/" + user.id + "/appointments?appointmentId=" + selDate.value, "PATCH")
				.then(function(response) {
					if (typeof (response.error) != 'undefined' && (response.error == 'TokenTTL' || response.error == 'TokenInactive' || response.error == 'TokenNotFound')){
						console.log('authFailed:'+response.error);
						return _this.logoutF(param, _this);
					}
					
					const R = _this.handlers.filter(function(urlObj) {
                        return (urlObj._url == "lk");
                    })[0];   
                    R.load(param,_this);
				});
            } else {
                alert("Заполните все поля!")
            }
        });

        selDoc.addEventListener("change", function() {
            const seldate = document.getElementById("seldate");
            for (let i = 1; i < seldate.options.length; i++) {
                seldate.options[i] = null;
            }
            if(selDoc.value != -1) {
                api.requestData("appointments?docId=" + selDoc.value + "&page=0&size=100", "GET")
				.then(function(response) {
					response.rows.forEach(function(item, index) {
                        let optDate = document.createElement("option");
                        let date = new Date(item.date * 1000);
						
						let time_part = item.date.split('T')[1].split('.')[0];
			   time_part = time_part.split(':')[0]+':'+time_part.split(':')[1];
			   
			   let date_part = item.date.split('T')[0];
			   date_part = date_part.split('-')[2]+'-'+date_part.split('-')[1]+'-'+date_part.split('-')[0];
			   
                        optDate.text = time_part+' '+date_part; // item.date;
                            // date.getDay() + "-" + 
                            // date.getMonth() + "-" + 
                            // date.getFullYear()  + " " +
                            // date.getHours()  + ":" +
                            // date.getMinutes();
                        optDate.value = item.id;
                        seldate.add(optDate);
					});
				});
            }
        });
        

    }
    
    deleteF(param,router) {
        const _this =router;
        api.requestData("users/" + user.id + "/appointments?appointmentId=" + param[2], "DELETE")
        .then(function(response) {
			if (typeof (response.error) != 'undefined' && (response.error == 'TokenTTL' || response.error == 'TokenInactive' || response.error == 'TokenNotFound')){
				console.log('authFailed:'+response.error);
				return _this.logoutF(param, _this);
			}
			
			const R = _this.handlers.filter(function(urlObj) {
                return (urlObj._url == "lk");
            })[0];   
            R.load(param,_this);
        });
    }

    lkF(param,router) {
		const _this =router;
        api.requestData("users/" + user.id, "GET")
		.then(function(response) {
            if (typeof (response.error) != 'undefined' && (response.error == 'TokenTTL' || response.error == 'TokenInactive' || response.error == 'TokenNotFound')){
				console.log('authFailed:'+response.error);
				return _this.logoutF(param, _this);
			}
			
			const name = document.getElementsByClassName("name")[0];
            name.innerHTML = response.fio;
        });
        
        api.requestData("users/" + user.id + "/appointments?page=0&size=100", "GET")
		.then(function(response) {
        //    console.log(response);
			if (typeof (response.error) != 'undefined' && (response.error == 'TokenTTL' || response.error == 'TokenInactive' || response.error == 'TokenNotFound')){
				console.log('authFailed:'+response.error);
				return _this.logoutF(param, _this);
			}

		   const place = document.getElementsByClassName("appointments__content")[0];
            place.innerHTML = "";
            response.rows.forEach(function(item, index){
                let data = document.createElement("ul");
                data.classList.add("app_list");

                let datali = document.createElement("li");
                datali.classList.add("app_list__item");
                
                let span1 = document.createElement("span");
                span1.classList.add("app_text");
                
                let date = new Date(item.date);
                
               // console.log(date);
			   let time_part = item.date.split('T')[1].split('.')[0];
			   time_part = time_part.split(':')[0]+':'+time_part.split(':')[1];
			   
			   let date_part = item.date.split('T')[0];
			   date_part = date_part.split('-')[2]+'-'+date_part.split('-')[1]+'-'+date_part.split('-')[0];
			   
                span1.innerHTML = time_part+' '+date_part;
				
				//item.date;
                    //date.getDay() + "-" + 
                    //date.getMonth() + "-" + 
                    //date.getFullYear()  + " " +
                    //date.getHours()  + ":" +
                    //date.getMinutes();
                datali.appendChild(span1);

                let span3 = document.createElement("span");
                span3.classList.add("app_text");
                span3.innerHTML = item.doc.fio;
                datali.appendChild(span3);

                let span2 = document.createElement("span");
                span2.classList.add("app_text");

                span2.innerHTML = item.doc.spec;
                datali.appendChild(span2);

                let spandel = document.createElement("span");
                spandel.classList.add("app_delete");
                let linkdel = document.createElement("a");
                linkdel.href = "delete/" + user.id + "/" + item.id;
                linkdel.innerHTML = "Отменить";

                const _this = router; 
                linkdel.addEventListener('click', event => { 
                    event.preventDefault(); 
                    const R = _this.handlers.filter(function(urlObj) { 
                        return (urlObj._url == "delete"); 
                })[0];
                param[2] = item.id;
                R.load(param,_this); });
                
                spandel.appendChild(linkdel);

                datali.appendChild(spandel);

                data.appendChild(datali);
                place.appendChild(data);
            });
		});
	}

    specF(param) {
        api.requestData("specs?page=0&size=100", "GET")
		.then(function(response) {
            const place = document.getElementsByClassName("content__page_spec")[0];
            place.innerHTML = "";
            let data = document.createElement("ul");
            data.classList.add("list");
			response.rows.forEach(function(item, index) {
                let tItem = document.createElement("li");
                tItem.classList.add("list__item");
				tItem.innerHTML = item.spec;
				let tDoc = document.createElement("ul");
				tDoc.classList.add("list_2");
				
				api.requestData("doctors?spec=" + item.id + "&page=0&size=100", "GET")
				.then(function(response) {
					response.rows.forEach(function(item, index) {
                        let tiDoc = document.createElement("li");
                        tiDoc.classList.add("list__item");
						tiDoc.innerHTML = item.fio;						
						tDoc.appendChild(tiDoc);
					});
					tItem.appendChild(tDoc);
				});
				
				data.appendChild(tItem);
			});
			place.appendChild(data);
		});
	}

}
const router = new Router(user);