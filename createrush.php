<?php
// Check if the request method is POST and the content type is JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
    isset($_SERVER['CONTENT_TYPE']) && 
    $_SERVER['CONTENT_TYPE'] === 'application/json') {

    // Get the JSON request body
    $jsonPayload = file_get_contents('php://input');

    // Attempt to decode the JSON data
    $data = json_decode($jsonPayload, true); // Use 'true' for associative array, omit for object

    // Check if JSON decoding was successful
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        // JSON decoding failed
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    
if(isset($_REQUEST['password'])&&$_REQUEST['password']=="coolrules"){
// Read the JSON data from setups.json
$jsonFile = 'puzzleRushRem.json';
$jsonData = file_get_contents($jsonFile);

// Decode the JSON data into an associative array
$setups = json_decode($jsonData, true);

$setups[] = $data;

    // Encode the modified array back to JSON
    $newJsonData = json_encode($setups, JSON_PRETTY_PRINT);

    // Save the modified JSON back to setups.json
    file_put_contents($jsonFile, $newJsonData);

    echo "Puzzle rush added";
    
}else{
    http_response_code(403);
    echo "Totally the correct password";
}

} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method or content type']);
}
?>



