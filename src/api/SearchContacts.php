<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
?>
<?php


	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$userId = $inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ( $conn->connect_error ) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	

		if( empty($firstName) )
		{
			$stmt = $conn->prepare(
				"SELECT * FROM Contacts WHERE
				 UserId = ? AND
				 LastName LIKE ?"
			);
			$stmt->bind_param("ss", $userId, $lastName);
		}
		else if( empty($lastName) )
		{
			$stmt = $conn->prepare(
				"SELECT * FROM Contacts WHERE
				 UserId = ? AND
				 FirstName LIKE ?"
			);
			$stmt->bind_param("ss", $userId, $firstName);
		}
		else
		{
			$stmt = $conn->prepare(
				"SELECT * FROM Contacts WHERE
				 UserId = ? AND
				 FirstName LIKE ? AND
				 LastName LIKE ?"
			);
			$stmt->bind_param("sss", $userId, $firstName, $lastName);
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
			$searchResults .= '{
				"contactId":' . $row["ID"] . ',
				"firstName":"' . $row["FirstName"] . '",
				"lastName":"' . $row["LastName"] . '",
				"email":"' . $row["Email"] . '",
				"phoneNumber":"' . $row["PhoneNumber"] . '"
			}';
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
		$retValue = '{
			"results":[' . $searchResults . '],
			"error":""
		}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
