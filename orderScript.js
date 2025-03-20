document.addEventListener("DOMContentLoaded", () => {
  const displayOrderList = document.querySelector("#orderList");
  const backButtonOrderPage = document.querySelector("#backBtn");
  const searchInput = document.querySelector("#searchBox");
  const filter = document.querySelector("#filter");
  const sortOrderButton = document.querySelector("#sortBtn");

  // Retrieve orders from localStorage
  const returnedOrders = localStorage.getItem("pancakeOrders");
  let ordersObject = returnedOrders ? JSON.parse(returnedOrders) : [];

  if (!Array.isArray(ordersObject)) {
    ordersObject = [];
  }

  function createRemoveButton(parentElement, orderId) {
    const removeButton = document.createElement("button");
    removeButton.classList.add("removeBtn");
    removeButton.textContent = "Remove";
    parentElement.appendChild(removeButton);

    removeButton.addEventListener("click", () => {
      ordersObject = ordersObject.filter((order) => order.id !== orderId);
      localStorage.setItem("pancakeOrders", JSON.stringify(ordersObject));
      displayOrdersOnPage();
    });
  }

  function createDropDownList(parentElement, order) {
    const dropDownList = document.createElement("select");
    dropDownList.classList.add("select-status");

    const optionsOfStatus = ["Waiting", "Ready", "Delivered"];
    optionsOfStatus.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.text = option;
      optionElement.value = option;
      if (order.status === option) {
        optionElement.selected = true;
      }
      dropDownList.appendChild(optionElement);
    });

    parentElement.appendChild(dropDownList);

    dropDownList.addEventListener("change", () => {
      order.status = dropDownList.value;
      localStorage.setItem("pancakeOrders", JSON.stringify(ordersObject)); // ✅ Fixed key name
      displayOrdersOnPage();
    });
  }

  function displayOrdersOnPage(filteredOrders = ordersObject) {
    displayOrderList.innerHTML = "";

    if (filteredOrders.length === 0) {
      displayOrderList.innerHTML = "<p>No orders found.</p>";
      return;
    }

    filteredOrders.forEach((order) => {
      const orderItem = document.createElement("li");
      orderItem.classList.add("order-item");

      orderItem.innerHTML = `
        <p><strong>Id:</strong> ${order.id}</p>
        <p><strong>Customer Name:</strong> ${order.customerName}</p>
        <p><strong>Pancake Type:</strong> ${order.selectedPancake}</p>
        <p><strong>Toppings:</strong> ${order.toppings.join(", ") || "None"}</p>
        <p><strong>Extras:</strong> ${order.extras.join(", ") || "None"}</p>
        <p><strong>Delivery Method:</strong> ${order.deliveryMethod}</p>
        <p><strong>Total Price:</strong> €${order.totalPrice.toFixed(2)}</p>
        <p><strong>Order Status:</strong> ${order.status}</p>
      `;

      createDropDownList(orderItem, order);
      createRemoveButton(orderItem, order.id);
      displayOrderList.appendChild(orderItem);
    });

    localStorage.setItem("pancakeOrders", JSON.stringify(ordersObject)); // ✅ Fix storage update
  }

  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    const filteredOrders = ordersObject.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchValue) ||
        order.id.toString().includes(searchValue)
    );
    displayOrdersOnPage(filteredOrders);
  });

  filter.addEventListener("change", () => {
    if (filter.value === "All") {
      displayOrdersOnPage();
    } else {
      const filteredOrders = ordersObject.filter(
        (order) => order.status.toLowerCase() === filter.value.toLowerCase()
      );
      displayOrdersOnPage(filteredOrders);
    }
  });

  sortOrderButton.addEventListener("click", () => {
    const statusOrder = ["waiting", "ready", "delivered"]; // ✅ Use lowercase for consistency

    // Normalize all statuses before sorting
    ordersObject.forEach((order) => {
      order.status = order.status.trim().toLowerCase(); // ✅ Normalize case
    });

    ordersObject.sort((a, b) => {
      const statusA = a.status.toLowerCase().trim();
      const statusB = b.status.toLowerCase().trim();
      return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
    });

    console.log(
      "Sorted Orders:",
      ordersObject.map((o) => o.status)
    ); // ✅ Debugging output

    localStorage.setItem("pancakeOrders", JSON.stringify(ordersObject)); // ✅ Save sorted orders
    displayOrdersOnPage(); // ✅ Corrected function call
  });

  backButtonOrderPage.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  displayOrdersOnPage();
});
