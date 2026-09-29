<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$file = __DIR__ . '/star-count.json';

function getStars($file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $json = json_decode($content, true);
        if (isset($json['stars'])) return intval($json['stars']);
    }
    return 48;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $stars = getStars($file) + 1;
    @file_put_contents($file, json_encode(['stars' => $stars]));
    echo json_encode(['ok' => true, 'stars' => $stars, 'message' => "Thank you for starring Zayd's portfolio!"]);
} else {
    echo json_encode(['ok' => true, 'stars' => getStars($file)]);
}
