<script setup>
</script>

<template>
  <div class="about-container">
    <div class="about-card">
      <div class="header-section">
        <h1>ℹ️ Acerca del Proyecto</h1>
        <p>Una solución moderna de gestión de inventario en tiempo real con arquitectura de Single Page Application (SPA).</p>
      </div>

      <div class="tech-stack">
        <h2>🛠️ Tecnologías Empleadas</h2>
        
        <div class="tech-grid">
          <div class="tech-item">
            <span class="icon">⚡</span>
            <h3>Vue 3 + Vite</h3>
            <p>Estructura moderna basada en Single File Components (SFC) y composición reactiva para una UI veloz.</p>
          </div>

          <div class="tech-item">
            <span class="icon">🟢</span>
            <h3>Node.js + Express</h3>
            <p>Servidor RESTful robusto con protección de rutas, manejo estricto de códigos HTTP (400, 401, 404, 500) y validaciones.</p>
          </div>

          <div class="tech-item">
            <span class="icon">🍃</span>
            <h3>MongoDB + Mongoose</h3>
            <p>Base de datos NoSQL escalable con virtuals activados para mapear limpiamente identificadores y esquemas relacionados.</p>
          </div>

          <div class="tech-item">
            <span class="icon">🔌</span>
            <h3>Socket.io</h3>
            <p>Comunicación bidireccional en tiempo real para mantener sincronizado el inventario entre múltiples clientes activos.</p>
          </div>
        </div>
      </div>

      <div class="credits">
        <h3>Desarrollado para la Tarea de la Unidad 2</h3>
        <p>MiInventarioExpress v2.0 - 2026</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-card {
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 4rem;
}

.header-section {
  text-align: center;
  margin-bottom: 4rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--border);
}

h1 {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 1rem;
}

.header-section p {
  color: var(--text-light);
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
}

.tech-stack h2 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  text-align: center;
  color: #0f172a;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.tech-item {
  background: #f8fafc;
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s;
}

.tech-item:hover {
  transform: translateY(-5px);
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
}

.icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.tech-item h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: #1e293b;
}

.tech-item p {
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

.credits {
  text-align: center;
  padding-top: 2.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-light);
  font-weight: 600;
}
</style>
