<?php
// Check if the 'userid' parameter is set in the URL
if (isset($_GET['userid'])) {
    // Read the JSON data from the file
    $jsonString = file_get_contents('data.json');

    // Decode the JSON data into a PHP associative array
    $data = json_decode($jsonString, true);

    // Get the 'userid' from the URL
    $userId = $_GET['userid'];

    // Check if the 'userid' exists in the JSON data
    if (isset($data[$userId])) {
        // Output the JSON data for the specified 'userid'
        header('Content-Type: application/json');
        // Get the current Unix timestamp
$currentTimestamp = time();

$timestampToCompare = $data[$userId]['time'];

// Calculate the difference in seconds between the two timestamps
$timeDifference = $currentTimestamp - $timestampToCompare;

// Calculate the number of days ago
$daysAgo = floor($timeDifference / (24 * 3600));

$data[$userId]['age'] = $daysAgo;

        echo json_encode($data[$userId]);
    } else {

        echo "not found";
    }
} else {
    // 'userid' parameter not provided in the URL
    echo '';
}
?>
