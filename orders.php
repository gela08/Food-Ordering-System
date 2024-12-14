<?php
// // Database configuration
// $servername = "localhost";
// $username = "root";
// $password = "";
// $database = "food_ordering";

// // Create connection
// $conn = new mysqli($servername, $username, $password, $database);

// // Check connection
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }

// // Handle add order request
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $foodName = $_POST['foodName'];
//     $quantity = (int)$_POST['quantity'];
//     $price = (float)$_POST['price'];

//     $stmt = $conn->prepare("INSERT INTO orders (foodName, quantity, price) VALUES (?, ?, ?)");
//     $stmt->bind_param("sid", $foodName, $quantity, $price);

//     if ($stmt->execute()) {
//         echo "Order added successfully";
//     } else {
//         echo "Error: " . $conn->error;
//     }

//     $stmt->close();
//     exit;
// }

// // Handle fetch orders request
// if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'fetch') {
//     $result = $conn->query("SELECT * FROM orders");
//     $orders = [];

//     while ($row = $result->fetch_assoc()) {
//         $orders[] = $row;
//     }

//     echo json_encode($orders);
//     exit;
// }

// // Handle delete order request
// if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
//     $id = (int)$_GET['id'];

//     $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
//     $stmt->bind_param("i", $id);

//     if ($stmt->execute()) {
//         echo json_encode(["message" => "Order deleted successfully"]);
//     } else {
//         echo json_encode(["error" => "Error: " . $conn->error]);
//     }

//     $stmt->close();
//     exit;
// }

// // Handle update order request
// if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
//     parse_str(file_get_contents("php://input"), $_PUT); // Parse the input data

//     $id = (int)$_PUT['id'];
//     $foodName = $_PUT['foodName'];
//     $quantity = (int)$_PUT['quantity'];
//     $price = (float)$_PUT['price'];

//     $stmt = $conn->prepare("UPDATE orders SET foodName = ?, quantity = ?, price = ? WHERE id = ?");
//     $stmt->bind_param("sidi", $foodName, $quantity, $price, $id);

//     if ($stmt->execute()) {
//         echo "Order updated successfully";
//     } else {
//         echo "Error: " . $conn->error;
//     }

//     $stmt->close();
//     exit;
// }

// $conn->close();

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

// Handle update order request
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Parse the input
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['id'], $input['quantity'])) {
        $id = (int)$input['id'];
        $quantity = (int)$input['quantity'];

        $stmt = $conn->prepare("UPDATE orders SET quantity = ? WHERE id = ?");
        $stmt->bind_param("ii", $quantity, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "Invalid input"]);
    }
    exit;
}

// Close the connection
$conn->close();
?>
