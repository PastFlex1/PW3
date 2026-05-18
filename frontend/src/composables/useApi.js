import { ref } from 'vue'

export function useApi(initialData = null) {
  const data = ref(initialData)
  const loading = ref(false)
  const error = ref(null)
  let abortController = null

  const cancel = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  const execute = async (url, options = {}, retries = 1) => {
    cancel() // Cancelar petición previa si estuviera en curso
    abortController = new AbortController()

    loading.value = true
    error.value = null

    const fetchOptions = {
      credentials: 'include',
      ...options,
      signal: abortController.signal
    }

    try {
      const response = await fetch(url, fetchOptions)
      
      if (response.status === 401) {
        error.value = '🔒 Acceso no autorizado (401). Inicia sesión para acceder a este recurso.'
        return null
      }
      if (response.status === 404) {
        error.value = '🔍 Recurso no encontrado (404).'
        return null
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error del servidor HTTP ${response.status}`)
      }

      const result = await response.json()
      data.value = result
      return result
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`Petición cancelada: ${url}`)
        return null
      }
      
      // Reintento simple si falla la conexión
      if (retries > 0) {
        console.warn(`Petición fallida. Reintentando conexión a ${url}... (${retries} reintento restante)`)
        return await execute(url, options, retries - 1)
      }

      error.value = err.message || 'Error al comunicar con la API del backend.'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute,
    cancel
  }
}
