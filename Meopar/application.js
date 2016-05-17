//(function() {
	var ul;
	databaseOpen().then(function() {
      ul = document.querySelector('ul');
    });
/*	 .then(function(){
      input[0] = document.querySelector('Age Range 1');
      input[1] = document.querySelector('Age Range 2');
      input[2] = document.querySelector('Age Range 3');
      input[3] = document.querySelector('Age Range 4');
      input[4] = document.querySelector('Age Range 5');
      input[5] = document.querySelector('Preferred not to say');
      document.body.addEventListener('Age Range 1', onSubmit);
      document.body.addEventListener('Age Range 2', onSubmit);
      document.body.addEventListener('Age Range 3', onSubmit);
      document.body.addEventListener('Age Range 4', onSubmit);
      document.body.addEventListener('Age Range 5', onSubmit);
      document.body.addEventListener('Preferred not to say', onSubmit);*/
//    });
		


	function onClick(label){
		var timestamp=Date();
		alert("Age range: \t"+label+"\nTime:        \t"+timestamp);
//		document.location.href="hydrocolor://";// this should be the URL of the hydrocolor app
		//if there is no URL, the following will close the page
		//window.open('','_self').close()
		var d=new Date();
		console.log(d);
		var x=
			Number(
			("00"+(d.getMonth()+1)).slice(-2)
			+("00"+d.getDate()).slice(-2)
			+d.getFullYear()
			)+";"+Number(
			("00"+d.getHours()).slice(-2)
			+("00"+d.getMinutes()).slice(-2)
			+("00"+d.getSeconds()).slice(-2));
		console.log(x);
		var todo = { text: String(label), _id: String(x) };
        databaseTodosPut(todo);
       /*   .then(function() {
            input.value = '';
          });*/
	}
	
  function databaseTodosPut(todo) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['todo'], 'readwrite');
      var store = transaction.objectStore('todo');
      var request = store.put(todo);
      transaction.oncomplete = resolve;
      request.onerror = reject;
    });
  }

  function databaseTodosGet() {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['todo'], 'readonly');
      var store = transaction.objectStore('todo');

      // Get everything in the store
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);

      // This fires once per row in the store, so for simplicity collect the data
      // in an array (data) and send it pass it in the resolve call in one go
      var data = [];
      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;

        // If there's data, add it to array
        if (result) {
        console.log(result.value._id);
          data.push(result.value);
          result.continue();

        // Reach the end of the data
        } else {
          resolve(data);
        }
      };
    });
  }

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 1;
      var request = indexedDB.open('todos', version);

      // Run migrations if necessary
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;
        db.createObjectStore('todo', { keyPath: '_id' });
      };

      request.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };
      request.onerror = reject;
    });
  }
  
  function refreshView() {
    return databaseTodosGet().then(renderAllTodos);
  }
  
  function renderAllTodos(todos) {
    var html = '<li>Date;Time;Age Range</li>';
    todos.forEach(function(todo) {
      html += todoToHtml(todo);
    });
    ul.innerHTML = html;
  }

  function todoToHtml(todo) {
    return '<li>'+todo._id+';'+todo.text+'</li>';
  }

//}());
