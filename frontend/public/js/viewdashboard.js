var email = '';
var count =0;
var dbref = '';
var database = firebase.database()
var key = ""

window.addEventListener('load', function() {
    var urlString = window.location.href;
    var url = new URL(urlString);
    key = url.searchParams.get('key'); // getting the parameters out of the query 
    initApp()
    $('.dropdown-button').dropdown();
    var sign_out = document.getElementById('out');
    sign_out.onclick= SignOut ;

});
// initialisation of the checking the user status
initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        	var displayName = user.displayName;
            email = user.email;
            email = user.email.substring(0,email.lastIndexOf("@"))
    		    email = email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
          
            document.getElementById('zuser').innerHTML = displayName;
            document.getElementById('zuser1').innerHTML = displayName;
            retrive();
             $('.modal').modal();
        }
        else{
            window.location='index.html'
        }
      },function(error) {
        // logging the error have other options as well
    });
 }
function showMessage(){

    var name=firebase.auth().currentUser.displayName;
    Materialize.toast('Welcome to DashBoard Editor  '+name+" !", 4000)
    return;
}
function retrive() {
  
    firebase.database().ref("dashboard/"+email+'/'+key +'/queries' ).once('value', function(snap){
        snap.forEach(yourData);
        
        if(snap.val() == null)
        {
          $('.preloader-background').fadeOut('slow');
          $('.preloader-wrapper')
          .fadeOut();
          return
            // do something like logging error or designing the modal
        }
        
    });
}
function yourData(data)
{
  var object = data.val()
  var task_row = $('#query_list');
  var queries = object;
  var key   = data.key
  count = count+1
  var data = "";
  {
      data += '<tr id = "'+key+'">\
          <td>\
            <a class="friends-name black-text"><a> '+count+'</a></td>\
            <td>\
            <td>\
            <a class="friends-name black-text")">'+object.query+'</a></td>\
            <td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light blue" onclick = "ExecuteQuery(\''+key+'\')" ><i class="medium material-icons">create</i></button>\
            </td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light red" onclick = "DeleteQuery(\''+key+'\')" ><i class="medium material-icons">clear</i></button>\
            </td>\
          </tr>';
  }
  task_row.append(data)
  $('.preloader-background').fadeOut('slow');
    $('.preloader-wrapper')
        .fadeOut();
  $('.tap-target').tapTarget('open');
}
function  SignOut() {

    
    firebase.auth().signOut().then(function() {
        window.location = 'index.html';
    }).catch(function(error) {
        // An error happened.
    });
}

function addQuery()
{
	var query = document.getElementById('query')
	if(!query.checkValidity())
	{
		Materialize.toast("Please enter a Valid query",4000);

	}
	else{
		insertIntoDB(query);
    printLatestQuery(query,db_ref)

	}
}
function insertIntoDB(query){
	var taskObject = {
		query : query.value
	}
	db_ref=database.ref("dashboard/"+email+'/'+key +'/queries/').push().key;
	 database.ref('dashboard/'+email+'/'+key+'/queries'+"/"+db_ref).set(taskObject).then(function(){
        
        
         Materialize.toast('Task inserted successfully!!', 4000)
    }).catch(function(error){
        
        Materialize.toast('Task not inserted due to error!!', 4000)
    });
}
function printLatestQuery(query,key)
{
	query = query.value
  var task_row = $('#query_list');
  count = count+1
  var data = "";
  {
      data += '<tr id = "'+key+'">\
          <td>\
            <a class="friends-name black-text"><a> '+count+'</a></td>\
            <td>\
            <td>\
            <a class="friends-name black-text")">'+query+'</a></td>\
            <td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light blue" onclick = "ExecuteQuery(\''+key+'\')" ><i class="medium material-icons">create</i></button>\
            </td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light red" onclick = "DeleteQuery(\''+key+'\')" ><i class="medium material-icons">clear</i></button>\
            </td>\
          </tr>';
  }
  task_row.append(data)


}
function DeleteQuery(value)
{
	database.ref('dashboard/'+email+'/'+key+'/queries'+"/"+value).remove();
    var x = document.getElementById(value);
    x.style.display = "none";
}

function ExecuteQuery(value)
{
	var query =""
	var x = 'dashboard/'+email+'/'+key+'/queries'+"/"+value
	firebase.database().ref(x).once('value', function(snap){
        query =snap.val().query 
        window.location = "viewchart.html?dbref="+query+'&key=' +x;
    });
	
}
