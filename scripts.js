document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.getElementById("orderTableBody");

    // Fetch orders from the server
    function fetchOrders() {
        fetch("getOrders.php")
            .then(response => response.json())
            .then(data => {
                orderTableBody.innerHTML = ""; // Clear table body
                data.forEach(order => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.foodName}</td>
                        <td>${order.quantity}</td>
                        <td>${order.price.toFixed(2)}</td>
                        <td>${(order.quantity * order.price).toFixed(2)}</td>
                        <td>
                            <button class="delete-button" data-id="${order.id}">Delete</button>
                        </td>
                    `;

                    orderTableBody.appendChild(row);
                });

                attachDeleteEventListeners();
            })
            .catch(error => console.error("Error fetching orders:", error));
    }

    // Attach delete event listeners
    function attachDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const orderId = event.target.dataset.id;
                deleteOrder(orderId);
            });
        });
    }

    // Delete an order
    function deleteOrder(orderId) {
        fetch(`deleteOrder.php?id=${orderId}`, { method: "GET" })
            .then(response => {
                if (response.ok) {
                    fetchOrders();
                } else {
                    console.error("Failed to delete order");
                }
            })
            .catch(error => console.error("Error deleting order:", error));
    }

    // Initial fetch
    fetchOrders();
});
