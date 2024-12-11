document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.getElementById("orderTableBody");
    const foodSelect = document.getElementById("foodName");
    const quantityInput = document.getElementById("quantity");
    const priceInput = document.getElementById("price");
    const foodForm = document.getElementById("foodForm");

    const editOrderModal = new bootstrap.Modal(document.getElementById("editOrderModal"));
    const editOrderForm = document.getElementById("editOrderForm");
    const editFoodName = document.getElementById("editFoodName");
    const editQuantity = document.getElementById("editQuantity");
    const editPrice = document.getElementById("editPrice");
    const editOrderId = document.getElementById("editOrderId");

    // Copy food options to the edit modal select element
    function populateEditFoodOptions() {
        editFoodName.innerHTML = foodSelect.innerHTML;
    }

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
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.foodName}</td>
                            <td>${order.quantity}</td>
                            <td>${parseFloat(order.price).toFixed(2)}</td>
                            <td>${(order.quantity * parseFloat(order.price)).toFixed(2)}</td>
                            <td>
                                <button class="edit-button btn btn-sm btn-primary" data-id="${order.id}" data-food="${order.foodName}" data-quantity="${order.quantity}" data-price="${order.price}">Edit</button>
                                <button class="delete-button btn btn-sm btn-danger" data-id="${order.id}">Delete</button>
                            </td>
                        `;
                        orderTableBody.appendChild(row);
                    });

                    // Attach event listeners to delete buttons
                    const deleteButtons = document.querySelectorAll(".delete-button");
                    deleteButtons.forEach(button => {
                        button.addEventListener("click", function () {
                            const orderId = this.getAttribute("data-id");
                            deleteOrder(orderId);
                        });
                    });

                    // Attach event listeners to edit buttons
                    const editButtons = document.querySelectorAll(".edit-button");
                    editButtons.forEach(button => {
                        button.addEventListener("click", function () {
                            const orderId = this.getAttribute("data-id");
                            const foodName = this.getAttribute("data-food");
                            const quantity = this.getAttribute("data-quantity");
                            const price = this.getAttribute("data-price");

                            // Populate modal fields
                            editFoodName.value = foodName;
                            editQuantity.value = quantity;
                            editPrice.value = price;
                            editOrderId.value = orderId;

                            // Show the modal
                            editOrderModal.show();
                        });
                    });
                } else {
                    orderTableBody.innerHTML = "<tr><td colspan='6' class='text-center'>No orders found.</td></tr>";
                }
            })
            .catch(error => console.error("Error fetching orders:", error));
    }

    // Handle form submission in the edit modal
    editOrderForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(editOrderForm);
        fetch("orders.php", {
            method: "PUT",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchOrders();
            editOrderModal.hide();
        })
        .catch(error => console.error("Error updating order:", error));
    });

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
    populateEditFoodOptions();
    fetchOrders();
});
