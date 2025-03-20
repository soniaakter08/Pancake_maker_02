document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#pancakeForm");
  const pancakeType = document.querySelector("#type");
  const customerName = document.querySelector("#customerName");
  const totalPriceDisplay = document.querySelector("#totalPriceDisplay");
  const orderButton = document.querySelector("#seeOrder");
  const summary = document.querySelector("#summaryText");
  const totalPriceBanner = document.querySelector("#totalPrice");
  const confirmOrderButton = document.querySelector("#confirmOrder");
  let deliveryMethod = document.querySelector(".delivery:checked");

  const changeHandler = () => {
    const basePrice = parseFloat(pancakeType.selectedOptions[0].dataset.price);

    const toppingsTotal = [
      ...document.querySelectorAll(".topping:checked"),
    ].reduce((sum, topping) => sum + parseFloat(topping.dataset.price), 0);

    const extrasTotal = [...document.querySelectorAll(".extra:checked")].reduce(
      (sum, extra) => sum + parseFloat(extra.dataset.price),
      0
    );

    let deliveryPrice = 0;
    deliveryMethod = document.querySelector(".delivery:checked");
    if (deliveryMethod) {
      deliveryPrice = parseFloat(deliveryMethod.dataset.price);
    }

    let totalPrice = basePrice + toppingsTotal + extrasTotal + deliveryPrice;

    totalPriceBanner.textContent = `${totalPrice}€`;
    totalPriceDisplay.textContent = `${totalPrice}€`;
  };

  form.addEventListener("change", changeHandler);

  const orderSummary = () => {
    const toppings = [...document.querySelectorAll(".topping:checked")].map(
      (t) => t.value
    );
    const extras = [...document.querySelectorAll(".extra:checked")].map(
      (e) => e.value
    );

    const toppingMessage =
      toppings.length > 0 ? toppings.join(", ") : "No toppings selected";
    const extraMessage =
      extras.length > 0 ? extras.join(", ") : "No extras selected";

    deliveryMethod = document.querySelector(".delivery:checked");

    summary.innerHTML = `Name: ${customerName.value} <br>Pancake Type: ${
      pancakeType.selectedOptions[0].textContent
    } <br>
    Selected Toppings: ${toppingMessage}<br> Added extra item: ${extraMessage} <br>
    Selected delivery: ${
      deliveryMethod ? deliveryMethod.parentElement.textContent.trim() : "None"
    }`;
  };

  orderButton.addEventListener("click", orderSummary);

  const confirmOrder = () => {
    console.log("Confirm button clicked!"); // Debugging step 1

    if (!customerName.value.trim()) {
      alert("Please enter your name before confirming the order.");
      return;
    }

    const toppings = [...document.querySelectorAll(".topping:checked")].map(
      (t) => t.value
    );
    const extras = [...document.querySelectorAll(".extra:checked")].map(
      (e) => e.value
    );
    deliveryMethod = document.querySelector(".delivery:checked");

    const totalPrice = parseFloat(
      totalPriceBanner.textContent.replace("€", "")
    );

    const newOrder = {
      id: Date.now(),
      customerName: customerName.value,
      selectedPancake: pancakeType.selectedOptions[0].textContent,
      toppings: toppings,
      extras: extras,
      deliveryMethod: deliveryMethod
        ? deliveryMethod.parentElement.textContent.trim()
        : "None",
      totalPrice: totalPrice,
      status: "waiting",
    };

    let orders = JSON.parse(localStorage.getItem("pancakeOrders")) || [];
    orders.push(newOrder);
    localStorage.setItem("pancakeOrders", JSON.stringify(orders));

    console.log("Saved orders:", orders); // Debugging step 2

    alert(`✅ Order confirmed! Redirecting to order details.`);
  };

  confirmOrderButton.addEventListener("click", confirmOrder);
});
