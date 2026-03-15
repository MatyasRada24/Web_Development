const container = document.querySelector('.products-container');
const products = container ? Array.from(container.querySelectorAll('.product-card')) : [];

// Přidej data-index pro novinky (pořadí v HTML)
products.forEach((product, index) => product.dataset.index = index);

// Nastavení výchozího stavu
const newestSort = document.querySelector('.section-text[data-sort="newest"]');
if (newestSort) newestSort.classList.add('active');

const sortElements = document.querySelectorAll('.section-text');
const categoryElements = document.querySelectorAll('.header-text');

// --- ŘAZENÍ (v sekci) ---
sortElements.forEach(element => {
    element.addEventListener('click', () => {
        if (!container) return;
        const sortType = element.dataset.sort;
        // Seřadíme všechny produkty (i ty schované)
        let sortedProducts = [...products];

        if (sortType === 'price-asc') {
            sortedProducts.sort((a, b) => +a.dataset.price - +b.dataset.price);
        } else if (sortType === 'price-desc') {
            sortedProducts.sort((a, b) => +b.dataset.price - +a.dataset.price);
        } else if (sortType === 'newest') {
            sortedProducts.sort((a, b) => +b.dataset.index - +a.dataset.index);
        }

        // Znovu vložíme do kontejneru v novém pořadí
        sortedProducts.forEach(p => container.appendChild(p));

        // Vizuální zpětná vazba
        sortElements.forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    });
});

// --- FILTROVÁNÍ (v hlavičce) ---
categoryElements.forEach(element => {
    element.addEventListener('click', () => {
        const category = element.dataset.category;
        const isActive = element.classList.contains('active');

        // Pokud klikneš na už vybranou kategorii, zrušíme filtr (ukážeme vše)
        if (isActive) {
            products.forEach(product => product.style.display = 'flex');
            element.classList.remove('active');
        } else {
            // Jinak filtrujeme podle kategorie
            products.forEach(product => {
                if (product.dataset.category === category) {
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });
            categoryElements.forEach(el => el.classList.remove('active'));
            element.classList.add('active');
        }
    });
});

// 1. Funkce pro načtení košíku z paměti
function getCart() {
    const cart = localStorage.getItem('electrowave_cart');
    return cart ? JSON.parse(cart) : [];
}

// 2. Funkce pro uložení košíku do paměti
function saveCart(cart) {
    localStorage.setItem('electrowave_cart', JSON.stringify(cart));
    updateCartBadge(); // Hned aktualizujeme číslo na ikoně
}

// 3. Funkce pro přidání produktu
function addToCart(event) {
    const btn = event.target;
    const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
        image: btn.dataset.image,
        quantity: 1
    };

    let cart = getCart();

    // Koukneme, jestli už tam produkt je
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1; // Pokud ano, jen přičteme skus
    } else {
        cart.push(product); // Pokud ne, přidáme ho jako nový
    }

    saveCart(cart);
    alert('Produkt byl přidán do košíku!'); // Zatím jen jednoduchá hláška
}

// 4. Navěšení funkce na všechna tlačítka
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', addToCart);
});
function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');

    if (badge) {
        badge.innerText = count;
        // Pokud je košík prázdný, můžeme bublinu schovat
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

// Zavoláme hned při načtení stránky
updateCartBadge();

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('electrowave_cart')) || [];
    const container = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (!container) return; // Nemáme element, např. jsme na hlavní stránce

    container.innerHTML = ''; // Vyčistíme košík před vykreslením
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; font-size: 18px; color: #666; font-style: italic;">V košíku zatím nic nemáte. Tak šup nakupovat!</p>';
        if (totalPriceElement) totalPriceElement.innerText = '0';
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        // Vytvoříme HTML pro jeden produkt
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="80">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString()} Kč</p>
            </div>
            <div class="item-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity} ks</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button onclick="removeItem(${index})" class="delete-btn">X</button>
            </div>
        `;
        container.appendChild(itemElement);
    });

    totalPriceElement.innerText = total.toLocaleString();
}

// Funkce pro změnu množství (+ / -)
window.changeQuantity = function (index, delta) {
    let cart = JSON.parse(localStorage.getItem('electrowave_cart'));
    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Odstraní produkt, pokud je množství 0
    }

    localStorage.setItem('electrowave_cart', JSON.stringify(cart));
    renderCart(); // Překreslíme košík
};

// Funkce pro úplné odstranění
window.removeItem = function (index) {
    let cart = JSON.parse(localStorage.getItem('electrowave_cart'));
    cart.splice(index, 1);
    localStorage.setItem('electrowave_cart', JSON.stringify(cart));
    renderCart();
};

// Vykreslíme při načtení
document.addEventListener('DOMContentLoaded', renderCart);