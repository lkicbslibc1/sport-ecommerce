import { createContext, useContext, useState, useEffect } from "react";

const INITIAL_PRODUCTS = [];

const API_BASE_URL = 'http://localhost:5000/api';

async function fetchFromAPI(resource, fallbackData) {
  try {
    const res = await fetch(`${API_BASE_URL}/${resource}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error(`API Error fetching ${resource}:`, error);
  }
  return fallbackData;
}

async function saveToAPI(resource, data) {
  try {
    await fetch(`${API_BASE_URL}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error(`API Error saving ${resource}:`, error);
  }
}

// Export orders functions for use in other components
export async function getStoredOrders() {
  return await fetchFromAPI('orders', []);
}

export async function saveOrders(orders) {
  await saveToAPI('orders', orders);
}

// Get reviews
export async function getStoredReviews() {
  return await fetchFromAPI('reviews', {});
}

// Save reviews
export async function saveReviews(reviews) {
  await saveToAPI('reviews', reviews);
}

// Product Context
const ProductContext = createContext(null);
export { ProductContext };

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

// Product Provider Component
export function ProductProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Initialize from API on first load
  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await fetchFromAPI('products', INITIAL_PRODUCTS);
      
      if (fetchedProducts && fetchedProducts.length > 0) {
        // Merge with initial products to ensure image/colors remain intact
        const merged = fetchedProducts.map(p => {
          const initial = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if (initial) {
            return {
              ...p,
              image: initial.image,
              sizes: initial.sizes || p.sizes,
              colorImages: initial.colorImages || p.colorImages,
              colors: initial.colors || p.colors,
              colorNames: initial.colorNames || p.colorNames
            };
          }
          return p;
        });

        // Add any products from INITIAL_PRODUCTS that are not in the fetched list
        const parsedIds = new Set(merged.map(p => p.id));
        const newFromInitial = INITIAL_PRODUCTS.filter(ip => !parsedIds.has(ip.id));
        const finalProducts = [...merged, ...newFromInitial];

        setProducts(finalProducts);
        // Sync back the fully merged list to API
        saveToAPI('products', finalProducts);
      } else {
        // Empty API, seed with initial products
        setProducts(INITIAL_PRODUCTS);
        saveToAPI('products', INITIAL_PRODUCTS);
      }
    }
    loadProducts();
  }, []);

  const addProduct = async (product) => {
    const newProducts = [...products, product];
    setProducts(newProducts);
    await saveToAPI('products', newProducts);
  };

  const updateProduct = async (updatedProduct) => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        const newProducts = [...prev];
        newProducts[index] = { ...prev[index], ...updatedProduct };
        // Fire and forget save to API so state updates immediately
        saveToAPI('products', newProducts);
        return newProducts;
      }
      return prev;
    });
  };

  const deleteProduct = async (id) => {
    setProducts(prev => {
      const newProducts = prev.filter(p => p.id !== id);
      saveToAPI('products', newProducts);
      return newProducts;
    });
  };

  const refreshProducts = async () => {
    const fetched = await fetchFromAPI('products', INITIAL_PRODUCTS);
    if (fetched && fetched.length > 0) {
      setProducts(fetched);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export { INITIAL_PRODUCTS };