window.onload = function() {
  ready()
}

function ready() {
  var quantityInputs = document.querySelectorAll('.field1')
  quantityInputs.forEach(function (item, index) {
    item.addEventListener('change', (e) => quantityChanged(e, item, index))
  })
  updateCartTotal()
}

function quantityChanged(event, item, index) {
  var input = event.target
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1
  }
  updateProductTotal(input.value, index)
}


function updateProductTotal(value, index) {
  var row = document.querySelectorAll('.cart-row')[index]
  var price = row.querySelector('.field2').value
  var total = row.querySelector('.field3')
  total.value = price * value
  updateCartTotal()
}

function updateCartTotal() {
  var total = document.querySelectorAll('.field3')
  var cartTotal = document.querySelector('.total')
  var s = 0
  total.forEach(item => {
    s += Number(item.value)
  })
  cartTotal.value = s
}