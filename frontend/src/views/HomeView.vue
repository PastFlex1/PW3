<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'
import { useApi } from '@/composables/useApi'
import { useCart } from '@/composables/useCart'

const { products, loadingProducts, errorProducts, fetchProducts, cancelProducts, removeProduct } = useProducts()
const { data: categories, execute: fetchCategories } = useApi([])
const { addToCart } = useCart()

// Estados de filtro
const searchQuery = ref('')
const selectedCategoryId = ref('')
const stockFilter = ref('all')

// Notificación de carrito (Toast)
const toastMessage = ref(null)

const handleAddToCart = (product) => {
  addToCart(product)
  toastMessage.value = `¡"${product.name}" añadido al carrito con éxito!`
  setTimeout(() => {
    toastMessage.value = null
  }, 3500)
}

const deleteProduct = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este producto de la base de datos?')) return
  await removeProduct(id)
}

// Propiedad Computada para la Lista Filtrada
const filteredProducts = computed(() => {
  if (!products.value) return []
  return products.value.filter(prod => {
    // Coincidencia de búsqueda (nombre o descripción)
    const query = searchQuery.value.toLowerCase().trim()
    const matchQuery = !query || 
      prod.name.toLowerCase().includes(query) || 
      (prod.description && prod.description.toLowerCase().includes(query))
      
    // Coincidencia de categoría
    const matchCat = !selectedCategoryId.value || 
      (prod.categoryId && (prod.categoryId.id || prod.categoryId._id) === selectedCategoryId.value)
      
    // Coincidencia de stock
    let matchStock = true
    if (stockFilter.value === 'in-stock') matchStock = prod.stock > 0
    if (stockFilter.value === 'low-stock') matchStock = prod.stock > 0 && prod.stock < 5
    if (stockFilter.value === 'out-of-stock') matchStock = prod.stock === 0
    
    return matchQuery && matchCat && matchStock
  })
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategoryId.value = ''
  stockFilter.value = 'all'
}

onMounted(() => {
  fetchCategories('/api/categories')
  fetchProducts()
})

// Cancelar petición en curso al desmontar si se abandona la vista
onUnmounted(() => {
  cancelProducts()
})
</script>

<template>
  <div class="home">
    <!-- Notificación Flotante (Toast) -->
    <div v-if="toastMessage" class="toast-notification">
      🛍️ {{ toastMessage }}
    </div>

    <div class="banner">
      <h1>Inventario en Tiempo Real con Vue 3</h1>
      <p>Explora nuestro catálogo con búsqueda reactiva en vivo, filtrado instantáneo y medallas de stock.</p>
    </div>

    <!-- Barra de Filtros y Búsqueda Premium -->
    <div class="filter-bar" v-if="!loadingProducts && !errorProducts && products.length > 0">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar producto por nombre o descripción..." 
          class="filter-input search-input" 
        />
        <button v-if="searchQuery" class="btn-clear-input" @click="searchQuery = ''">✕</button>
      </div>

      <div class="filter-controls">
        <select v-model="selectedCategoryId" class="filter-input filter-select">
          <option value="">📁 Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.id || cat._id" :value="cat.id || cat._id">
            {{ cat.name }}
          </option>
        </select>

        <select v-model="stockFilter" class="filter-input filter-select">
          <option value="all">📊 Todo el inventario</option>
          <option value="in-stock">✅ En stock</option>
          <option value="low-stock">⚠️ Poco stock (&lt; 5 unid)</option>
          <option value="out-of-stock">🚨 Agotados (0 unid)</option>
        </select>

        <div class="stats-badge" v-if="searchQuery || selectedCategoryId || stockFilter !== 'all'">
          Mostrando {{ filteredProducts.length }} de {{ products.length }}
          <button class="btn-reset-filters" @click="clearFilters">Limpiar</button>
        </div>
      </div>
    </div>

    <div v-if="loadingProducts" class="status-box loading">
      ⏳ Cargando inventario (con reintento automático en caso de falla)...
    </div>

    <div v-else-if="errorProducts" class="status-box error">
      ⚠️ {{ errorProducts }}
    </div>

    <div v-else-if="products.length === 0" class="status-box empty">
      ℹ️ No se encontraron productos en el inventario general.
    </div>

    <div v-else-if="filteredProducts.length === 0" class="status-box empty-filters">
      <h2>🔍 Sin coincidencias de búsqueda</h2>
      <p>No se encontraron productos con los filtros seleccionados (Categoría, Stock o texto de búsqueda).</p>
      <button class="btn-primary mt-4" @click="clearFilters">Limpiar Filtros de Búsqueda</button>
    </div>

    <div v-else class="grid">
      <ProductCard 
        v-for="prod in filteredProducts" 
        :key="prod.id || prod._id" 
        :product="prod"
        @delete="deleteProduct"
        @added-to-cart="handleAddToCart"
      />
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

.banner {
  text-align: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
}

.banner p {
  color: var(--text-light);
  font-size: 1.15rem;
}

/* Barra de Filtros */
.filter-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: var(--shadow);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: var(--text-light);
  pointer-events: none;
}

.filter-input {
  background: #f8fafc;
  border: 2px solid #cbd5e1;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 1rem;
  color: var(--text);
  transition: all 0.2s;
  outline: none;
}

.search-input {
  width: 100%;
  padding-left: 2.75rem;
  padding-right: 2.5rem;
}

.filter-input:focus {
  background: white;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.btn-clear-input {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: #e2e8f0;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-clear-input:hover {
  background: #cbd5e1;
  color: #0f172a;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.filter-select {
  cursor: pointer;
  min-width: 200px;
}

.stats-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
}

.btn-reset-filters {
  background: #3730a3;
  color: white;
  border: none;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-reset-filters:hover {
  background: #312e81;
}

.status-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 4rem;
  border-radius: var(--radius);
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.status-box.error { color: #b91c1c; background: #fef2f2; border-color: #fca5a5; }

.empty-filters {
  padding: 5rem 2rem;
}

.empty-filters h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.empty-filters p {
  color: var(--text-light);
  font-size: 1.1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
