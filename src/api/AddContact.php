<?php
	$inData = getRequestInfo();
	
	$Login = $inData["login"];
	$Password = $inData["password"];
    //  a contact struct or something = $inData["contact_data"];

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
        returnWithError("bla bla bla, not done");
		// try {
		// 	$stmt = $conn->prepare("INSERT into Contacts bla bla bla bla bla");
		// 	$stmt->bind_param("ss", $Login, $Password);
		// 	$stmt->execute();
		// 	$stmt->close();
		// 	$conn->close();
			
		// 	returnWithError(""); // Account made, no error
		// } catch (mysqli_sql_exception $e) {
		// 	returnWithError("login already in use");
		// }
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
	
?>