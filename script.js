/* =====================================================
   OWNLYFANS - MAIN JAVASCRIPT
===================================================== */


/* ================= CONFIG ================= */

const WHATSAPP_NUMBER = "918968134716";


/* ================= PRODUCTS ================= */

const products = {

    CT9A2X: {
        id: "CT9A2X",
        name: "Customised T-Shirt",
        price: 699
    },

    CM4B8Y: {
        id: "CM4B8Y",
        name: "Customised Mug",
        price: 399
    },

    PT7C3Z: {
        id: "PT7C3Z",
        name: "Predesigned T-Shirt",
        price: 599
    },

    PM5D1W: {
        id: "PM5D1W",
        name: "Predesigned Mug",
        price: 349
    }

};


/* ================= CART ================= */

let cart = JSON.parse(
    localStorage.getItem("ownlyfansCart")
) || [];


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "ownlyfansCart",
        JSON.stringify(cart)
    );

}


/* ================= ADD TO CART ================= */

function addToCart(productId) {

    const product = products[productId];

    if (!product) {
        return;
    }


    const existingItem = cart.find(
        item => item.id === productId
    );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });

    }


    saveCart();

    updateCartUI();

    showToast(
        `${product.name} added to cart!`
    );

}


/* ================= REMOVE FROM CART ================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    updateCartUI();

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(productId, change) {

    const item = cart.find(
        item => item.id === productId
    );


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveCart();

    updateCartUI();

}


/* ================= CART COUNT ================= */

function getCartCount() {

    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

}


/* ================= CART TOTAL ================= */

function getCartTotal() {

    return cart.reduce(
        (total, item) =>
            total + (item.price * item.quantity),
        0
    );

}


/* ================= FORMAT PRICE ================= */

function formatPrice(amount) {

    return `₹${amount.toLocaleString("en-IN")}`;

}


/* ================= UPDATE CART ================= */

function updateCartUI() {

    const countElements =
        document.querySelectorAll("#cart-count");


    const count = getCartCount();


    countElements.forEach(element => {

        element.textContent = count;

    });


    renderCart();

}


/* ================= RENDER CART ================= */

function renderCart() {

    const cartItems =
        document.getElementById("cart-items");

    const emptyCart =
        document.getElementById("empty-cart");

    const cartTotal =
        document.getElementById("cart-total");

    const cartItemsCount =
        document.getElementById("cart-items-count");

    const checkoutButton =
        document.getElementById("checkout-button");


    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    const count = getCartCount();


    if (cartItemsCount) {

        cartItemsCount.textContent =
            `${count} ${count === 1 ? "item" : "items"}`;

    }


    if (cart.length === 0) {

        emptyCart.style.display = "flex";

        checkoutButton.disabled = true;

    } else {

        emptyCart.style.display = "none";

        checkoutButton.disabled = false;

    }


    cart.forEach(item => {

        const itemElement =
            document.createElement("div");


        itemElement.className =
            "cart-item";


        itemElement.innerHTML = `

            <div class="cart-item-image">
                ${getProductEmoji(item.id)}
            </div>

            <div class="cart-item-info">

                <span>
                    ${item.id}
                </span>

                <h3>
                    ${item.name}
                </h3>

                <strong>
                    ${formatPrice(item.price)}
                </strong>

                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity('${item.id}', -1)">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity('${item.id}', 1)">
                        +
                    </button>

                </div>

            </div>

            <button
                onclick="removeFromCart('${item.id}')"
                class="remove-item">

                🗑️

            </button>

        `;


        cartItems.appendChild(itemElement);

    });


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(getCartTotal());

    }

}


/* ================= PRODUCT ICON ================= */

function getProductEmoji(id) {

    if (id === "CT9A2X") {
        return "👕";
    }

    if (id === "CM4B8Y") {
        return "☕";
    }

    if (id === "PT7C3Z") {
        return "🎨";
    }

    if (id === "PM5D1W") {
        return "🖌️";
    }

    return "🛍️";

}


/* ================= OPEN CART ================= */

function openCart() {

    const overlay =
        document.getElementById("cart-overlay");


    if (!overlay) {
        return;
    }


    overlay.classList.add("show");

    document.body.classList.add("no-scroll");

}


