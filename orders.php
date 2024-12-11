<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "food_ordering";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle add order request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $foodName = $_POST['foodName'];
    $quantity = (int)$_POST['quantity'];
    $price = (float)$_POST['price'];

    $stmt = $conn->prepare("INSERT INTO orders (foodName, quantity, price) VALUES (?, ?, ?)");
    $stmt->bind_param("sid", $foodName, $quantity, $price);

    if ($stmt->execute()) {
        echo "Order added successfully";
    } else {
        echo "Error: " . $conn->error;
    }

    $stmt->close();
    exit;
}

// Handle fetch orders request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'fetch') {
    $result = $conn->query("SELECT * FROM orders");
    $orders = [];

    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode($orders);
    exit;
}

// Handle delete order request
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];

    $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Order deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }

    $stmt->close();
    exit;
}

$conn->close();
?>
