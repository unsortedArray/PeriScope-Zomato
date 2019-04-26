var graphData ="" // global data for the graph database
var densityCanvas = document.getElementById("densityChart");  // getting the global canvas on which all the charts will be loaded
var mylabels = []
var query = ""
var mykey =""
var email = '';
var database = firebase.database()
Chart.defaults.global.animationSteps = 50;
Chart.defaults.global.tooltipYPadding = 16;
Chart.defaults.global.tooltipCornerRadius = 0;
Chart.defaults.global.tooltipTitleFontStyle = "normal";
Chart.defaults.global.tooltipFillColor = "rgba(0,160,0,0.8)";
Chart.defaults.global.animationEasing = "easeOutBounce";
Chart.defaults.global.responsive = true;
Chart.defaults.global.scaleLineColor = "black";
Chart.defaults.global.scaleFontSize = 16;
var currenType = "bar"
var currentColor = ""
var currentBorderColor =""
var yAxisObject =[]
var borderColorArray =["rgba(0,0,255,0.5)","rgb(128,0,0,0.5)","rgba(255,0,255,0.8)","rgba(0,0,255,0.3)","rgba(127,0,255,0.1)"]
var pointColorArray =["rgba(0,0,255,0.5)","rgb(128,0,0,0.5)","rgba(255,0,255,0.8)"]
var strokeColorArray =["rgba(0,0,255,0.5)","rgb(128,0,0,0.5)","rgba(255,0,255,0.8)"]
var backgroundColorArray =["rgba(0,0,255,0.5)","rgb(128,0,0,0.5)","rgba(255,0,255,0.8)"]
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
             $('select:not([multiple])').material_select();
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

function QueriesDatabaseBackend(query){

	
	$.get('http://127.0.0.1:8080/test?query='+query,function(data)
	{
		graphData = data
		getDimmensions(graphData)
		
	})
	
}
function getDimmensions(value, currentColor)
 {
    console.log(currentColor,currentBorderColor)
    if(currentBorderColor ="")
    {
        currentBorderColor = borderColorArray[Math.floor(Math.random() * Math.floor(borderColorArray.length))]
    }
    if(currentColor ="")
    {
        currentColor =  borderColorArray[Math.floor(Math.random() * Math.floor(borderColorArray.length))]
    }
	// var mylabels = ((Object.values(Object.keys(value.length - 1))))
    labelObject =(Object.keys(value[0]))
    labelsArray =[]
    for(key in labelObject){
        labelsArray.push(labelObject[key])
    }
    labelsArray.shift()
    console.log(labelsArray)
    for(key in labelsArray)
    {
        
        var currentLabelArrayObject ={
            id:labelsArray[key],
            position:'left',
            scaleLabel: {display:true,labelString:labelsArray[key]}
        }
        console.log(currentLabelArrayObject)
        yAxisObject.push(currentLabelArrayObject)
    }
    console.log(yAxisObject)
    var mylabels = []
	var output = value.map(function(obj) {
  		return Object.keys(obj).map(function(key) { 
    	return obj[key];
  		});
	});
	output = output[0].map((col, i) => output.map(row => row[i]));
    mylabels = output[0]
    output.shift()
    var datasets =[]
    for(var i =0;i<output.length;i++)
    {
        console.log(labelsArray[i])
        var sampledata= {
           
            data : output[i],
            label: labelsArray[i],
            backgroundColor: strokeColorArray[i],
            borderColor : "rgba(255,255,255,1)",
            //borderColor: borderColorArray[currentBorderColor] ,// The main line color
            borderWidth: 2,
            yAxisID:labelsArray[i],
            borderCapStyle: 'circle',

        }
        datasets.push(sampledata)
    }
	configureChart(datasets,mylabels)
}
function configureChart(output, mylabels)
{

var myData = {
  labels: mylabels,
  datasets: output
  }

var chartOptions = {
    scales: {
    xAxes: [{
      barPercentage: 1,
      categoryPercentage: 0.6
    }],
    yAxes:yAxisObject
  },
  
}
 renderChartjs(myData,chartOptions)
}
function renderChartjs(mydata,chartOptions)
{
    mixedChart = new Chart(densityChart, {
    type: currenType,
    data: mydata,
    options:chartOptions
});
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
    myquery.innerHTML = value
     

}
function customiseChart()
{
    var dropdown1 = document.getElementById('color').value
    var dropdown2 = document.getElementById('type').value
    var dropdown3 = document.getElementById('backgroundColor').value
    if(dropdown1.value ="")
    {
        dropdown1 = backgroundColorArray[0]
    }
    if(dropdown2.value ="")
    {
        dropdown2 = "bar"
    }
    if(dropdown3.value ="")
    {
        dropdown3 =backgroundColorArray[0]
    }
    customisedRendering(dropdown2,dropdown3,dropdown1)
}
function customisedRendering(type,color,pointColor)
{
    
    currenType = type
    currentColor = color
    mixedChart.destroy()
    //currentBorderColor = pointColor
    getDimmensions(graphData,color)
}