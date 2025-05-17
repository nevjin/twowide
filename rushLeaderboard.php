<?php
// Read the JSON data from the file
$jsonData = file_get_contents('data.json');

// Decode the JSON data into an associative array
$data = json_decode($jsonData, true);

// Sort the array based on "rush_score" in descending order
usort($data, function ($a, $b) {
    return $b['rush_score'] - $a['rush_score'];
});

// Encode the sorted array back to JSON
$sortedJsonData = json_encode($data);

// Output the sorted JSON data
echo $sortedJsonData;
?>
