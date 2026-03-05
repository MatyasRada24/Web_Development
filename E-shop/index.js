const container = document.querySelector('.products-container');
const products = Array.from(container.querySelectorAll('.product-card'));

// Přidej data-index pro novinky (pořadí v HTML)
products.forEach((product, index) => product.dataset.index = index);

// Nastavení výchozího stavu
document.querySelector('.section-text[data-sort="newest"]').classList.add('active');

const sortElements = document.querySelectorAll('.section-text');
const categoryElements = document.querySelectorAll('.header-text');

// --- ŘAZENÍ (v sekci) ---
sortElements.forEach(element => {
    element.addEventListener('click', () => {
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