document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.getElementById("orderTableBody");
    const foodSelect = document.getElementById("foodName");
    const quantityInput = document.getElementById("quantity");
    const priceInput = document.getElementById("price");

    // Fetch orders from the server
    function fetchOrders() {
        fetch("orders.php?action=fetch")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched orders:", data); // Log the fetched data for debugging
                orderTableBody.innerHTML = ""; // Clear the table body before adding new rows
            
                // Check if data is an array and has elements
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(order => {
                        const row = document.createElement("tr"); // Create a new table row
            
                        // Set the inner HTML of the row
                        row.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.foodName}</td>
                            <td>${order.quantity}</td>
                            <td>${parseFloat(order.price).toFixed(2)}</td> <!-- Convert price to float -->
                            <td>${(order.quantity * parseFloat(order.price)).toFixed(2)}</td> <!-- Convert price to float -->
                            <td>
                                <button class="delete-button" data-id="${order.id}">Delete</button>
                            </td>
                        `;
            
                        console.log("Appending row:", row); // Debugging log
                        orderTableBody.appendChild(row); // Append the new row to the table body
                    });
                } else {
                    // If no orders, display a message
                    orderTableBody.innerHTML = "<tr><td colspan='6' class='text-center'>No orders found.</td></tr>";
                }
            
                attachDeleteEventListeners(); // Attach event listeners for delete buttons
            })
            .catch(error => console.error("Error fetching orders:", error));
    }

    function attachDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function() {
                const orderId = this.getAttribute("data-id");
                deleteOrder(orderId);
            });
        });
    }

    function deleteOrder(orderId) {
        fetch(`orders.php?id=${orderId}`, { method: "DELETE" }) // Use DELETE method for deletion
            .then(response => {
                if (response.ok) {
                    fetchOrders(); // Refresh the order list after deletion
                } else {
                    console.error("Error deleting order:", response.statusText);
                }
            })
            .catch(error => console.error("Error deleting order:", error));
    }

    // Update price based on selected food item
    foodSelect.addEventListener("change", () => {
        const selectedOption = foodSelect.options[foodSelect.selectedIndex];
        const price = selectedOption.getAttribute("data-price");
        priceInput.value = price;
        calculateTotal(); // Calculate total when food item is selected
    });

    // Calculate total price based on quantity
    quantityInput.addEventListener("input", calculateTotal);

    function calculateTotal() {
        const quantity = quantityInput.value;
        const price = priceInput.value;
        const total = quantity * price;
        // You can display the total in a separate field if needed
        // For example, you can create a new input field for total
        // document.getElementById("total").value = total.toFixed(2);
    }

    // Handle form submission to add an order
    const foodForm = document.getElementById("foodForm");
    foodForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(foodForm);
        fetch("orders.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Show success or error message
            fetchOrders(); // Refresh the order list
            foodForm.reset(); // Reset the form
            priceInput.value = ""; // Clear the price input
            quantityInput.value = 1; // Reset quantity to 1
        })
        .catch(error => console.error("Error adding order:", error));
    });

    // Initial fetch
    fetchOrders();
});
