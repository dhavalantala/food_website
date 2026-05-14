var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector(`.mobile-menu`);
const bars = document.querySelector(`.fa-bars`)


cartIcon.addEventListener('click', () => cartTab.classList.add('js-cart-tab-active'));
closeBtn.addEventListener('click', () => cartTab.classList.remove('js-cart-tab-active'));
// hamburger.addEventListener('click', () => mobileMenu.classList.toggle('mobile-menu-active'));
// hamburger.addEventListener('click', () => bars.classList.toggle('fa-xmark'));

if (hamburger && mobileMenu && bars) {
    hamburger.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents the page from jumping up to the top because of href="#"
        
        // 1. Toggles the mobile menu slide-in panel visibility
        mobileMenu.classList.toggle('mobile-menu-active');
        
        // 2. Swaps the icons cleanly by switching both classes
        bars.classList.toggle('fa-bars');
        bars.classList.toggle('fa-xmark');
    });
}


let productList = [];
let cartProduct = [];

const updateTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;


    document.querySelectorAll('.item').forEach(item => {

        const quantity = parseInt(item.querySelector(`.quantity-value`).textContent);
        const priceText = item.querySelector('.item-total').textContent.replace(/[$\s]/g, '');
        const price = parseFloat(priceText);

        if (!isNaN(price)) {
            totalPrice += price;
            totalQuantity += quantity;
        }
    });

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQuantity
}

const showCards = () => {
    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card')

        orderCard.innerHTML = `
                        <div class="card-image">
                            <img src=${product.image} />
                        </div>
                        <h4>${product.name}</h4>
                        <h4 class="price">$ ${product.price}</h4>
                        <a href="#" class="btn card-btn">Add to Cart</a>
                        `;
        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn')
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();

            addToCart(product);

        })
    })
}

const addToCart = (product) => {

    const existingProduct = cartProduct.find(item => item.id === product.id)

    if (existingProduct) {
        alert("Item already in your cart");
        return;
    };
    cartProduct.push(product);
    let quantity = 1;
    let price = parseFloat(product.price.replace('$', ''))




    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
        <div class="item-images">
            <img src=${product.image}>
        </div>
        <div class="js-detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">$ ${product.price}</h4>
        </div>
        <div class="flex">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>`;

    cartList.appendChild(cartItem)
    updateTotals();


    const plusBtn = cartItem.querySelector('.plus')
    const quantityValue = cartItem.querySelector('.quantity-value')
    const itemTotal = cartItem.querySelector('.item-total');

    const minusBtm = cartItem.querySelector('.minus')


    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$ ${(price * quantity).toFixed(2)}`;
        updateTotals(); // Add this line
    });

    minusBtm.addEventListener('click', (e) => {
        e.preventDefault();

        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `$ ${(price * quantity).toFixed(2)}`;
            updateTotals(); // Add this line
        } else {
            cartItem.classList.add('slide-out');

            setTimeout(() => {
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateTotals(); // Add this line to update after removal
            }, 300);
        }
    });


}

const initApp = () => {
    fetch('product.json').then
        (response => response.json()).then
        (data => {
            productList = data;
            showCards()
        })
}

initApp()

