let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        document.getElementById('cart-items').innerHTML = '<p>carrello vuoto</p>';
        document.getElementById('total').textContent = 'Totale: €0.00';
        return;
    }
    let total = 0;

    cart.forEach(product => {
        total += product.price * product.quantity;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <h4>${product.item} (x${product.quantity})</h4>
            <div>
                <span>€${(product.price * product.quantity).toFixed(2)}</span>
                <button class="remove-btn">Rimuovi</button>
            </div>
        `;
        const removeButton = div.querySelector('.remove-btn');
        removeButton.onclick = () => removeFromCart(product.item);

        cartItemsContainer.appendChild(div);
    });

    document.getElementById('total').textContent = `Totale: €${total.toFixed(2)}`;
}

function removeFromCart(item) {
    cart = cart.filter(product => product.item !== item);
    localStorage.setItem('cart', JSON.stringify(cart));
    ScarabQueue.push(['cart', cart]);
    renderCart();
}

function checkout() {
    alert('Pagamento Avvenuto con Successo!');
    ScarabQueue.push(['purchase', {
        orderId: '123456789',
        items: cart
    }]);

    cart = []
    ScarabQueue.push(['cart', cart]);
    ScarabQueue.push(['go']);
    
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

renderCart()