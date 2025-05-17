
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
                
                $filePath = 'puzzleRush.json';

                // Read the contents of the JSON file into a string
                $jsonString = file_get_contents($filePath);

                // Decode the JSON string into an associative array
                $data = json_decode($jsonString, true);

                if (!isset($data2['id'])) {
                    http_response_code(400); // Bad Request
                    echo json_encode(["error" => "'id' key is missing or undefined in JSON data"]);
                    exit;
                }

                // Specify the specific 'id' value you want to find and edit
                $targetId = $data2['id'];

                // Loop through the array to find the element with the specified 'id'
                foreach ($data as &$element) {
                    if ($element['id'] === $targetId) {
                        // Edit the element, for example, changing its 'name'
                        if($data2['win']==true){
                        $element['completions'] = $element['completions']+1;
                        }
                        array_push($element['plays'], strval($id));
                        
                        $element['winrate'] = strval(sprintf("%.2f", (($element['completions']/count($element['plays']))*100)));
                        
                        break; // Stop searching once found and edited
                    }
                }

                // Encode the modified array back into JSON
                $updatedJson = json_encode($data, JSON_PRETTY_PRINT);

                // Write the updated JSON back to the file
                file_put_contents($filePath, $updatedJson);

                echo "Element with 'id' '$targetId' has been updated in the JSON file.";

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
