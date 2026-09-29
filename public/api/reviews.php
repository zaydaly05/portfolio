<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$file = __DIR__ . '/user-reviews.json';

function getReviews($file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $json = json_decode($content, true);
        if (is_array($json)) return $json;
    }
    return [
        [
            "id" => 1,
            "name" => "Ahmed Hassan",
            "role" => "Senior Software Engineer @ TechCorp",
            "rating" => 5,
            "comment" => "Zayd's full-stack work with Spring Boot and React is outstanding. Very clean code structure and impressive problem-solving abilities!",
            "date" => "2026-09-25"
        ],
        [
            "id" => 2,
            "name" => "Mariam El-Din",
            "role" => "UI/UX Designer",
            "rating" => 5,
            "comment" => "The Flutter mobile application UI and responsive design are top notch. Great attention to detail!",
            "date" => "2026-09-20"
        ]
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;
    
    $name = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
    $comment = isset($data['comment']) ? htmlspecialchars(trim($data['comment'])) : '';
    $role = isset($data['role']) ? htmlspecialchars(trim($data['role'])) : 'Visitor / Developer';
    $rating = isset($data['rating']) ? intval($data['rating']) : 5;

    if (empty($name) || empty($comment)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Name and comment are required."]);
        exit;
    }

    $reviews = getReviews($file);
    $newReview = [
        "id" => round(microtime(true) * 1000),
        "name" => $name,
        "role" => $role,
        "rating" => min(5, max(1, $rating)),
        "comment" => $comment,
        "date" => date('Y-m-d')
    ];

    array_unshift($reviews, $newReview);
    @file_put_contents($file, json_encode($reviews, JSON_PRETTY_PRINT));

    echo json_encode(["ok" => true, "message" => "Review posted successfully!", "review" => $newReview]);
} else {
    echo json_encode(["ok" => true, "reviews" => getReviews($file)]);
}
