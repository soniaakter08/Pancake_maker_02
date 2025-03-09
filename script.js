const form = document.querySelector("#pancakeForm");
const pancakeType = document.querySelector("#type");
const customerName = document.querySelector("#customerName");
const totalPriceDisplay = document.querySelector("#totalPriceDisplay");
const orderButton = document.querySelector("#seeOrder");
const summary = document.querySelector("#summaryText");
const totalPriceBanner = document.querySelector("#totalPrice");
const deliveryMethod = document.querySelector(".delivery:checked");

const changeHandler = (event) => {
  const basePrice = parseFloat(pancakeType.selectedOptions[0].dataset.price);

  const toppingsTotal = [
    ...document.querySelectorAll(".topping:checked"),
  ].reduce((sum, topping) => sum + parseFloat(topping.dataset.price), 0);

  const extrasTotal = [...document.querySelectorAll(".extra:checked")].reduce(
    (sum, extra) => sum + parseFloat(extra.dataset.price),
    0
  );

  let deliveryPrice = 0;
  if (deliveryMethod) {
    deliveryPrice = parseFloat(deliveryMethod.dataset.price);
  }

  let totalPrice = basePrice + toppingsTotal + extrasTotal + deliveryPrice;

  totalPriceBanner.textContent = `${totalPrice}€`;
  totalPriceDisplay.textContent = `${totalPrice}€`;
};
form.addEventListener("change", changeHandler);

const orderSummary = () => {
  const toppings = document.querySelectorAll(".topping:checked");
  const extras = document.querySelectorAll(".extra:checked");
  let toppingResult, extraResult;
  let topping = [];
  let extra = [];

  for (let i = 0; i < toppings.length; i++) {
    if (toppings[i].checked) {
      toppingResult = toppings[i].value;
      topping.push(toppingResult);
    }
  }
  for (let i = 0; i < extras.length; i++) {
    if (extras[i].checked) {
      extraResult = extras[i].value;
      extra.push(extraResult);
    }
  }
  const toppingMessage =
    topping.length > 0 ? topping.join(",") : "No toppings selected";
  const extraMessage =
    extra.length > 0 ? extra.join(",") : "No extras selected";
  summary.textContent = `Name: ${customerName.value}, Pancake Type: ${pancakeType.selectedOptions[0].textContent}, Selected Toppings: ${toppingMessage}, Added extra item : ${extraMessage}, selected delivery: ${deliveryMethod.parentElement.textContent}`;
};

orderButton.addEventListener("click", orderSummary);
