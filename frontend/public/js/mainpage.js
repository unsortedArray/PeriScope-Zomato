
var email = '';  // global variable to store the value of the current user
var count =0;   // value to be used in the table when displaying the dashboard
var dbref = ''; // global variable to store the reference of database
var database = firebase.database() // creating a reference to the firebase database

  // to display the add button

initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            var disp = 'Welcome ' + displayName;
            document.getElementById('zuser').innerHTML = disp;  // udpating the display name top bar
            document.getElementById('zuser1').innerHTML = disp; // updating the display name side nav
            user.getIdToken().then(function(accessToken) { // provides the new token if the token has expired
                addFirstTimeUser(); // if token not found add teh user
                email = user.email.substring(0,email.lastIndexOf("@"))
                email = email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
                retrieve();
                $('.modal').modal();
            });

        } else {
            window.location='index.html' // redirecting the unauthencticated user to the index page
        }
    }, function(error) {
        // logging the error can do something to store the logs
    });
};

window.addEventListener('load', function() {
    initApp()  
    
    var sign_out = document.getElementById('out');
    sign_out.onclick= SignOut ;

});
function  SignOut() {

    firebase.auth().signOut().then(function() {
        window.location = 'index.html';
    }).catch(function(error) {
        // An error happened.
    });
}
function showMessage(){

    var name=firebase.auth().currentUser.displayName;
    Materialize.toast('Welcome '+name+" !", 4000)
    return;
}

function addFirstTimeUser(){
    var user=firebase.auth().currentUser
    var actual_email=user.email;
    var new_email = actual_email.substring(0,actual_email.lastIndexOf("@"))
    new_email = new_email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');

    firebase.database().ref("users/"+new_email).once('value',function(snapshot){

        var check=snapshot.exists();
        if(!check)
        {
            var userObject={
                Name:user.displayName,
                Contact:user.phoneNumber,
                actual_email : actual_email
              

        }
            firebase.database().ref('users/'+new_email).set(userObject);
           
        }
    })

}
function retrieve() {
    firebase.database().ref("dashboard/"+email ).once('value', function(snap){
        snap.forEach(yourData);
        
    });
}
function yourData(data)
{
    printTable(data,data.key); // displaying all the data passing the data and data.key 
}
function printTable(object,key)
{

  var task_row = $('#dashboard_list') // getting the current task hence task_row
  
  var data = "";   // appending the data in form of an html element
  {
      data += '<tr id = "'+key+'">\
          <td>\
            <a class="friends-name black-text" onclick="displayTaskDetails(\''+key+'\')">'+object.val().board_name+'</a></td>\
            <td>\
            <a class="friends-name black-text" onclick="displayTaskDetails(\''+key+'\')">'+object.val().description+'</a></td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light blue" onclick = "EditBoard(\''+key+'\')" ><i class="medium material-icons">create</i></button>\
            </td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light red" onclick = "removeTask(\''+key+'\')" ><i class="medium material-icons">clear</i></button>\
            </td>\
          </tr>';
  }
  
  task_row.append(data);

  $('.preloader-background').fadeOut('slow');
    $('.preloader-wrapper')
        .fadeOut();
  $('.tap-target').tapTarget('open');
}
function addDashboard()
{

    var check=boardValidity();
    if(check==1){
        var board_name=$('#board_name').val();
        var board_desc=$('#board_desc').val();  //clearing the input value after getting the status

        
        
        insertIntoDatabase(board_name, board_desc,0);  // inserting the latest value into the database 
        print_latest_task(board_name ,board_desc,0, db_ref); // calling the display task method
    }else{
        //toast for task not inserted
         Materialize.toast('Task not inserted', 4000);
    }
}
function boardValidity(){
    var check=1;
    var board_name_ele=document.getElementById('board_name');
    var board_desc_ele=document.getElementById('board_desc');
    if(!board_name_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid Name', 4000);
    }
    
    if(!board_desc_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid board_desc', 4000);
    }
    return check;

}
function insertIntoDatabase(board_name, board_desc)
{
    var taskObject={
        board_name: board_name,

        description:board_desc,
        queries_count:0,
    };
    insertIntoTask(taskObject,email);
}
function insertIntoTask(taskObject,email){
    db_ref=database.ref('dashboard/'+email).push().key;
    database.ref('dashboard/'+email+"/"+db_ref).set(taskObject).then(function(){
        
        $('#board_name').val('');
        $('#board_desc').val('');
        
         Materialize.toast('Task inserted successfully!!', 4000)
    }).catch(function(error){
        
        Materialize.toast('Task not inserted due to error!!', 4000)
    });
}
function print_latest_task(task_name,desc,count ,key)
{
  var task_row = $('#dashboard_list');
  var data = "";
  {
      data += '<tr id = "'+key+'">\
          <td>\
            <a class="friends-name black-text" onclick="displayTaskDetails(\''+key+'\')">'+task_name+'</a></td>\
            <td>\
            <a class="friends-name black-text" onclick="displayTaskDetails(\''+key+'\')">'+desc+'</a></td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light blue" onclick = "EditBoard(\''+key+'\')" ><i class="medium material-icons">create</i></button>\
            </td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light red" onclick = "removeTask(\''+key+'\')" ><i class="medium material-icons">clear</i></button>\
            </td>\
          </tr>';
  }
  
  task_row.append(data);
}

function displayTaskDetails(key)
{
  firebase.database().ref('dashboard/' + email + '/' + key).once('value',function(snap){
  	
    document.getElementById('NameDetail').innerHTML = snap.val().board_name;
    document.getElementById('Description').innerHTML = snap.val().description;
    queries = snap.val().queries
    var quarSpan =  document.getElementById('Queries')
    for (key in queries  )
    {
        quarSpan.innerHTML +=(queries[key]['query'])
        quarSpan += '<br>'
    }
   
    $('#modal5').modal('open');
  });
}
function removeTask(key)
{
    firebase.database().ref("dashboard/" + email + "/" + key).remove();
    var x = document.getElementById(key);
    x.style.display = "none";
}

function EditBoard(key){
	window.location = "viewdashboard.html?key="+key

}
