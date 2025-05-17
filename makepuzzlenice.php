<?php
// Read the JSON file into an associative array
$jsonFile = 'setups.json';
$jsonData = file_get_contents($jsonFile);
$data = json_decode($jsonData, true);

if ($data === null) {
    echo "Error decoding JSON\n";
    exit(1);
}

// Loop through each element in the JSON array
foreach ($data['easy'] as &$element) {
    // Set the 'plays' key to an empty array
    $element['infinite_t'] = true ;
}
foreach ($data['medium'] as &$element) {
    // Set the 'plays' key to an empty array
    $element['infinite_t'] = true ;
}
foreach ($data['hard'] as &$element) {
    // Set the 'plays' key to an empty array
    $element['infinite_t'] = true ;
}

// Encode the updated data back to JSON
$updatedJsonData = json_encode($data, JSON_PRETTY_PRINT);

if ($updatedJsonData === false) {
    echo "Error encoding JSON\n";
    exit(1);
}

// Write the updated JSON back to the file
if (file_put_contents($jsonFile, $updatedJsonData) === false) {
    echo "Error writing JSON to file\n";
    exit(1);
}

echo "JSON file updated successfully\n";
?>
