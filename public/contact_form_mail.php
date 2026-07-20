<?php
// Contact form handler: validates the input and forwards it by email.

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$recipient = 'weskakay@gmail.com';
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'invalid input']);
    exit;
}

$subject = 'Neue Nachricht ueber weskakay.de';
$body = "Name: $name\nE-Mail: $email\n\n$message\n";
$headers = "From: kontakt@weskakay.de\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

if (mail($recipient, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'mail failed']);
}