/* ================= CLOSE CART ================= */

function closeCart(event) {

    if (
        event &&
        event.target &&
        event.target.id !== "cart-overlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById("cart-overlay");


    if (overlay) {

        overlay.classList.remove("show");

    }


    document.body.classList.remove("no-scroll");

}


/* ================= OPEN CHECKOUT ================= */

function openCheckout() {

    if (cart.length === 0) {

        showToast("Your cart is empty!");

        return;

    }


    const checkoutOverlay =
        document.getElementById(
            "checkout-overlay"
        );


    if (!checkoutOverlay) {
        return;
    }


    renderCheckout();


    checkoutOverlay.classList.add("show");

    document.body.classList.add("no-scroll");

}


/* ================= CLOSE CHECKOUT ================= */

function closeCheckout() {

    const checkoutOverlay =
        document.getElementById(
            "checkout-overlay"
        );


    if (checkoutOverlay) {

        checkoutOverlay.classList.remove("show");

    }


    document.body.classList.remove("no-scroll");

}


/* ================= RENDER CHECKOUT ================= */

function renderCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );


    const checkoutTotal =
        document.getElementById(
            "checkout-total"
        );


    if (!checkoutItems) {
        return;
    }


    checkoutItems.innerHTML = "";


    cart.forEach(item => {

        const row =
            document.createElement("div");


        row.className =
            "checkout-item";


        row.innerHTML = `

            <span>
                ${item.name} × ${item.quantity}
            </span>

            <strong>
                ${formatPrice(
                    item.price * item.quantity
                )}
            </strong>

        `;


        checkoutItems.appendChild(row);

    });


    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatPrice(getCartTotal());

    }

}


/* ================= WHATSAPP ORDER ================= */

function placeWhatsAppOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        showToast("Your cart is empty!");

        return;

    }


    const name =
        document.getElementById(
            "customer-name"
        ).value.trim();


    const phone =
        document.getElementById(
            "customer-phone"
        ).value.trim();


    const address =
        document.getElementById(
            "customer-address"
        ).value.trim();


    const note =
        document.getElementById(
            "customer-note"
        ).value.trim();


    let message =
        "🛍️ *NEW OWNLYFANS ORDER*%0A%0A";


    message +=
        `👤 *Name:* ${name}%0A`;

    message +=
        `📞 *Phone:* ${phone}%0A`;

    message +=
        `📍 *Address:* ${address}%0A%0A`;


    message +=
        "🛒 *ORDER DETAILS*%0A";


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        message +=
            `• ${item.name} × ${item.quantity} — ${formatPrice(itemTotal)}%0A`;

    });


    message +=
        `%0A💰 *TOTAL: ${formatPrice(
            getCartTotal()
        )}*%0A`;


    if (note) {

        message +=
            `%0A📝 *Note:* ${note}%0A`;

    }


    message +=
        "%0AThank you!";


    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );


    /* Clear cart after order */

    cart = [];

    saveCart();

    updateCartUI();

    closeCheckout();

    closeCart();

}


/* ================= TOAST ================= */

function showToast(message) {

    const oldToast =
        document.querySelector(".toast");


    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");


    toast.className = "toast";


    toast.innerHTML = `
        <span>✓</span>
        ${message}
    `;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("hide");

    }, 2200);


    setTimeout(() => {

        toast.remove();

    }, 2700);

}


/* ================= CATEGORY FILTER ================= */

function filterCategory(category) {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(card => {

        const cardCategory =
            card.dataset.category;


        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });


    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(button => {

        if (
            button.dataset.target === category
        ) {

            button.classList.add(
                "active-filter"
            );

        } else {

            button.classList.remove(
                "active-filter"
            );

        }

    });

}


/* ================= URL CATEGORY ================= */

function loadURLCategory() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    if (category) {

        filterCategory(category);

    }

}


/* ================= CHECKOUT FORM ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartUI();

        loadURLCategory();


        const checkoutForm =
            document.getElementById(
                "checkout-form"
            );


        if (checkoutForm) {

            checkoutForm.addEventListener(
                "submit",
                placeWhatsAppOrder
            );

        }

    }
);