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

    
if(isset($data['password'])&&$data['password']=="coolrules"){
// Read the JSON data from setups.json
$jsonFile = 'setups.json';
$jsonData = file_get_contents($jsonFile);

// Decode the JSON data into an associative array
$setups = json_decode($jsonData, true);

$specificId = $data['setup'];

// Check if the ID exists in the array
if (isset($setups[$data['difficulty']][$data['setup']])) {
    // Remove the specific ID from the array
    unset($setups[$data['difficulty']][$data['setup']]);

    // Encode the modified array back to JSON
    $newJsonData = json_encode($setups, JSON_PRETTY_PRINT);

    // Save the modified JSON back to setups.json
    file_put_contents($jsonFile, $newJsonData);

    echo "The Setup  $specificId has been removed from the JSON.";
} else {
    http_response_code(404);
    echo "The Setup $specificId was not found in the JSON.";
}
}else{
    http_response_code(403);
    echo "Totally the correct password";
}

} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method or content type']);
}
?>



