document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.getElementById("orderTableBody");
    const foodSelect = document.getElementById("foodName");
    const quantityInput = document.getElementById("quantity");
    const priceInput = document.getElementById("price");
    const foodForm = document.getElementById("foodForm");

    // Fetch orders from the server
    function fetchOrders() {
        fetch("orders.php?action=fetch")
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                orderTableBody.innerHTML = "";

                // Add inline CSS dynamically
const style = document.createElement("style");
style.textContent = `
    table {
        width: 100%;
        border-collapse: collapse;
        overflow-x: auto;
    }
    th, td {
        padding: 8px;
        text-align: center;
        border: 1px solid #ddd;
    }
    .edit-quantity {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        font-size: 1rem;
    }
    .edit-button,
    .delete-button {
        font-size: 0.8rem;
        padding: 5px;
    }
    @media (max-width: 768px) {
        table, thead, tbody, th, td, tr {
            display: block;
        }
        thead tr {
            display: none;
        }
        tr {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
        }
        td {
            display: flex;
            justify-content: space-between;
            padding: 5px 10px;
            text-align: left;
        }
        td::before {
            content: attr(data-label);
            font-weight: bold;
            flex: 1;
            padding-right: 10px; /* Add spacing between the label and value */
            color: #333; /* Optional: Add label color for clarity */
        }
        .edit-quantity {
            max-width: 60px;
        }
        .edit-button, .delete-button {
            width: 48%;
        }
    }
`;
document.head.appendChild(style);

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(order => {
                        const totalPrice = (order.quantity * parseFloat(order.price)).toFixed(2);
                        const row = document.createElement("tr");
                        row.setAttribute("data-id", order.id);
                        row.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.foodName}</td>
                            <td><input type="number" class="edit-quantity" style="max-width: 60px; width: 100%; padding: 5px; box-sizing: border-box; font-size: 1rem;" value="${order.quantity}" min="1" disabled></td>
                            <td>${parseFloat(order.price).toFixed(2)}</td>
                            <td class="total-price">${totalPrice}</td>
                            <td>
                                <button class="edit-button btn btn-sm btn-primary" style="font-size: 0.8rem; padding: 5px;">Edit</button>
                                <button class="delete-button btn btn-sm btn-danger" style="font-size: 0.8rem; padding: 5px;" data-id="${order.id}">Delete</button>
                            </td>
                        `;
                        orderTableBody.appendChild(row);
                    });

                    // Attach event listeners to edit buttons
                    const editButtons = document.querySelectorAll(".edit-button");
                    editButtons.forEach(button => {
                        button.addEventListener("click", function () {
                            const row = this.closest("tr");
                            const quantityInput = row.querySelector(".edit-quantity");

                            if (this.textContent === "Edit") {
                                // Enable editing
                                quantityInput.disabled = false;
                                this.textContent = "Save";
                            } else {
                                // Save changes
                                const orderId = row.getAttribute("data-id");
                                const quantity = quantityInput.value;
                                const price = parseFloat(row.children[3].textContent); // Corrected index for price
                                const totalPriceCell = row.querySelector(".total-price");

                                totalPriceCell.textContent = (quantity * price).toFixed(2);
                                quantityInput.disabled = true;
                                this.textContent = "Edit";
                                updateOrder(orderId, quantity);
                            }
                        });
                    });

                    // Attach event listeners to delete buttons
                    const deleteButtons = document.querySelectorAll(".delete-button");
                    deleteButtons.forEach(button => {
                        button.addEventListener("click", function () {
                            const orderId = this.getAttribute("data-id");
                            deleteOrder(orderId);
                        });
                    });

                } else {
                    orderTableBody.innerHTML = "<tr><td colspan='6' class='text-center'>No orders found.</td></tr>";
                }
            })
            .catch(error => console.error("Error fetching orders:", error));
    }

    // Confirm function
    function confirmAction(message) {
        return new Promise((resolve) => {
            const confirmed = confirm(message);
            resolve(confirmed);
        });
    }

    // Delete order function
    function deleteOrder(orderId) {
        confirmAction("Are you sure you want to delete this order?")
            .then((isConfirmed) => {
                if (isConfirmed) {
                    fetch(`orders.php?id=${orderId}`, { method: "DELETE" })
                        .then(response => {
                            if (!response.ok) throw new Error("Network response was not ok");
                            return response.json();
                        })
                        .then(() => {
                            alert("Order deleted successfully.");
                            fetchOrders(); // Refresh the order list
                        })
                        .catch(error => console.error("Error deleting order:", error));
                }
            });
    }

    // Update order in the database
    function updateOrder(orderId, quantity) {
        fetch("orders.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: orderId, quantity: quantity })
        })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                alert("Order updated successfully.");
                fetchOrders(); // Refresh the order list
            })
            .catch(error => console.error("Error updating order:", error));
    }

    // Handle food selection changes
    foodSelect.addEventListener("change", () => {
        const selectedOption = foodSelect.options[foodSelect.selectedIndex];
        const price = selectedOption.getAttribute("data-price");
        priceInput.value = price;
    });

    // Handle order form submission
    foodForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(foodForm);
        fetch("orders.php", {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.text();
            })
            .then(data => {
                alert(data);
                fetchOrders(); // Refresh the order list
                foodForm.reset(); // Reset the form
                priceInput.value = ""; // Clear the price input
                quantityInput.value = 1; // Reset quantity input to 1
            })
            .catch(error => console.error("Error adding order:", error));
    });

    // Initial setup
    fetchOrders(); // Fetch orders when the page loads
});
