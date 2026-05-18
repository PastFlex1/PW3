<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete', 'added-to-cart'])

const stockBadgeClass = computed(() => {
  if (props.product.stock === 0) return 'badge-out'
  if (props.product.stock < 5) return 'badge-low'
  return 'badge-ok'
})

const stockLabel = computed(() => {
  if (props.product.stock === 0) return 'Agotado'
  if (props.product.stock < 5) return `¡Poco stock! (${props.product.stock})`
  return `En stock (${props.product.stock})`
})

const categoryName = computed(() => {
  return props.product.categoryId?.name || 'Sin categoría'
})
</script>

<template>
  <div class="card">
    <RouterLink :to="`/product/${product.id || product._id}`" class="img-link">
      <div class="img-container">
        <img :src="product.imageUrl" :alt="product.name" v-if="product.imageUrl" />
        <div class="placeholder" v-else>Sin Imagen</div>
      </div>
    </RouterLink>
    
    <div class="content">
      <div class="tag">{{ categoryName }}</div>
      <RouterLink :to="`/product/${product.id || product._id}`" class="title-link">
        <h3>{{ product.name }}</h3>
      </RouterLink>
      
      <div class="meta">
        <span class="price">${{ product.price }}</span>
        <span :class="stockBadgeClass">{{ stockLabel }}</span>
      </div>
      
      <p class="desc">{{ product.description || 'Sin descripción adicional.' }}</p>
      
      <div class="actions">
        <RouterLink :to="`/product/${product.id || product._id}`" class="btn-secondary">
          👁️ Detalles
        </RouterLink>
        <button 
          class="btn-primary btn-sm" 
          @click="emit('added-to-cart', product)" 
          :disabled="product.stock <= 0"
          :class="{ 'disabled': product.stock <= 0 }"
        >
          🛒 Añadir
        </button>
      </div>

      <div class="admin-actions">
        <RouterLink :to="`/product/${product.id || product._id}/edit`" class="btn-edit btn-xs">
          ✏️ Editar
        </RouterLink>
        <button class="btn-danger btn-xs" @click="emit('delete', product.id || product._id)">🗑️ Eliminar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-link {
  display: block;
}

.title-link {
  text-decoration: none;
  color: inherit;
}

.title-link:hover h3 {
  color: #4f46e5;
}

.img-container {
  height: 220px;
  overflow: hidden;
  position: relative;
  background: #f1f5f9;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover img {
  transform: scale(1.08);
}

.placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-weight: 600;
}

.content {
  padding: 1.5rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: var(--text);
  transition: color 0.2s;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 900;
  color: #4f46e5;
  background: #e0e7ff;
  padding: 0.25rem 0.75rem;
  border-radius: 10px;
}

.desc {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.admin-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-edit {
  background: #f59e0b;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}
.btn-edit:hover { background: #d97706; }

.btn-secondary {
  background: #f1f5f9;
  color: #334155;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;
  text-align: center;
  flex: 1;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-sm {
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  flex: 1;
}

.btn-xs {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
