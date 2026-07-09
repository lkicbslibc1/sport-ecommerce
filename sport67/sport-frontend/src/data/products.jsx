import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_PRODUCTS } from "./product";



function getStoredProducts() {
  return INITIAL_PRODUCTS;
}
// Save products to localStorage
function saveProducts(products) {
  try {
    localStorage.setItem('gogo_products', JSON.stringify(products));
  } catch (e) {
    console.error("Failed to save products to localStorage", e);
  }
}

// Get orders from localStorage or return empty array
function getStoredOrders() {
  try {
    const stored = localStorage.getItem('gogo_orders');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse orders from localStorage", e);
  }
  return [];
}

// Save orders to localStorage
function saveOrders(orders) {
  try {
    localStorage.setItem('gogo_orders', JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders to localStorage", e);
  }
}

// Initialize localStorage on app start (only if not already set)
function initializeStorage() {
  try {
    if (!localStorage.getItem('gogo_products')) {
      localStorage.setItem('gogo_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem('gogo_orders')) {
      localStorage.setItem('gogo_orders', JSON.stringify([]));
    }
  } catch (e) {
    console.error("Failed to initialize storage", e);
  }
}

// Product Context
const ProductContext = createContext(null);

// Export the context for direct use with useContext
export { ProductContext };

// Custom hook to use product context
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

// Product Provider Component
export function ProductProvider({ children }) {
  const [products, setProducts] = useState(getStoredProducts);

  // Initialize localStorage on first load
  useEffect(() => {
    initializeStorage();
  }, []);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gogo_products') {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated) {
            setProducts(updated);
          }
        } catch (err) {
          console.error("Failed to parse storage event", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addProduct = (product) => {
    const newProducts = [...products, product];
    setProducts(newProducts);
    saveProducts(newProducts);
  };

  const updateProduct = (updatedProduct) => {
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      const newProducts = [...products];
      newProducts[index] = { ...products[index], ...updatedProduct };
      setProducts(newProducts);
      saveProducts(newProducts);
    }
  };

  const deleteProduct = (id) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    saveProducts(newProducts);
  };

  const refreshProducts = () => {
    setProducts(getStoredProducts());
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

// Export initial products for reference (fallback only)
export { INITIAL_PRODUCTS };

// Export orders functions for use in other components
export { getStoredOrders, saveOrders };