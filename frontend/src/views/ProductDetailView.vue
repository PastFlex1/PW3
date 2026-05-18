<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useProducts } from '@/composables/useProducts'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()
const { singleProduct: product, loadingProduct: loading, errorProduct: error, fetchProductById, cancelProduct } = useProducts()

const toastMessage = ref(null)

const handleAddToCart = () => {
  if (!product.value) return
  addToCart(product.value)
  toastMessage.value = `¡"${product.value.name}" añadido al carrito!`
  setTimeout(() => {
    toastMessage.value = null
  }, 3500)
}

const stockStatus = computed(() => {
  if (!product.value) return {}
  if (product.value.stock === 0) return { class: 'badge-out', label: 'Agotado' }
  if (product.value.stock < 5) return { class: 'badge-low', label: `¡Poco stock! (${product.value.stock} disponibles)` }
  return { class: 'badge-ok', label: `En stock (${product.value.stock} disponibles)` }
})

onMounted(() => {
  fetchProductById(route.params.id)
})

// Cancelar petición en curso si el usuario sale antes de terminar de cargar
onUnmounted(() => {
  cancelProduct()
})
</script>

<template>
  <div class="detail-container">
    <!-- Notificación Flotante (Toast) -->
    <div v-if="toastMessage" class="toast-notification">
      🛍️ {{ toastMessage }}
    </div>

    <button class="btn-back" @click="router.push('/')">← Volver al Catálogo</button>

    <div v-if="loading" class="status-box">
      ⏳ Cargando detalles del producto (con reintento automático)...
    </div>

    <div v-else-if="error" class="status-box error">
      ⚠️ {{ error }}
    </div>

    <div v-else-if="product" class="detail-card">
      <div class="img-column">
        <img :src="product.imageUrl" :alt="product.name" v-if="product.imageUrl" />
        <div class="placeholder" v-else>Sin Imagen</div>
      </div>

      <div class="info-column">
        <div class="tag">{{ product.categoryId?.name || 'General' }}</div>
        <h1>{{ product.name }}</h1>
        
        <div class="price-bar">
          <span class="price">${{ product.price }}</span>
          <span :class="stockStatus.class">{{ stockStatus.label }}</span>
        </div>

        <div class="description-section">
          <h3>Descripción del Producto</h3>
          <p>{{ product.description || 'Este producto no cuenta con una descripción detallada en este momento.' }}</p>
        </div>

        <div class="specs">
          <div class="spec-item">
            <span>ID de Producto:</span>
            <strong>{{ product.id || product._id }}</strong>
          </div>
          <div class="spec-item">
            <span>Unidades Disponibles:</span>
            <strong>{{ product.stock }} unidades</strong>
          </div>
        </div>

        <div class="actions">
          <button 
            class="btn-primary btn-lg" 
            @click="handleAddToCart"
            :disabled="product.stock <= 0"
            :class="{ 'disabled': product.stock <= 0 }"
          >
            🛒 Añadir al Carrito
          </button>

          <RouterLink :to="`/product/${product.id || product._id}/edit`" class="btn-edit-detail">
            ✏️ Editar Especificaciones del Producto
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Toast de Notificación */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #10b981;
  color: white;
  padding: 1rem 1.75rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1.05rem;
  box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.4);
  z-index: 1000;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.btn-back {
  background: white;
  color: #334155;
  border: 1px solid var(--border);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f8fafc;
  transform: translateX(-4px);
}

.detail-card {
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  overflow: hidden;
  min-height: 500px;
}

@media (max-width: 768px) {
  .detail-card {
    grid-template-columns: 1fr;
  }
}

.img-column {
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.img-column img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 600px;
}

.placeholder {
  color: #94a3b8;
  font-size: 1.5rem;
  font-weight: 700;
}

.info-column {
  padding: 3.5rem;
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.price-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.price {
  font-size: 2.5rem;
  font-weight: 900;
  color: #4f46e5;
}

.description-section {
  margin-bottom: 2.5rem;
}

.description-section h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.description-section p {
  color: var(--text-light);
  line-height: 1.7;
  font-size: 1.05rem;
}

.specs {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2.5rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: var(--text-light);
}

.spec-item strong {
  color: var(--text);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-edit-detail {
  background: #f59e0b;
  color: white;
  text-align: center;
  text-decoration: none;
  padding: 1rem;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.1rem;
  transition: background 0.2s;
}
.btn-edit-detail:hover { background: #d97706; }

.btn-lg {
  width: 100%;
  padding: 1.25rem;
  font-size: 1.25rem;
  border-radius: 16px;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-box {
  background: white;
  padding: 4rem;
  text-align: center;
  border-radius: var(--radius);
  font-size: 1.25rem;
  font-weight: 700;
  border: 1px solid var(--border);
}
.status-box.error { color: #b91c1c; background: #fef2f2; }
</style>
