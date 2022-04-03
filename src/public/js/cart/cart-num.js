const localCart = JSON.parse(localStorage.getItem('cart'));
var cartIcon = document.querySelector('.cart-icon');
cartIcon.dataset.text = localCart ? localCart.orderItems.length : 0;
