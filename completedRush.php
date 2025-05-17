
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
            
            $token = $data2['access_token'];
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
        if($data2['score']>$data[$userId]['rush_score']){
            $score = $data2['score'];
            $time = time();
        }else{
            $score = $data[$userId]['rush_score'];
            $time = $data[$userId]['rush_time'];
        }
        $newEntry = [
            "userid" => $data[$userId]['userid'],
            "history" => $data[$userId]['history'],
            "points" => $data[$userId]['points'],
            "username" => $data[$userId]['username'],
            "avatar" => $data[$userId]['avatar'],
            "time" => $data[$userId]['time'], // Current time in milliseconds
            "supporter" => $data[$userId]['supporter'],
            "rush_score" => $score,
            "rush_time" => $time,
            "rush_access" => $data[$userId]['rush_access']
        ];

        // Add the new entry to the data array
        $data[$userId] = $newEntry;

        // Save the updated JSON data back to the file
        file_put_contents('data.json', json_encode($data));

        echo "saved";
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
