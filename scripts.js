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

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(order => {
                        const totalPrice = (order.quantity * parseFloat(order.price)).toFixed(2);
                        const row = document.createElement("tr");
                        row.setAttribute("data-id", order.id);
                        row.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.foodName}</td>
                            <td><input type="number" class="edit-quantity" value="${order.quantity}" min="1" disabled></td>
                            <td>${parseFloat(order.price).toFixed(2)}</td>
                            <td class="total-price">${totalPrice}</td>
                            <td>
                                <button class="edit-button btn btn-sm btn-primary">Edit</button>
                                <button class="delete-button btn btn-sm btn-danger" data-id="${order.id}">Delete</button>
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
                                const price = parseFloat(row.children[2].textContent);
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

    // Delete order
    function deleteOrder(orderId) {
        if (confirm("Are you sure you want to delete this order?")) {
            fetch(`orders.php?id=${orderId}`, { method: "DELETE" })
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.json();
                })
                .then(() => fetchOrders())
                .catch(error => console.error("Error deleting order:", error));
        }
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
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchOrders();
        })
        .catch(error => console.error("Error updating order:", error));
    }

    // Delete order from the database
    function deleteOrder(orderId) {
        fetch("orders.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: orderId })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchOrders();
        })
        .catch(error => console.error("Error deleting order:", error));
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
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchOrders();
            foodForm.reset();
            priceInput.value = "";
            quantityInput.value = 1;
        })
        .catch(error => console.error("Error adding order:", error));
    });

    // Initial setup
    fetchOrders();
});
