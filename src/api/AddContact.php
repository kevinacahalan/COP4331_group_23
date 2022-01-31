<?php
	$inData = getRequestInfo();
	
	$Login = $inData["login"];
	$Password = $inData["password"];
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
		$userID = getUserID($conn, $Login, $Password);

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

	// Grabs userID for login password combination, spits error and quits
	// if no combination found.
	function getUserID($conn, $login, $password)
	{
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $login, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc() )
		{
			$stmt->close();
			return $row['ID'];
		}
		else
		{
			returnWithError("No Records Found");
			$stmt->close();
			exit();
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

	function returnExitAndDumpString( $dump )
	{
		sendResultInfoAsJson('{ "dump" : "' . $dump . '" }');
		exit();
	}
