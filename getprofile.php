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
        echo json_encode($data[$userId]);
    } else {
        // 'userid' not found in the JSON data, create a new entry
        $newEntry = [
            "userid" => $_GET['userid'],
            "history" => "{}",
            "points" => 0,
            "username" => $_GET['username'],
            "avatar" => $_GET['avatar'],
            "time" => time(), // Current time in milliseconds
            "supporter" => 0,
            "rush_score" => 0,
            "rush_time" => 0,
            "rush_access" => 0
        ];

        // Add the new entry to the data array
        $data[$userId] = $newEntry;

        // Save the updated JSON data back to the file
        file_put_contents('data.json', json_encode($data));

        // Output the new entry as JSON
        header('Content-Type: application/json');
        echo json_encode($newEntry);
    }
} else {
    // 'userid' parameter not provided in the URL
    echo '';
}
?>
