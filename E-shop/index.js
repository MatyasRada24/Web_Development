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
