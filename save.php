
<?php
function getid($token){
    $url = "https://discord.com/api/users/@me";
    $headers = array('Content-Type: application/x-www-form-urlencoded', 'Authorization: Bearer ' . $token);
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($curl);
    curl_close($curl);
    $results = json_decode($response, true);
    $id = $results['id'];
    return $id;
}

function addplay($newpuzzles){
    foreach ($newpuzzles as $key => $value) {
        if (isset($value['completed']) && $value['completed'] == 0) {
            
            $name = $key;
            $diff = $value['difficulty'];
            
            $jsonFile = 'setups.json';
$jsonData = file_get_contents($jsonFile);

$setups = json_decode($jsonData, true);

$setups[$diff][$name]['plays'] = $setups[$diff][$name]['plays']+1;

    $newJsonData = json_encode($setups, JSON_PRETTY_PRINT);

    file_put_contents($jsonFile, $newJsonData);
        }
    }
}

function completedpuzzles($hist,$oldhist){
        $diffKeys = array();
foreach ($hist as $key => $value1) {
    if (array_key_exists($key, $oldhist)) {
        $value2 = $oldhist[$key];
        if (($value1['completed'] != 0&&$value2['completed']==0)) {
            $diffKeys[$key] = $value1;
        }
    }
}

foreach ($diffKeys as $key => $value) {
         
            $name = $key;
            $diff = $value['difficulty'];
            
            $jsonFile = 'setups.json';
$jsonData = file_get_contents($jsonFile);

$setups = json_decode($jsonData, true);

$setups[$diff][$name]['completions'] = $setups[$diff][$name]['completions']+1;

    $newJsonData = json_encode($setups, JSON_PRETTY_PRINT);

    file_put_contents($jsonFile, $newJsonData);
        }
    
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw JSON data from the request body
    $jsonData = file_get_contents('php://input');

    // Check if the JSON data is not empty
    if (!empty($jsonData)) {
        // Decode the JSON data into a PHP associative array
        $data2 = json_decode($jsonData, true);

        if ($data2 === null) {
            // JSON parsing failed
            http_response_code(400); // Bad Request
            echo json_encode(["error" => "Invalid JSON data"]);
        } else {
            
            $token = $data2['accessToken'];
            $id = getid($token);
            if (isset($id)) {
    // Read the JSON data from the file
    $jsonString = file_get_contents('data.json');

    // Decode the JSON data into a PHP associative array
    $data = json_decode($jsonString, true);

    // Get the 'userid' from the URL
    $userId = $id;

    // Check if the 'userid' exists in the JSON data
    if (isset($data[$userId])) {
        // Output the JSON data for the specified 'userid'
        // 'userid' not found in the JSON data, create a new entry
        
        $hist = $data2['history'];
        $oldhist = json_decode($data[$userId]['history'],true);
        $newpuzzles = array_diff_assoc($hist, $oldhist);
        
        addplay($newpuzzles);
        
        completedpuzzles($hist,$oldhist);
        
foreach ($hist as $key => $element) {
    // Check if $oldhist has the corresponding key
    if (isset($oldhist[$key])) {
        // Determine the value for 'completed' based on the condition
        $completedValue = ($element['completed'] == 0) ? $oldhist[$key]['completed'] : $element['completed'];
        $element['completed'] = $completedValue;
        $hist[$key] = $element;
    }
}

// Merge $oldhist and $hist
$resultArray = array_merge($oldhist, $hist);

        
        
        
        $newEntry = [
            "userid" => $data[$userId]['userid'],
            "history" => json_encode($resultArray),
            "points" => $data[$userId]['points'],
            "username" => $data[$userId]['username'],
            "avatar" => $data[$userId]['avatar'],
            "time" => $data[$userId]['time'], // Current time in milliseconds
            "supporter" => $data[$userId]['supporter'],
            "rush_score" => $data[$userId]['rush_score'],
            "rush_time" => $data[$userId]['rush_time'],
            "rush_access" => $data[$userId]['rush_access']
        ];

        // Add the new entry to the data array
        $data[$userId] = $newEntry;

        // Save the updated JSON data back to the file
        file_put_contents('data.json', json_encode($data));

        echo json_encode($resultArray);
    }
                
            }        
            
        }
    } else {
        // JSON data is empty
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Empty JSON data"]);
    }
} else {
    // Request method is not POST
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>
