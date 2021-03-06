
var trainData = new Firebase("https://ggfirebase.firebaseio.com/");
var trainStatus = "on time";

$(document).on('click', '.delete', deletetrain);


$("#addTrainBtn").on("click", function(){
	// Grabs user input
	var trainName = $("#trainNameInput").val().trim();
	var trainDestination = $("#destinationInput").val().trim();
	var trainFirst = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(1,"years").format("X");
	var trainFrequency = $("#frequencyInput").val().trim();
	var trainStatus = "on time";
	// Creates local "temporary" object for holding train data
	var newTrain = {
		name:  trainName,
		destination: trainDestination,
		trainFirst: trainFirst,
		frequency: trainFrequency,
		status: trainStatus
	}
	// Uploads train data to the database
	trainData.push(newTrain);
	
	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainInput").val("");
	$("#frequencyInput").val("");

	return false;
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
trainData.on("child_added", function(childSnapshot, prevChildKey){

// Store everything into a variable.
var trainName = childSnapshot.val().name;
var trainDestination = childSnapshot.val().destination;
var trainFirst = childSnapshot.val().trainFirst;
var trainFrequency = childSnapshot.val().frequency;
var trainStatus = childSnapshot.val().status;

// Determine when the next train arrives.
var timeDifference = moment().diff(moment.unix(trainFirst), "minutes");
var minutesAway = trainFrequency - (timeDifference % trainFrequency);
var nextTrain = moment().add(minutesAway, "minutes").format('HH:mm');

var correctedTrain = trainName.replace(/ /g,'');
// Add each train's data into the table 
$("#trainTable > tbody").append("<tr id=" + correctedTrain + "><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td><td>" + trainStatus + "</td><td>" + "<button class="+ "delete btn-xs data-name=" + correctedTrain + ">delete</button>" + "</td></tr>");

});

setInterval(date,1000);

function date(){
//This function displays the time of day at the top of the page and updates every second.
	$("#todaydate").html(moment(new Date()).format('LTS'));
}

function deletetrain(){
	var trainId = $(this).attr('data-name');
	
	$('#'+ trainId).empty();
}
