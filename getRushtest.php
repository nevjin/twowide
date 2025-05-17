<?php
// Read the contents of the JSON file into a string
$jsonString = file_get_contents('puzzleRush.json');

// Decode the JSON string into an associative array
$data = json_decode($jsonString, true);

// Check if the JSON decoding was successful
if ($data === null) {
    die('Error decoding JSON file');
}

// Shuffle the array to randomize the order
shuffle($data);

// Slice the first 88 elements from the array
$randomElements = array_slice($data, 0, 88);

function compareWinrate($a, $b) {
    return $b['winrate'] - $a['winrate'];
}

// Sort the array using the custom comparison function
usort($randomElements, 'compareWinrate');


// Encode the selected elements back into a JSON variable
$randomJson = json_encode($randomElements);

// Output the resulting JSON variable
echo $randomJson;
?>
