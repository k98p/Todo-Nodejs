localStorage.setItem("token", 0)

function signup(frm){
    if (frm.userId.value.length === 0 || frm.password.value.length === 0){
		alert("Username or Password field cannot be empty");
	}
	else{
		//var docu_list = document.getElementById('listdiv')
		fetch('http://localhost:3000/data/users/signup' , {
			method: 'POST',
			body: JSON.stringify({
				"userId": frm.userId.value,
				"password": frm.password.value
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
        }).then(res=>res.text())
            .then(data=>{
                if (data==="User exists!"){
                    alert("User already exists. Use another UserID")
                }
                else{
                    alert("User added to the database successfully")
                }
            })
	}
}

function login(frm){
    if (frm.userId.value.length === 0 || frm.password.value.length === 0){
		alert("Username or Password field cannot be empty");
	}
	else{
		//var docu_list = document.getElementById('listdiv')
		fetch('http://localhost:3000/data/users/login',{
			method: 'POST',
			body: JSON.stringify({
				"userId": frm.userId.value,
				"password": frm.password.value
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		}).then(res=>{
            if (res.status===403){
                alert('UserId does not exist. Please check.')
            }
            else{
                return res.json()
            }
        })
		  .then((data)=>{
                console.log(data)    
			  	if (data.token===null){
                    alert("You've entered a wrong password. Please check.")
                }
                else{
                    localStorage.setItem("token", data.token)
                    alert("You've successfully logged in! Redirecting you to your space")
                    setTimeout(window.location = "./todo.html", 3000);  
                }
			})
	}
}