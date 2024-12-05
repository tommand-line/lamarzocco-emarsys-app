const cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function addToCart(item, price, quantity = 1) {
    /*ScarabQueue.push(['cart', [
        { item: name, price: price, quantity: quantity }
    ]]);*/
    alert(`Hai Aggiunto ${item} al Carrello`)
    const productIndex = cart.findIndex(product => product.item === item);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ item, price, quantity });
    }
    ScarabQueue.push(['cart', cart]);
    updateCartCount();
}

function updateCartCount() {
    const cartCount = cart.reduce((acc, product) => acc + product.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

function goToCart() { 
    ScarabQueue.push(['go']);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

function viewProduct(name) {
    ScarabQueue.push(['view', name]);
    alert(`Hai Visualizzato ${name} (product)`)
}

function viewCategory(category) {
    ScarabQueue.push(['category', category]);
    alert(`Hai Visualizzato ${category} (category)`)
}