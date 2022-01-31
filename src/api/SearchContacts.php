<?php
	// This endpoint takes in a json formatted like this:
	// 	{
	// 		"login": "PLACEHOLDER",
	// 		"password": "PLACEHOLDER",
	// 		"search" : {
	// 			"firstName" : "PLACEHOLDER",
	// 			"lastName" : "PLACEHOLDER"
	// 		}
	// 	}


	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;


	$Login = $inData["login"];
	$Password = $inData["password"];

	$search = $inData["search"];
	$firstName = $search["firstName"];
	$lastName = $search["lastName"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	
		$userId = getUserID($conn, $Login, $Password);

		if(empty($firstName))
		{
			$stmt = $conn->prepare("select * from Contacts where UserId=? and LastName like ?");
			$stmt->bind_param("ss", $userId, $lastName);
		}
		else if(empty($lastName))
		{
			$stmt = $conn->prepare("select * from Contacts where UserId=? and FirstName like ?");
			$stmt->bind_param("ss", $userId, $firstName);
		}
		else
		{
			$stmt = $conn->prepare("select * from Contacts where UserId=? and FirstName like ? and LastName like ?");
			$stmt->bind_param("sss", $userId, $firstName, $lastName);
		}
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"id":' . $row["ID"] . ',"firstName":"' . $row["FirstName"] . '","lastName":"' . $row["LastName"] . '","email":"' . $row["Email"] . '","phoneNumber":"' . $row["PhoneNumber"] . '"}';
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

	// THIS DAM FUNCTION SHOULD BE MADE GLOBAL OR SOMETHING... AddContact HAS SAME FUNCTION
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
