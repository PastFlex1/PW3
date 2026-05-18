<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-card">
      <div class="error-code">404</div>
      <h1>Página No Encontrada</h1>
      <p>Lo sentimos, la ruta a la que intentas acceder no existe en esta Single Page Application.</p>
      
      <button class="btn-primary btn-return" @click="router.push('/')">
        ← Volver al Catálogo Principal
      </button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.not-found-card {
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 6rem 4rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.error-code {
  font-size: 7rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 1rem;
}

p {
  color: var(--text-light);
  font-size: 1.15rem;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.btn-return {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}
</style>
