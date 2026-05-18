const socket = io();
const API_BASE = "/api/products";
const CATEGORIES_API = "/api/categories";
let productosCache = [];

// --- Sistema de Modales Personalizados ---
function showModal({ title, message, type = "success", onConfirm = null }) {
  const overlay = document.createElement("div");
  overlay.className = "custom-modal-overlay";
  
  const modal = document.createElement("div");
  modal.className = "custom-modal";
  
  const icons = { success: "✅", danger: "⚠️", error: "❌" };
  
  modal.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${icons[type] || "🔔"}</div>
    <h3>${title}</h3>
    <p>${message}</p>
    <div class="modal-actions">
      ${onConfirm ? `<button class="modal-btn modal-btn-cancel" id="modal-cancel">Cancelar</button>` : ""}
      <button class="modal-btn modal-btn-${type}" id="modal-confirm">${onConfirm ? "Confirmar" : "Aceptar"}</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  const close = () => document.body.removeChild(overlay);
  
  document.getElementById("modal-confirm").onclick = () => {
    close();
    if (onConfirm) onConfirm();
  };
  
  const cancelBtn = document.getElementById("modal-cancel");
  if (cancelBtn) cancelBtn.onclick = close;
}
// ----------------------------------------

async function cargarCategorias() {
  try {
    const res = await fetch(CATEGORIES_API);
    const categorias = await res.json();
    const select = document.getElementById("categoryId");
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona una categoría...</option>';
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id || cat._id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
}

async function cargarProductos() {
  try {
    const res = await fetch(API_BASE);
    productosCache = await res.json();
    renderizar(productosCache);
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}

function getStockBadge(stock) {
  if (stock === 0) return '<span class="stock-badge stock-out">Agotado (0)</span>';
  if (stock < 5) return `<span class="stock-badge stock-low">¡Poco stock! (${stock})</span>`;
  return `<span class="stock-badge stock-ok">En stock (${stock})</span>`;
}

function renderizar(productos) {
  const lista = document.getElementById("lista");
  if (!lista) return;
  lista.innerHTML = "";
  if (productos.length === 0) {
    lista.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-light)">No hay productos registrados en el inventario.</div>`;
    return;
  }
  
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "producto-card";
    const imgUrl = p.imageUrl || p.imagen;
    const catName = p.categoryId?.name || "Sin categoría";
    const id = p.id || p._id;
    
    card.innerHTML = `
      <div class="img-container">
        ${imgUrl ? `<img src="${imgUrl}" alt="${escapeHtml(p.name || p.nombre)}">` : `<div style="height:100%; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color:#94a3b8">Sin imagen</div>`}
      </div>
      <div class="producto-info">
        <div class="category-tag">${escapeHtml(catName)}</div>
        <h3>${escapeHtml(p.name || p.nombre)}</h3>
        <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
          <span class="precio">$${p.price || p.precio}</span>
          ${getStockBadge(p.stock || 0)}
        </div>
        <p class="descripcion" style="margin-bottom: 1.5rem;">${escapeHtml(p.description || "Sin descripción adicional")}</p>
        <div class="card-actions">
          <button class="btn-edit" onclick="editar('${id}')">✏️ Editar</button>
          <button class="btn-delete" onclick="eliminar('${id}')">🗑️ Eliminar</button>
        </div>
      </div>
    `;
    lista.appendChild(card);
  });
}

window.editar = (id) => {
  const producto = productosCache.find(p => (p.id || p._id) === id);
  if (!producto) return;
  
  document.getElementById("editProductId").value = id;
  document.getElementById("nombre").value = producto.name || producto.nombre || "";
  document.getElementById("precio").value = producto.price || producto.precio || "";
  document.getElementById("stock").value = producto.stock !== undefined ? producto.stock : 0;
  document.getElementById("descripcion").value = producto.description || "";
  
  if (producto.categoryId) {
    const catId = typeof producto.categoryId === "object" ? (producto.categoryId.id || producto.categoryId._id) : producto.categoryId;
    document.getElementById("categoryId").value = catId || "";
  }
  
  document.getElementById("formTitle").textContent = "✏️ Editar Producto";
  document.getElementById("submitBtn").textContent = "💾 Actualizar Producto";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
  document.querySelector(".form-producto").scrollIntoView({ behavior: "smooth" });
};

window.cancelarEdicion = () => {
  const form = document.getElementById("formProducto");
  if (form) form.reset();
  document.getElementById("editProductId").value = "";
  document.getElementById("formTitle").textContent = "Añadir Nuevo Producto";
  document.getElementById("submitBtn").textContent = "🚀 Guardar Producto";
  document.getElementById("cancelEditBtn").style.display = "none";
};

window.eliminar = async (id) => {
  showModal({
    title: "Eliminar Producto",
    message: "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.",
    type: "danger",
    onConfirm: async () => {
      try {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        cargarProductos();
      } catch (err) {
        showModal({ title: "Error", message: "No se pudo eliminar el producto", type: "error" });
      }
    }
  });
};

const form = document.getElementById("formProducto");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", document.getElementById("nombre").value);
    fd.append("price", document.getElementById("precio").value);
    fd.append("stock", document.getElementById("stock").value);
    fd.append("categoryId", document.getElementById("categoryId").value);
    fd.append("description", document.getElementById("descripcion").value);
    
    const file = document.getElementById("imagen").files[0];
    if (file) fd.append("imageUrl", file);
    
    const editId = document.getElementById("editProductId").value;
    const url = editId ? `${API_BASE}/${editId}` : API_BASE;
    const method = editId ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, { method, body: fd });
      const data = await res.json();
      
      if (!res.ok) {
        showModal({ title: "Error", message: data.error || "No se pudo realizar la operación", type: "error" });
        return;
      }
      
      cancelarEdicion();
      cargarProductos();
      showModal({ title: "¡Éxito!", message: editId ? "Producto actualizado correctamente" : "Producto añadido correctamente", type: "success" });
    } catch (err) {
      showModal({ title: "Error de Conexión", message: "No se pudo comunicar con el servidor", type: "error" });
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m] || m));
}

if (document.getElementById("lista")) {
  cargarCategorias().then(() => cargarProductos());
}

// Lógica del Chat
const chatMensajes = document.getElementById("chat-mensajes");
const mensajeInput = document.getElementById("mensajeInput");
const enviarBtn = document.getElementById("enviarBtn");

if (chatMensajes && mensajeInput && enviarBtn) {
  const agregarMensaje = (data) => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `
      <span class="message-user">${escapeHtml(data.usuario)}</span>
      <div class="message-bubble">${escapeHtml(data.mensaje)}</div>
    `;
    chatMensajes.appendChild(div);
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
  };

  const enviar = () => {
    const msg = mensajeInput.value.trim();
    if (msg) {
      socket.emit("chat message", { mensaje: msg });
      mensajeInput.value = "";
    }
  };

  enviarBtn.addEventListener("click", enviar);
  mensajeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviar();
  });

  socket.on("historial", (mensajes) => {
    chatMensajes.innerHTML = "";
    mensajes.forEach(agregarMensaje);
  });

  socket.on("chat message", agregarMensaje);
}

// Sockets para actualización en tiempo real
socket.on("producto_creado", cargarProductos);
socket.on("producto_actualizado", cargarProductos);
socket.on("producto_eliminado", cargarProductos);