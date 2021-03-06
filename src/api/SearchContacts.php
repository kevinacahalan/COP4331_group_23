<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
?>
<?php


	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$userId = $inData["userId"];
	$query = $inData["query"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ( $conn->connect_error ) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	
		$query = trim($query);
		$query = explode(" ", $query);
		if (count($query) > 1)
		{
			$firstQuery = '%' . $query[0] . '%'; 
			$secondQuery = '%' . $query[1] . '%';
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (`FirstName` LIKE ? AND `LastName` LIKE ?) AND `UserID` = ?");
			$stmt->bind_param("ssi", $firstQuery, $secondQuery, $userId);
		}
		else
		{
			$query = '%' . $query[0] . '%';
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (`FirstName` LIKE ? OR `LastName` LIKE ? OR `Email` LIKE ? OR `PhoneNumber` LIKE ?) AND `UserID` = ?");
			$stmt->bind_param("ssssi", $query, $query, $query, $query, $userId);

		}
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while( $row = $result->fetch_assoc() )
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;

			// 
			$searchResults .= '{'.
				'"contactId": "'.$row["ID"].'", '.
				'"firstName": "'.$row["FirstName"].'", '.
				'"lastName": "'.$row["LastName"].'", '.
				'"email": "'.$row["Email"].'", '.
				'"phoneNumber": "'.$row["PhoneNumber"].''.
			'"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
		$retValue = '{
			"contactId":0,
			"firstName":"",
			"lastName":"",
			"error":"' . $err . '"
		}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results": [' . $searchResults . '], "error": ""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
