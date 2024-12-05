const cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function addToCart(item, price, quantity = 1) {
    alert(`Hai Aggiunto ${item} al Carrello`)
    const productIndex = cart.findIndex(product => product.item === item);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ item, price, quantity });
    }
    ScarabQueue.push(['cart', cart]);
    ScarabQueue.push(['go']);
    updateCartCount();
}

function updateCartCount() {
    const cartCount = cart.reduce((acc, product) => acc + product.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function goToCart() { 
    window.location.href = 'checkout.html';
}

function viewProduct(item) {
    //ScarabQueue.push(['view', name]);
    alert(`Hai Visualizzato ${item} (product)`)
}

function viewCategory(category) {
    //ScarabQueue.push(['category', category]);
    alert(`Hai Visualizzato ${category} (category)`)
}