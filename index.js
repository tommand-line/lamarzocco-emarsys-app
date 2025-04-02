const cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

const token = retrieveToken();
console.log(token);
console.log(cart);

function retrieveToken() {
    const user = 'lamarzocco001';
    const secret = 'EZY4HrCKVhB33RYCntJ3';

    const created = new Date().toISOString();
    const nonce = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const digest = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.SHA1(nonce + created + secret).toString(CryptoJS.enc.Hex)));

    return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${created}"`
};

// serve per inviare i prodotti a carrello da inserire nella mail tramite evento
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