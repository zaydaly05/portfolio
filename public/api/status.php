<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('Africa/Cairo');

$cairoTime = date('h:i:s A');

echo json_encode([
    'status' => 'Available for Software Engineering Internships & Roles',
    'location' => 'Cairo, Egypt (UTC+2 / UTC+3)',
    'cairoTime' => $cairoTime,
    'uptime' => 3600,
    'timestamp' => round(microtime(true) * 1000)
]);
