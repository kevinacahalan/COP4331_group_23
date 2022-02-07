<?php header('Access-Control-Allow-Origin: https://collectivecontacts.xyz');?>
<?php
	// This endpoint takes in a json formatted like this:
	// 	{
	// 		"firstName": "PLACEHOLDER",
	// 		"lastName": "PLACEHOLDER",
	// 		"login": "PLACEHOLDER",
	// 		"password": "PLACEHOLDER"
	// 	}

	$inData = getRequestInfo();
	
	$FirstName = $inData["firstName"];
	$LastName = $inData["lastName"];
	$Login = $inData["login"];
	$Password = $inData["password"];

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
			$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			
			returnWithError(""); // Account made, no error
		} catch (mysqli_sql_exception $e) {
			returnWithError("login already in use");
		}
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