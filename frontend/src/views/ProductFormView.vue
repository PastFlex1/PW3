<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useProducts } from '@/composables/useProducts'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const { singleProduct, loadingProduct, errorProduct, fetchProductById } = useProducts()
const { data: categories, execute: fetchCategories } = useApi([])
const { execute: submitApi, loading: saving, error: submitError } = useApi(null)

const form = ref({
  name: '',
  description: '',
  price: '',
  categoryId: '',
  stock: '',
  imageUrl: ''
})

const errors = ref({})
const touched = ref({})

const validate = () => {
  errors.value = {}
  let valid = true

  if (!form.value.name || form.value.name.trim().length < 2) {
    errors.value.name = 'El nombre es obligatorio (mínimo 2 caracteres).'
    valid = false
  }

  const priceNum = parseFloat(form.value.price)
  if (isNaN(priceNum) || priceNum <= 0) {
    errors.value.price = 'El precio debe ser un valor numérico mayor que 0.'
    valid = false
  }

  if (!form.value.categoryId) {
    errors.value.categoryId = 'La categoría es obligatoria.'
    valid = false
  }

  const stockNum = parseInt(form.value.stock, 10)
  if (isNaN(stockNum) || stockNum < 0) {
    errors.value.stock = 'El stock debe ser un número entero mayor o igual a 0.'
    valid = false
  }

  if (form.value.imageUrl && form.value.imageUrl.trim()) {
    const url = form.value.imageUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      errors.value.imageUrl = 'La URL de la imagen debe ser válida y comenzar por http:// o https://.'
      valid = false
    }
  }

  return valid
}

const handleInput = (field) => {
  touched.value[field] = true
  validate()
}

