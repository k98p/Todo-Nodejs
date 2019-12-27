const accesstoken_stored = localStorage.getItem("token");

function ClearStorage(){
    localStorage.removeItem("token")
}

fetch('http://localhost:3000/data/todos/', {
        method: 'GET',
        headers: {
            "authorization": `jwt ${accesstoken_stored}` 
        }
    })
	.then(res => res.json())
	.then(data => {
		//console.log(res);
		
		todos_list = document.getElementById("listdiv");
		data.forEach((todo)=>{
			todos_list.innerHTML = `<label class="container border border-primary mx-auto py-2 rounded-pill" id="label_${todo._id}" for="checkbox_${todo._id}">
						<input type='checkbox' id="checkbox_${todo._id}" name="checkbox_${todo._id}" onclick='check_func("${todo._id}")'>
							<span id="text_${todo._id}">${todo.title}</span>
						</input>
					</label><br>` + todos_list.innerHTML
			//console.log(typeof todo["completed"])
			if(todo["completed"]){
				//console.log("COMPLETED")
				//console.log(todo)
				document.getElementById(`text_${todo._id}`).setAttribute("style" , "text-decoration: line-through;");
				document.getElementById(`label_${todo._id}`).setAttribute("style", "border-color: #28a745 !important;")
				document.getElementById(`checkbox_${todo._id}`).checked = todo.completed;
			}
			else{
				//console.log("PENDING")
				//console.log(todo)
				document.getElementById(`text_${todo._id}`).setAttribute("style" , "text-decoration: none;");
				document.getElementById(`label_${todo._id}`).setAttribute("style", "border-color: #007bff !important;")
				document.getElementById(`checkbox_${todo._id}`).checked = false;
			}
		})

		
  	})

function check_func(n){
    console.log(n)
	var checkboxele = document.getElementById("checkbox_" + n)
	var textele = document.getElementById("text_" + n)
	var labelele = document.getElementById("label_" + n)
	fetch_url = 'http://localhost:3000/data/todos/' + n
	fetch(fetch_url,{
		method: 'PUT',
		headers: {
            "authorization": `jwt ${accesstoken_stored}`,
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify({
			"completed": checkboxele.checked
		})
	}).then(response=>{
		return response.json()
	}).then(data=>{
		if(data.completed){
			textele.setAttribute("style" , "text-decoration: line-through;");
			labelele.setAttribute("style", "border-color: #28a745 !important;")
		}
		else{
			textele.setAttribute("style" , "text-decoration: none;");
			labelele.setAttribute("style", "border-color: #007bff !important;")
		}
		console.log(data)
	}).catch(err=>{
		console.log(err)
		labelele.setAttribute("style", "border-color: #dc3545 !important;")
	})
}



function add_func(frm){
	if (frm.todo_title.value.length === 0){
		alert("Title field cannot be empty!");
	}
	else{
		var docu_list = document.getElementById('listdiv')
		fetch('http://localhost:3000/data/todos/',{
			method: 'POST',
			body: JSON.stringify({
				"title": frm.todo_title.value,
				"completed": false
			}),
			headers: {
                "authorization": `jwt ${accesstoken_stored}`,
				"Content-type": "application/json; charset=UTF-8"
			}
		}).then(res=>res.json())
		  .then((data)=>{
			  				docu_list.innerHTML = `<label class="container border border-primary mx-auto py-2 rounded-pill" id="label_${data._id}" for="checkbox_${data._id}">
														<input type='checkbox' id="checkbox_${data._id}" name="checkbox_${data._id}" onclick='check_func("${data._id}")'>
															<span id="text_${data._id}">${data.title}</span>
														</input>
													</label>` + docu_list.innerHTML;
            })
        frm.todo_title.value = ''
	}
}





