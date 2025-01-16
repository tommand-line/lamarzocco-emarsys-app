const cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

const token = retrieveToken();
console.log(token);
console.log(cart);

function retrieveToken() {
    const username = "lamarzocco001";
    const password = "EZY4HrCKVhB33RYCntJ3";
    const created = new Date().toISOString();
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    const digest = CryptoJS.SHA256(nonce + created + password).toString(CryptoJS.enc.Base64);
    //return 'UsernameToken Username="' + username + '", PasswordDigest="' + digest + '", Created="' + created + '", nonce="' + nonce + '"';
    return 'UsernameToken Username="lamarzocco001", PasswordDigest="ZTlkYzQ4OWRlNjU2YmY0NTA1NmU2NDIzYzEyZmNmNjViYzY1N2UxZQ==", Created="2025-01-16T15:09:18.907Z", nonce="3eb27e94533c9f11b7a9cb184e226af2"';
}

async function sendCartEventToEmarsys() {
    /*const url = 'https://api.emarsys.net/api/v2/event/938/trigger';
    const headers = {
        'X-WSSE': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://api.emarsys.net'
    };

    const cart_data = cart.map(it => ({
        title: it.item,
        description: it.price,
        image: "https://lamarzocco-emarsys-app.vercel.app/linea-mini-thumb-1.png"
    }));

    const data = {
        key_id: 3,
        external_id: "r.rosiello@reply.it",
        data: {
            predict_cart: cart_data
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
    });*/
    const cart_data = cart.map(it => ({
        title: it.item,
        description: it.price,
        image: "https://lamarzocco-emarsys-app.vercel.app/linea-mini-thumb-1.png"
    }));

    const data = {
        key_id: 3,
        external_id: "r.rosiello@reply.it",
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

function addToCart(item, price, quantity = 1) {
    alert(`Hai Aggiunto ${item} al Carrello`)
    const productIndex = cart.findIndex(product => product.item === item);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ item, price, quantity });
    }
    sendCartEventToEmarsys()
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