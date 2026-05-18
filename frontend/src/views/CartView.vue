<script setup>
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const { cartItems, cartCount, cartSubtotal, cartTax, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()

const checkout = () => {
  if (cartCount.value === 0) return
  alert(`¡Gracias por tu compra! Se procesó un pago por $${cartTotal.value}.`)
  clearCart()
  router.push('/')
}
</script>

<template>
  <div class="cart-container">
    <div class="cart-header">
      <h1>🛒 Carrito de Compras</h1>
      <button v-if="cartItems.length > 0" class="btn-danger btn-sm" @click="clearCart">
        Vaciar Carrito
      </button>
    </div>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-icon">🛍️</div>
      <h2>Tu carrito está vacío</h2>
      <p>Explora nuestro catálogo y añade productos para comenzar tu pedido.</p>
      <button class="btn-primary" @click="router.push('/')">Ir al Catálogo</button>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items-list">
        <div v-for="item in cartItems" :key="item.id || item._id" class="cart-item-card">
          <img :src="item.imageUrl" :alt="item.name" v-if="item.imageUrl" class="item-img" />
          <div class="placeholder-img" v-else>Sin Imagen</div>

          <div class="item-details">
            <span class="tag">{{ item.categoryName }}</span>
            <h3>{{ item.name }}</h3>
            <span class="unit-price">${{ item.price }} c/u</span>
          </div>

          <div class="quantity-controls">
            <button class="btn-qty" @click="updateQuantity(item.id || item._id, item.quantity - 1)">-</button>
            <span class="qty-display">{{ item.quantity }}</span>
            <button class="btn-qty" @click="updateQuantity(item.id || item._id, item.quantity + 1)">+</button>
          </div>

          <div class="item-total">
            <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
          </div>

          <button class="btn-remove" @click="removeFromCart(item.id || item._id)">❌</button>
        </div>
      </div>

      <div class="cart-summary-box">
        <h2>Resumen del Pedido</h2>
        
        <div class="summary-line">
          <span>Subtotal ({{ cartCount }} ítems):</span>
          <strong>${{ cartSubtotal.toFixed(2) }}</strong>
        </div>

        <div class="summary-line">
          <span>IVA estimado (15%):</span>
          <strong>${{ cartTax.toFixed(2) }}</strong>
        </div>

        <div class="summary-line total-line">
          <span>Total a Pagar:</span>
          <strong class="total-price">${{ cartTotal.toFixed(2) }}</strong>
        </div>

        <button class="btn-primary btn-checkout" @click="checkout">
          💳 Proceder al Pago
        </button>

        <button class="btn-secondary btn-continue" @click="router.push('/')">
          ← Continuar Comprando
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--text);
}

.empty-cart {
  background: white;
  border-radius: var(--radius);
  padding: 6rem 3rem;
  text-align: center;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.empty-icon {
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
}

.empty-cart h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.empty-cart p {
  color: var(--text-light);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 992px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart-item-card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

@media (max-width: 640px) {
  .cart-item-card {
    flex-direction: column;
    text-align: center;
  }
}

.item-img, .placeholder-img {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  object-fit: cover;
}

.placeholder-img {
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 700;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.unit-price {
  color: var(--text-light);
  font-size: 0.95rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.btn-qty {
  background: white;
  border: 1px solid #cbd5e1;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-qty:hover {
  background: #e2e8f0;
}

.qty-display {
  font-weight: 800;
  font-size: 1.1rem;
  min-width: 24px;
  text-align: center;
}

.item-total {
  font-size: 1.35rem;
  font-weight: 900;
  color: #4f46e5;
  min-width: 100px;
  text-align: right;
}

.btn-remove {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-remove:hover {
  opacity: 1;
}

.cart-summary-box {
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  padding: 2.5rem;
  box-shadow: var(--shadow);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.cart-summary-box h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  color: var(--text-light);
  font-size: 1.05rem;
}

.summary-line strong {
  color: var(--text);
  font-weight: 800;
}

.total-line {
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #cbd5e1;
  color: var(--text);
  font-size: 1.35rem;
  font-weight: 900;
}

.total-price {
  color: #4f46e5 !important;
  font-size: 1.8rem;
}

.btn-checkout {
  width: 100%;
  padding: 1.15rem;
  font-size: 1.15rem;
  border-radius: 14px;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.btn-continue {
  width: 100%;
  background: #f8fafc;
  color: #475569;
  border: 1px solid var(--border);
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-continue:hover {
  background: #e2e8f0;
}
</style>
