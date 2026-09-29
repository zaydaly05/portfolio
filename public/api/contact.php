<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$name = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
$email = isset($data['email']) ? htmlspecialchars(trim($data['email'])) : '';
$message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "All fields are required."]);
    exit;
}

echo json_encode([
    "ok" => true,
    "message" => "Thanks {$name}, your message has been received! Zayd will get back to you shortly at {$email}."
]);
