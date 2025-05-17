<?php
// Read the JSON data from the file
$jsonData = file_get_contents('data.json');

// Decode the JSON data into an associative array
$data = json_decode($jsonData, true);

// Create a new associative array with numeric indices
$newData = [];
foreach ($data as $item) {
    $newData[] = $item;
}

// Encode the new array as JSON
$newJsonData = json_encode($newData);

// Output the JSON data with numeric indices
echo $newJsonData;
?>
