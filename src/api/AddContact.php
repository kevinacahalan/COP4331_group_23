<?php

	// This endpoint takes in a json formatted like this:
	// 	{
	// 		"userId": "PLACEHOLDER",
	// 		"contact" : {
	// 			"firstName" : "PLACEHOLDER",
	// 			"lastName" : "PLACEHOLDER",
	// 			"email" : "PLACEHOLDER",
	// 			"phoneNumber" : "PLACEHOLDER"
	// 		}
	// 	}

	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
	$contact = $inData["contact"];

	$firstName = $contact["firstName"];
	$lastName = $contact["lastName"];
	$email = $contact["email"];
	$phoneNumber = $contact["phoneNumber"];

	// enable error reporting
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

	// Open connection to database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	
		try {
			$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Email,PhoneNumber,UserID) VALUES(?,?,?,?,?)");
			$stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $userID);
			$stmt->execute();

			returnWithError(""); // Account made, no error
		} catch (mysqli_sql_exception $e) {
			returnWithError("phone number already in use");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnExitAndDumpString( $dump )
	{
		sendResultInfoAsJson('{ "dump" : "' . $dump . '" }');
		exit();
	}
