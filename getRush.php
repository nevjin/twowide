<?php

// Read the contents of the JSON file into a string
$jsonString = file_get_contents('puzzleRush.json');

// Decode the JSON string into an associative array
$data = json_decode($jsonString, true);

// Check if the JSON decoding was successful
if ($data === null) {
    die('Error decoding JSON file');
}

// Sort rush data by winrate
usort($data, function($a, $b) {
    return $b["winrate"] - $a["winrate"];
});

// Chunkify function (Equivalent to the JavaScript function)
function chunkify($a, $n) {
    if ($n < 2)
        return [$a];
    $len = count($a);
    $out = [];
    $i = 0;
    if ($len % $n === 0) {
        $size = floor($len / $n);
        while ($i < $len) {
            $out[] = array_slice($a, $i, $size);
            $i += $size;
        }
    } else {
        while ($i < $len) {
            $size = ceil(($len - $i) / $n--);
            $out[] = array_slice($a, $i, $size);
            $i += $size;
        }
    }
    return $out;
}

$rushSorted = chunkify($data, 5);
$sentRush = [];

foreach ($rushSorted as $i => $chunk) {
    if ($i == 4) {
        shuffle($chunk);
        $shuffled = array_splice($chunk, 0, intval(count($chunk) / 1.25) - 1);
        usort($shuffled, function($a, $b) {
            return count($a["plays"]) - count($b["plays"]);
        });
        $shuffled = array_splice($shuffled, 0, intval(count($shuffled) / 1.75) - 1);
        $sentRush = array_merge($sentRush, $shuffled);
    } else {
        shuffle($chunk);
        $shuffled = array_splice($chunk, 0, 15);
        usort($shuffled, function($a, $b) {
            return count($a["plays"]) - count($b["plays"]);
        });
        $added = array_splice($shuffled, 0, 13);
        $sentRush = array_merge($sentRush, $added);
    }
}

// Sort the final rush data by winrate
usort($sentRush, function($a, $b) {
    return $b["winrate"] - $a["winrate"];
});

// Return the modified rush data as JSON
echo json_encode($sentRush);

?>