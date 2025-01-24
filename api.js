let productData = [];  // Global variable for product data

// Truncate words function (for description and title truncation)
function truncatewords(str, numWords) {
    const words = str.split('');
    if (words.length <= numWords) {
        return str;
    }
    return words.slice(0, numWords).join(' ') + '...';
}

// Normalize category names for filtering
function normalizeCategory(category) {
    return category.toLowerCase().replace(/['\s]+/g, '-');
}

// Fetch product data from API
fetch("https://fakestoreapi.com/products")
.then((response) => response.json())
.then((data) => {
    productData = data;  // Store the data globally

    // Render product cards
    const containerCards = productData.map((product) => {
        const truncateDescription = truncatewords(product.description, 92);
        const truncateTitle = truncatewords(product.title, 13);
        const normalizedCategory = normalizeCategory(product.category);

        return `
        <div class="productCard ${normalizedCategory}" data-id="${product.id}">
            <img src="${product.image}" alt="${product.title}">
            <p class="title">${truncateTitle}</p>
            <p class="description">${truncateDescription}</p>
            <hr>
            <i class="bi bi-currency-dollar dollars"></i>
            <pre class="price">${product.price}</pre>
            <hr class="horr">
            <button class="details">Details</button>
            <button class="addcart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
        `;
    }).join(' ');

    // Inject product cards into the container
    const container = document.getElementById('container');
    container.innerHTML = containerCards;
})
.catch((error) => {
    console.error('Error fetching products:', error);
});

// Filter items by category
function filteritems(category) {
    const items = document.querySelectorAll('.productCard');
    const normalizedCategory = normalizeCategory(category);

    items.forEach((item) => {
        const itemCategory = item.classList[1];
        if (category === 'all' || itemCategory === normalizedCategory) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add product to cart
function addToCart(productId) {
    const product = productData.find((p) => p.id === productId);
    if (!product) {
        console.error('Product not found for ID:', productId);
        return;
    }

    console.log('Product added to cart:', product);

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Increase quantity if product exists
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add product to cart with quantity 1
        product.quantity = 1;
        cart.push(product);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();
}

// Update cart count in the UI
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueProductCount = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = uniqueProductCount;
    }
}

// Update cart count when the page loads
document.addEventListener('DOMContentLoaded', updateCartCount);
