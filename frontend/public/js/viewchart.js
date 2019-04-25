var graphData ="" // global data for the graph database
var densityCanvas = document.getElementById("densityChart");  // getting the global canvas on which all the charts will be loaded
var mylabels = []
var query = ""
var mykey =""
var email = '';
var database = firebase.database()
Chart.defaults.global.defaultFontFamily = "Lato"; // later to be provided by the customisation functions
Chart.defaults.global.defaultFontSize = 18;
window.addEventListener('load', function() {
	var urlString = window.location.href;
	var url = new URL(urlString);
    
    query =url.searchParams.get('dbref')
    mykey = url.searchParams.get('key') // retrieving the path and query
    var myquery  = document.getElementById('myquery')
    myquery.innerHTML += query
    QueriesDatabaseBackend(query)
    
    initApp()
    var out = document.getElementById('out');
    out.onclick= SignOut 
  
});


$('.dropdown-trigger').dropdown();
 $('.tap-target').tapTarget('open');

initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        	var displayName = user.displayName;
            email = user.email;
            email = user.email.substring(0,email.lastIndexOf("@"))
    		email = email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
            showMessage();
            document.getElementById('zuser').innerHTML = displayName;
            document.getElementById('zuser1').innerHTML = displayName;
            
             $('.modal').modal();
        }
        else{
            window.location='index.html'
        }
      },function(error) {
         // logging the error can be done via external logging as well
    })
 }

function  SignOut() {

    
    firebase.auth().signOut().then(function() {
        window.location = 'index.html';
    }).catch(function(error) {
        // An error happened.
    });
}
function showMessage(){

    var name=firebase.auth().currentUser.displayName;
    Materialize.toast('Welcome to DashBoard Editor  '+name+" !", 4000)
    return;
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

	}
}
function renderChartjs(data,chartOptions)
{
	
    mixedChart = new Chart(densityChart, {
    type: 'bar',
    data: {
        datasets: [{
            label: 'Bar Dataset',
            data:data['data']
        }, {
            label: 'Line Dataset',
            data: data['data'],

            type: 'line'
        }],
        labels: data['labels']
    },
    options:  {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}
function QueriesDatabaseBackend(query){

	
	$.get('http://127.0.0.1:8080/test?query='+query,function(data)
	{
		graphData = data
		getDimmensions(graphData)
		
	})
	
}
function getDimmensions(value)
 {
	

	var mylabels = ((Object.values(Object.keys(value[0]))))
	var output = value.map(function(obj) {
  		return Object.keys(obj).map(function(key) { 
    	return obj[key];
  		});
	});
	output = output[0].map((col, i) => output.map(row => row[i]));
	configureChart(output,mylabels)
}
function configureChart(output, mylabels)
{

var myData = {
  labels: output[0],
  data: output[1]
};

var chartOptions = {
  
};
 renderChartjs(myData,chartOptions)
}
function UpadteQuery()
{

	var myquery = document.getElementById('updatedQuery')
    
	if(!myquery.checkValidity())
	{
		Materialize.toast("Please enter a Valid query",4000);

	}
	else{
		//insertIntoDB(query);
		InsertUpadatedQuery(myquery.value)
	}
}
function fetchQuery()
{   
  var myquery = document.getElementById('updatedQuery')
  myquery.value = query
}
function InsertUpadatedQuery(value){
	database.ref(mykey).update({query:value})
	QueriesDatabaseBackend(value)
	var myquery  = document.getElementById('myquery')
	mixedChart.destroy()
	myquery.innerHTML = ''
    myquery.innerHTML += value	

}