const handleSubmit = async () => {
  if (!validate()) {
    // Marcar todos como tocados para mostrar errores
    Object.keys(form.value).forEach(key => touched.value[key] = true)
    return
  }

  const payload = {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    price: parseFloat(form.value.price),
    categoryId: form.value.categoryId,
    stock: parseInt(form.value.stock, 10),
    imageUrl: form.value.imageUrl.trim()
  }

  const url = isEdit.value ? `/api/products/${route.params.id}` : '/api/products'
  const method = isEdit.value ? 'PUT' : 'POST'

  const res = await submitApi(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (res || !submitError.value) {
    alert(`¡Producto ${isEdit.value ? 'actualizado' : 'creado'} exitosamente!`)
    router.push('/')
  }
}

onMounted(async () => {
  await fetchCategories('/api/categories')
  if (isEdit.value) {
    const prod = await fetchProductById(route.params.id)
    if (prod) {
      form.value = {
        name: prod.name || '',
        description: prod.description || '',
        price: prod.price || '',
        categoryId: prod.categoryId?._id || prod.categoryId?.id || prod.categoryId || '',
        stock: prod.stock !== undefined ? prod.stock : '',
        imageUrl: prod.imageUrl || ''
      }
    }
  }
})
</script>

<template>
  <div class="form-container">
    <button class="btn-back" @click="router.push('/')">← Cancelar y Volver al Catálogo</button>

    <div v-if="loadingProduct" class="status-box">
      ⏳ Cargando datos del producto para edición...
    </div>

    <div v-else-if="errorProduct" class="status-box error">
      ⚠️ {{ errorProduct }}
    </div>

    <div v-else class="form-card">
      <div class="form-header">
        <h1>{{ isEdit ? '✏️ Editar Producto' : '📦 Añadir Nuevo Producto' }}</h1>
        <p>Completa los campos a continuación. Los campos marcados con * son obligatorios.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="product-form">
        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Nombre del Producto *</label>
          <input 
            id="name"
            type="text" 
            v-model="form.name" 
            @input="handleInput('name')"
            placeholder="Ej. Laptop Gaming RTX 4070" 
            :class="{ 'input-error': touched.name && errors.name }"
          />
          <span class="error-text" v-if="touched.name && errors.name">{{ errors.name }}</span>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="desc">Descripción</label>
          <textarea 
            id="desc"
            v-model="form.description" 
            rows="3" 
            placeholder="Describe las características y detalles del producto..."
          ></textarea>
        </div>

        <div class="form-row">
          <!-- Precio -->
          <div class="form-group col">
            <label for="price">Precio ($ USD) *</label>
            <input 
              id="price"
              type="number" 
              step="0.01" 
              v-model="form.price" 
              @input="handleInput('price')"
              placeholder="Ej. 1299.99" 
              :class="{ 'input-error': touched.price && errors.price }"
            />
            <span class="error-text" v-if="touched.price && errors.price">{{ errors.price }}</span>
          </div>

          <!-- Stock -->
          <div class="form-group col">
            <label for="stock">Stock Inicial *</label>
            <input 
              id="stock"
              type="number" 
              step="1" 
              v-model="form.stock" 
              @input="handleInput('stock')"
              placeholder="Ej. 15" 
              :class="{ 'input-error': touched.stock && errors.stock }"
            />
            <span class="error-text" v-if="touched.stock && errors.stock">{{ errors.stock }}</span>
          </div>
        </div>

        <!-- Categoría -->
        <div class="form-group">
          <label for="category">Categoría *</label>
          <select 
            id="category"
            v-model="form.categoryId" 
            @change="handleInput('categoryId')"
            :class="{ 'input-error': touched.categoryId && errors.categoryId }"
          >
            <option value="">-- Selecciona una categoría --</option>
            <option v-for="cat in categories" :key="cat.id || cat._id" :value="cat.id || cat._id">
              {{ cat.name }}
            </option>
          </select>
          <span class="error-text" v-if="touched.categoryId && errors.categoryId">{{ errors.categoryId }}</span>
        </div>

        <!-- URL de la Imagen -->
        <div class="form-group">
          <label for="img">URL de la Imagen Fotográfica</label>
          <input 
            id="img"
            type="text" 
            v-model="form.imageUrl" 
            @input="handleInput('imageUrl')"
            placeholder="Ej. https://images.unsplash.com/photo-..." 
            :class="{ 'input-error': touched.imageUrl && errors.imageUrl }"
          />
          <span class="error-text" v-if="touched.imageUrl && errors.imageUrl">{{ errors.imageUrl }}</span>

          <div class="img-preview" v-if="form.imageUrl && !errors.imageUrl">
            <img :src="form.imageUrl" alt="Vista previa" @error="form.imageUrl = ''" />
            <span>Vista previa de la imagen</span>
          </div>
        </div>

        <div v-if="submitError" class="submit-error-box">
          ⚠️ Error del Servidor: {{ submitError }}
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="router.push('/')">Cancelar</button>
          <button type="submit" class="btn-primary btn-submit" :disabled="saving">
            {{ saving ? 'Guardando en backend...' : (isEdit ? '💾 Guardar Cambios' : '🚀 Registrar Producto') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 750px;
  margin: 0 auto 4rem;
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

.form-card {
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 3.5rem;
}

.form-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

h1 {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-light);
  font-size: 1.05rem;
}

.form-group {
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.col {
  flex: 1;
}

@media (max-width: 640px) {
  .form-row { flex-direction: column; gap: 0; }
}

label {
  font-weight: 800;
  font-size: 0.95rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

input, textarea, select {
  width: 100%;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  border: 2px solid #cbd5e1;
  font-size: 1rem;
  font-family: inherit;
  color: var(--text);
  background: #f8fafc;
  transition: all 0.2s;
}

input:focus, textarea:focus, select:focus {
  background: white;
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.input-error {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.error-text {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 0.4rem;
}

.img-preview {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 12px;
}

.img-preview img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

.img-preview span {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
}

.submit-error-box {
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #fca5a5;
  font-weight: 700;
  margin-bottom: 2rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-submit {
  padding: 0.85rem 2rem;
  font-size: 1.05rem;
}
</style>
