const cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

const token = retrieveToken()

function retrieveToken() {
    const crypto_js = require('crypto-js');
    var username = "lamarzocco001";
    var secret = "EZY4HrCKVhB33RYCntJ3";
    var ts = (new Date()).toISOString();
    var nonce = crypto_js.lib.WordArray.random(16).toString(crypto_js.enc.Hex);
    var digest = crypto_js.enc.Base64.stringify(crypto_js.enc.Utf8.parse(crypto_js.SHA1(nonce + ts + secret).toString(crypto_js.enc.Hex)));
    return 'UsernameToken Username="' + username + '", PasswordDigest="' + digest + '", Created="' + ts + '", nonce="' + nonce + '"';
}

function sendCartEventToEmarsys() {
    const url = 'https://api.emarsys.net/api/v2/event/938/trigger';
    const headers = {
        'X-WSSE': token,
        'Content-Type': 'application/json'
    };

    const data = {
        key_id: 3,
        external_id: "r.rosiello@reply.it",
        data: {
            predict_cart: cart.map(it => ({
                title: it.item,
                price: it.price,
                description: "prova descrizione"
            }))
        }
    };

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function addToCart(item, price, quantity = 1) {
    alert(`Hai Aggiunto ${item} al Carrello`)
    const productIndex = cart.findIndex(product => product.item === item);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ item, price, quantity });
    }
    ScarabQueue.push(['cart', cart]);
    sendCartEventToEmarsys(cart)
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