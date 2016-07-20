
	var api = 'https://hydrosurvey.herokuapp.com/todos';

  var number_of_iPads=5;


	function URLIdea(){
		var name=window.location.hash.slice(1);
		var num=name.slice(0,1);
		var device=name.slice(1);
		var label;
		switch(Number(num)){
      case 0:
        label="submitting data";
        break;
			case 1:
				label="19-24";
				break;
			case 2:
				label="25-54";
				break;
			case 3:
				label="55-75";
				break;
			case 4:
				label="75+";
				break;
			case 5:
				label="abstained";
				break;
/*			case 1:
				label="9 and under";
				break;
			case 2:
				label="10-14";
				break;
			case 3:
				label="15-19";
				break;
			case 4:
				label="20-69";
				break;
			case 5:
				label="70+";
				break;
			case 6:
				label="abstained";
				break;
*/			default:
				label=window.location;
				device="-1";
				databaseOpen().then(synchronize);
				break;
		}
		var d=new Date();
		var x=
			Number(
			("00"+(d.getMonth()+1)).slice(-2)
			+("00"+d.getDate()).slice(-2)
			+d.getFullYear()
			)+";"+Number(
			("00"+d.getHours()).slice(-2)
			+("00"+d.getMinutes()).slice(-2)
			+("00"+d.getSeconds()).slice(-2));
		var todo = { text: String(label), _id: String(x), owner:Number(device) };
		//if submitting, don't add but sync
		if(label=="submitting data"){ databaseOpen().then(synchronize);
		}
		//otherwise add but don't sync
		else databaseOpen().then(databaseTodosPut(todo));
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

  function databaseTodosGet(query) {
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
//        console.log(result.value._id);
		  if (!query || (query.deleted === true && result.value.deleted) || (query.deleted === false && !result.value.deleted)) {
            data.push(result.value);
          }
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
      var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
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
    return databaseTodosGet({deleted:false}).then(renderAllTodos);
  }
  
  function renderAllTodos(todos){
    var html='';
    var i=0;
    for(i=0;i<number_of_iPads;i++){
      html+='<ul><li>FOCOS Tablet '+(i+1)+'<li>= = = = = = = = = = = =</li><li>';
    	html+=renderAllColTodos(todos,i+1);
    	html+='</ul>';
    }
    ul.innerHTML=html;
  }
  
  function renderAllColTodos(todos,num) {
    var html = 'Date;Time;Age Range</li><li>= = = = = = = = = = = = = =</li><li>';
    
    todos.forEach(function(todo) {
  	if(num==todo.owner)
      html += todoToHtml(todo,num);
    });
	return html;
  }

  function flagAllTodos(todos) {
    todos.forEach(function(todo) {
      todo.deleted=true;
      return databaseTodosPut(todo);
    });
  }

  function todoToHtml(todo,num) {
      return '<li>'+todo._id+';'+todo.text+'</li>';
  }
  
  function dlete(){
    if(confirm("Warning: This will permanently delete all entries on this page.\nOnly confirm if you have copied the values elsewhere already.")){
databaseTodosGet({deleted:false}).then(flagAllTodos).then(synchronize()).then(refreshView);
    }
  }
  
  function databaseTodosDelete(todo) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['todo'], 'readwrite');
      var store = transaction.objectStore('todo');
      var request = store.delete(todo._id);
      transaction.oncomplete = resolve;
      request.onerror = reject;
    });
  }

  function serverTodosGet(_id) {
    return fetch(api + '/' + (_id ? _id : ''))
      .then(function(response) {
        return response.json();
      });
  }

  function serverTodosPost(todo) {
    return fetch(api, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
      })
        .then(function(response) {
          if (response.status === 410) throw new Error(response.statusText);
      return response;
    });
  }

  function serverTodosDelete(todo) {
    return fetch(api + '/' + todo._id, { method: 'delete' })
  }

  function synchronize() {
    return Promise.all([serverTodosGet(), databaseTodosGet()])
      .then(function(results) {
        var promises = [];
        var remoteTodos = results[0];
        var localTodos = results[1];

        // Loop through local todos and if they haven't been
        // posted to the server, post them.
        promises = promises.concat(localTodos.map(function(todo) {
          var deleteTodo = function() {
            return databaseTodosDelete(todo);
          };

          // Has it been marked for deletion?
		  /// NEW CONDITION - MUST BE 2 WEEKS OLD TO DELETE
          if (todo.deleted) {
            return serverTodosDelete(todo).then(deleteTodo, function(res) {
              if (err.message === "Gone") return deleteTodo();
            });
          }

          // If this is a todo that doesn't exist on the server try to create
          // it (if it fails because it's gone, delete it locally)
          if (!arrayContainsTodo(remoteTodos, todo)) {
            return serverTodosPost(todo)
              .catch(function(err) {
                if (err.message === "Gone") return deleteTodo(todo);
              });
          }
		  
		  /// NEW CONDITION - IF DELETED BUT IN SERVER, SET SERVER TO DELETED
		  if (arrayContainsTodo(remoteTodos, todo) && getArrayTodo(remoteTodos,todo).deleted!=true && todo.deleted) {
			/// POST MODIFIED TODO TO SERVER WITH DELETED TAG
            return serverTodosPost(todo)
              .catch(function(err) {
                if (err.message === "Gone") return deleteTodo(todo);
              });
		  }
        }));

        // Go through the todos that came down from the server,
        // we don't already have one, add it to the local db
		/// NEW CONDITION - MUST NOT BE SET AS DELETED IN SERVER - DONE
        promises = promises.concat(remoteTodos.map(function(todo) {
          if (!arrayContainsTodo(localTodos, todo) && !todo.deleted) {
            return databaseTodosPut(todo);
          }
        }));
        return Promise.all(promises);
    }, function(err) {
      console.error(err, "Cannot connect to server");
    });
//    .then(refreshView);
  }

  function getArrayTodo(array, todo) {
    for (var i = 0; i < array.length; i++) {
       if(array[i]._id === todo._id) {
         return array[i];
       }
    };
    return todo;
  }
  function arrayContainsTodo(array, todo) {
    for (var i = 0; i < array.length; i++) {
       if(array[i]._id === todo._id) {
         return true;
       }
    };
    return false;
  }

//}());
