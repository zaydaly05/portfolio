<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;
$message = isset($data['message']) ? strtolower(trim($data['message'])) : '';

if (empty($message)) {
    http_response_code(400);
    echo json_encode(["reply" => "Please type a message!"]);
    exit;
}

$reply = "";
$suggestions = [];

if (strpos($message, 'hi') !== false || strpos($message, 'hello') !== false || strpos($message, 'hey') !== false) {
    $reply = "Hello! I am **Zayd's AI Assistant**. I can tell you all about Zayd's technical skills, software projects, internships at TAQA Arabia, education at MIU, certifications, or help you schedule a call with him!";
    $suggestions = ["What is Zayd's tech stack?", "Tell me about TAQA Arabia internship", "Show top projects", "How to contact Zayd?"];
} elseif (strpos($message, 'skill') !== false || strpos($message, 'stack') !== false || strpos($message, 'language') !== false) {
    $reply = "Zayd has a versatile technical skill set:\n\n⚡ **Languages:** Java, C#, C++, C, Python, JavaScript, PHP, Dart, SQL, HTML/CSS, Tailwind\n🛠️ **Frameworks:** Spring Boot, React, Node.js, Express.js, Flutter, .NET Core Web API, JavaFX\n🗄️ **Databases:** MongoDB, MySQL, Firebase, SQL";
    $suggestions = ["Show projects", "Tell me about TAQA Arabia", "Download Zayd's CV"];
} elseif (strpos($message, 'project') !== false || strpos($message, 'food') !== false || strpos($message, 'limousine') !== false) {
    $reply = "Zayd has built several flagship projects:\n1️⃣ **Gulf Limousine App** (Flutter, Dart, Firebase)\n2️⃣ **Food Ordering Management System** (Spring Boot, React, MongoDB)\n3️⃣ **Essmat Plastic System** (C#, .NET, SQL Server)";
    $suggestions = ["GitHub repositories", "Contact Zayd"];
} elseif (strpos($message, 'taqa') !== false || strpos($message, 'intern') !== false || strpos($message, 'experience') !== false) {
    $reply = "Zayd's professional experience includes internships at **TAQA Arabia** (Software & IT) and **Cairo Higher Institute** (IT Dept).";
    $suggestions = ["View Skills", "Schedule an Interview"];
} else {
    $reply = "Zayd is a Computer Science student skilled in Java (Spring Boot), React, Node.js, C# .NET, Flutter, PHP, and MongoDB. Ask me about his projects, internships, or contact details!";
    $suggestions = ["What is Zayd's tech stack?", "Show experience", "Show top projects", "How to contact Zayd?"];
}

echo json_encode(["reply" => $reply, "suggestions" => $suggestions]);
