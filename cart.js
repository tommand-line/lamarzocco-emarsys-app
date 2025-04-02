let cart = JSON.parse(localStorage.getItem('cart')) || [];

const token = retrieveToken();

function retrieveToken() {
    const user = 'lamarzocco001';
    const secret = 'EZY4HrCKVhB33RYCntJ3';

    const created = new Date().toISOString();
    const nonce = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const digest = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.SHA1(nonce + created + secret).toString(CryptoJS.enc.Hex)));

    return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${created}"`
};

async function sendCartEventToEmarsys() {
    const cart_data = cart.map(it => ({
        title: it.item,
        description: it.price,
        image: "https://lamarzocco-emarsys-app.vercel.app/linea-mini-thumb-1.png"
    }));

    const data = {
        key_id: 3,
        external_id: "t.mandoloni@reply.it",
        data: {
            predict_cart: cart_data
        }
    };
    
    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
            'X-WSSE': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log(result);
}

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
    sendCartEventToEmarsys()
    ScarabQueue.push(['cart', cart]);
    ScarabQueue.push(['go']);
    renderCart();
}

function checkout() {
    alert('Pagamento Avvenuto con Successo!');
    ScarabQueue.push(['purchase', {
        orderId: '123456789',
        items: cart
    }]);

    emptyCart()
    //window.location.href = 'index.html';
}

function emptyCart() {
    cart = []
    sendCartEventToEmarsys()
    ScarabQueue.push(['cart', cart]);
    ScarabQueue.push(['go']);

    localStorage.removeItem('cart');
    renderCart()
}

function backHome() {
    window.location.href = 'index.html';
}

renderCart()