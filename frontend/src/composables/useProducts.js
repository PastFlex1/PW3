import { useApi } from './useApi'

export function useProducts() {
  const { data: products, loading: loadingProducts, error: errorProducts, execute: execGetProducts, cancel: cancelProducts } = useApi([])
  const { data: singleProduct, loading: loadingProduct, error: errorProduct, execute: execGetProductById, cancel: cancelProduct } = useApi(null)
  const { loading: deletingProduct, error: deleteError, execute: execDelete } = useApi(null)

  const fetchProducts = async () => {
    return await execGetProducts('/api/products')
  }

  const fetchProductById = async (id) => {
    return await execGetProductById(`/api/products/${id}`)
  }

  const removeProduct = async (id) => {
    const res = await execDelete(`/api/products/${id}`, { method: 'DELETE' })
    if (products.value && (res || !deleteError.value)) {
      products.value = products.value.filter(p => (p.id || p._id) !== id)
    }
    return res
  }

  return {
    products,
    loadingProducts,
    errorProducts,
    fetchProducts,
    cancelProducts,

    singleProduct,
    loadingProduct,
    errorProduct,
    fetchProductById,
    cancelProduct,

    deletingProduct,
    deleteError,
    removeProduct
  }
}
