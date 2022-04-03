const cart = JSON.parse(localStorage.getItem('cart'));
var cartElm = document.querySelector('.cart');
var checkoutElm = document.querySelector('.checkout');
var html = '';
if (cart.orderItems.length == 0) {
    html = `
      <div
        class="d-flex flex-column align-items-center justify-content-center mb-5">
        <img src="/images/cart-empty.png" alt="" />
        <h3>Giỏ hàng trống!</h3>
      </div>
    `;
} else {
    html = `
      <table class="table table-striped">
        <thead>
            <tr>
                <th>Sản phẩm</th>
                <th class="text-center d-none d-sm-table-cell">Giá</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center d-none d-sm-table-cell">Size</th>
                <th class="text-center d-none d-sm-table-cell">Thành tiền</th>
                <th class="text-center">Thao tác</th>
            </tr>
        </thead>
        <tbody>
    `;
    cart.orderItems.forEach((item) => {
        html += `
      <tr>
          <td>
              <a class="ka-link" href="/menu/${item.slug}">
                  <img
                      src="${item.image}"
                      alt=""
                      class="rounded-circle mr-2"
                      width="40"
                      height="40"
                  />
                  ${item.name}
              </a>
          </td>
          <td class="text-center d-none d-sm-table-cell">
              ${item.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
          </td>
          <td class="text-center">
              <span class="cart-num">${item.amount}</span>
          </td>
          <td class="text-center d-none d-sm-table-cell">${item.size}</td>
          <td class="text-center d-none d-sm-table-cell cart-price">
              ${(item.price * item.amount).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
          </td>
          <td class="text-center">
              <button class="btn btn-danger btn-sm" type="button" onclick="deleteItem('${item.slug}', '${item.size}')">
                  <i class="far fa-trash"></i>
              </button>
          </td>
      </tr>
      `;
    });
    html += `
        </tbody>
    </table>
    `;
    checkoutElm.innerHTML = `
      <div class="mt-5 bg-white shadow rounded p-3">
          <form action="">
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label>Tên khách hàng</label>
                          <input type="text" name="name" class="form-control" required />
                      </div>
                      <div class="form-group">
                          <label>Địa chỉ</label>
                          <input
                              type="text"
                              name="address"
                              class="form-control"          
                              required
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label>Số điện thoại</label>
                          <input type="text" name="phone" class="form-control" required />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="d-flex justify-content-between">
                          <span>Tạm tính</span>
                          <span class="cart-price">
                              ${cart.subtotal.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                          </span>
                      </div>
                      <div class="d-flex justify-content-between">
                          <span>Phí giao hàng</span>
                          <span class="cart-price">
                              ${(20000).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                          </span>
                      </div>
                      <hr />
                      <div class="d-flex justify-content-between">
                          <span>Tổng cộng</span>
                          <span class="cart-price">
                              ${(cart.subtotal + 20000).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                          </span>
                      </div>
                      <input type="hidden" name="cart" value="${cart.orderItems}" />
                      <div class="mt-3">
                          <button class="btn btn-primary w-100">Đặt hàng</button>
                      </div>
                  </div>
              </div>
          </form>
      </div>
    `;
}
cartElm.innerHTML = html;

const deleteItem = (slug, size) => {
    sAlert
        .fire({
            title: 'Bạn có chắc chắn?',
            text: 'Sản phẩm sẽ được xóa khỏi đơn hàng!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        })
        .then((result) => {
            if (result.isConfirmed) {
                console.log(slug);
                cart.orderItems = cart.orderItems.filter((item) => {
                    if (item.slug == slug && item.size == size) {
                        cart.subtotal -= item.amount * item.price;
                    } else {
                        return item;
                    }
                });
                localStorage.setItem('cart', JSON.stringify(cart));
                location.href = '/cart/guest';
            }
        });
};
