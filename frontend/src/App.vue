<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const route = useRoute()
const { cartCount } = useCart()

const currentUser = ref(null)
const needAuth = ref(false)
const loginEmail = ref('admin@test.com')
const loginPassword = ref('admin123')
const loginLoading = ref(false)
const loginError = ref(null)

const checkSession = async () => {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      currentUser.value = data.user
      needAuth.value = false
    }
  } catch (err) {
    console.error('Error checking session:', err)
  }
}

const handleLogin = async () => {
  loginLoading.value = true
  loginError.value = null
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value }),
      credentials: 'include'
    })
    const data = await res.json()
    if (!res.ok) {
      loginError.value = data.error || data.errors?.[0]?.msg || 'Credenciales inválidas'
      return
    }
    currentUser.value = data.user
    needAuth.value = false
    if (route.path === '/') {
      window.location.reload()
    }
  } catch (err) {
    loginError.value = 'Error al conectar con el servidor para iniciar sesión.'
  } finally {
    loginLoading.value = false
  }
}

const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    currentUser.value = null
    needAuth.value = true
    if (route.path === '/') {
      window.location.reload()
    }
  } catch (err) {
    console.error('Error logging out:', err)
  }
}

onMounted(async () => {
  await checkSession()
})
</script>

<template>
  <header>
    <div style="display: flex; align-items: center; gap: 2rem;">
      <RouterLink to="/" class="logo">📦 MiInventarioExpress</RouterLink>

      <nav class="nav-links">
        <RouterLink to="/" class="nav-link" active-class="active">Catálogo</RouterLink>
        <RouterLink to="/cart" class="nav-link cart-link" active-class="active">
          🛒 Carrito
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </RouterLink>
        <RouterLink to="/about" class="nav-link" active-class="active">Acerca de</RouterLink>
        
        <RouterLink v-if="currentUser" to="/product/new" class="nav-link btn-new">
          ➕ Nuevo Producto
        </RouterLink>
      </nav>
    </div>
    
    <div style="display: flex; gap: 1rem; align-items: center;">
      <span v-if="currentUser" class="user-badge">👤 {{ currentUser.username }}</span>
      <button v-if="currentUser" class="btn-danger btn-sm" @click="handleLogout">Cerrar Sesión</button>
      <button v-else class="btn-primary btn-sm" @click="needAuth = true">🔑 Iniciar Sesión</button>
    </div>
  </header>

  <main class="container">
    <!-- Modal / Formulario de Login Integrado -->
    <div v-if="needAuth" class="auth-modal-wrapper">
      <div class="auth-card">
        <div class="modal-header">
          <h2>🔒 Iniciar Sesión en la API</h2>
          <button class="btn-close" @click="needAuth = false">❌</button>
        </div>
        <p style="color: var(--text-light); margin-bottom: 1.5rem;">
          Ingresa tus credenciales para administrar el inventario (cuenta por defecto: <strong>admin@test.com / admin123</strong>).
        </p>

        <form @submit.prevent="handleLogin" class="form-login">
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" v-model="loginEmail" placeholder="ej. admin@test.com" required />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" v-model="loginPassword" placeholder="Contraseña" required />
          </div>

          <div v-if="loginError" class="alert-error">
            ⚠️ {{ loginError }}
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;" :disabled="loginLoading">
            {{ loginLoading ? 'Verificando credenciales...' : '🚀 Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Contenido Dinámico con Lazy Loading y Suspense -->
    <RouterView v-else v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <div class="suspense-fallback">
              <div class="spinner"></div>
              <span>Cargando módulo de la aplicación...</span>
            </div>
          </template>
        </Suspense>
      </template>
    </RouterView>
  </main>
</template>

<style scoped>
header {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  padding: 1.25rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover, .nav-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.btn-new {
  background: #10b981 !important;
  color: white !important;
  padding: 0.4rem 0.85rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 800;
}

.btn-new:hover {
  background: #059669 !important;
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-badge {
  background: #ef4444;
  color: white;
  font-size: 0.8rem;
  font-weight: 900;
  padding: 0.15rem 0.5rem;
  border-radius: 50px;
}

.user-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

/* Fallback de Suspense */
.suspense-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 6rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-light);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #cbd5e1;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estilos de Login */
.auth-modal-wrapper {
  display: flex;
  justify-content: center;
  margin: 4rem 0;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  padding: 3rem;
  border-radius: var(--radius);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}

.auth-card h2 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #0f172a;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #334155;
}

.form-group input {
  width: 100%;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  border: 2px solid #cbd5e1;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.alert-error {
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid #fecaca;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  text-align: left;
}
</style>
