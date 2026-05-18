import { ref, computed, watch } from 'vue'

const cartItems = ref([])

// Cargar desde localStorage en inicialización
const loadCart = () => {
  try {
    const saved = localStorage.getItem('mi_inventario_cart')
    if (saved) {
      cartItems.value = JSON.parse(saved)
    }
  } catch (err) {
    console.error('Error loading cart from localStorage:', err)
  }
}

loadCart()

// Guardar en localStorage cada vez que cartItems cambia
watch(cartItems, (newVal) => {
  try {
    localStorage.setItem('mi_inventario_cart', JSON.stringify(newVal))
  } catch (err) {
    console.error('Error saving cart to localStorage:', err)
  }
}, { deep: true })

export function useCart() {
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartSubtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const cartTax = computed(() => {
    return Number((cartSubtotal.value * 0.15).toFixed(2)) // 15% IVA
  })

  const cartTotal = computed(() => {
    return Number((cartSubtotal.value + cartTax.value).toFixed(2))
  })

  const addToCart = (product) => {
    const id = product.id || product._id
    const existing = cartItems.value.find(item => (item.id || item._id) === id)
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('No hay más stock disponible de este producto.')
        return
      }
      existing.quantity++
    } else {
      if (product.stock <= 0) {
        alert('Este producto está agotado.')
        return
      }
      cartItems.value.push({
        id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryName: product.categoryId?.name || 'General',
        stock: product.stock,
        quantity: 1
      })
    }
  }

  const removeFromCart = (id) => {
    cartItems.value = cartItems.value.filter(item => (item.id || item._id) !== id)
  }

  const updateQuantity = (id, quantity) => {
    const item = cartItems.value.find(i => (i.id || i._id) === id)
    if (!item) return
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    if (quantity > item.stock) {
      alert(`Solo quedan ${item.stock} unidades en stock.`)
      item.quantity = item.stock
      return
    }
    item.quantity = quantity
  }

  const clearCart = () => {
    cartItems.value = []
  }

  return {
    cartItems,
    cartCount,
    cartSubtotal,
    cartTax,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
}
