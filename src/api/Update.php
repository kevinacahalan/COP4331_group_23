<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
?>
<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare(
			"UPDATE Contacts
			 SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ?
			 WHERE ID=?"
		);
		$stmt->bind_param(
			"sssss",
			$inData["firstName"],
			$inData["lastName"],
			$inData["email"],
			$inData["phoneNumber"],
			$inData["contactId"]
		);
		$stmt->execute();	
		$stmt->close();
		$conn->close();
		returnNoError();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnNoError()
	{
		$retValue = '{"error":""}';
		sendResultInfoAsJson($retValue);
	}	
	
?>
