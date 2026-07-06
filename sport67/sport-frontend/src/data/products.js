const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Gogo Aero-Run V1",
    series: "Racing Series / Hyper-Responsive",
    price: 4500,
    brand: "Nike",
    sizes: ["M", "L", "XL"],
    colorNames: ["Orange", "Black"],
    badge: "Best Seller",
    badgeType: "primary",
    colors: ["bg-primary", "bg-surface-container-highest", "bg-white"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTnM-8DY9lYLdkxbB1u6YF0F_XEernIKhjHIViEc8ldLCsZhf-fNZmZhXqL5JWQGpt0zshAUhkv0D9NeJfVGLBOlwtsSvml3hEi7mqzGQSRr5xIW_iY_vX_qLvle52Pze3b-LwdLe5VVWQ_xIkIZSwPNePlUyFkWjQeyAA-vONzbLl7aPxcMXWZtrNvagtkoXWTHC_8KRWaAoUkdmZf9j5ikWe0_4orj6UGhV8afvKO-w-n9D0fjDgED3LeWUmsgWa_5QCUBtizvY",
    productType: "clothes",
    clothesType: "shoes",
    sportType: "Running",
    targetGroup: "men",
    fabricMaterial: "polyester",
    amount: 120,
    review: 4.9,
    description: "Premium carbon-plated road racing shoe built for speed.",
    sku: "GA-FW-2024-001",
    status: "Published"
  },
  {
    id: 2,
    name: "Pro Performance Tee",
    series: "Compression Fit / Moisture-Wicking",
    price: 1250,
    brand: "Adidas",
    sizes: ["S", "M", "L"],
    colorNames: ["Black", "Blue"],
    colors: ["bg-surface-container-highest", "bg-secondary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn76oCMWziwU-o3V95aYlmHIkqh4LQQ0EP71hXDYfYnTuJ93tofPdZGB5Ad2-C1ZI5CmJKCkhjt_Bgw-HneHBXKWNwJxvTolx9WDIuqcJT2ujt0rkrsilBz0nVV4deckTmoDBoBLjKiGmK-sVJ3MMgQSbcTl7zyEaQnvTi2E_dnK4bYOD9XDYD7Dx0neZNm50TGWa2JeBZ46JqOdC4jXZmcJ5Ft6Gvz6c97j06Izxi9Cc24I-hQeXucQctNrHTPmK19UNZ-zR6xWk",
    productType: "clothes",
    clothesType: "top",
    sportType: "Running",
    targetGroup: "men",
    fabricMaterial: "polyester",
    amount: 85,
    review: 4.5,
    description: "High-performance compression tee engineered to keep you dry.",
    sku: "GA-CP-2024-089",
    status: "Published"
  },
  {
    id: 3,
    name: "Endurance Flight Shorts",
    series: "Ultra-Lightweight / 5-Inch Inseam",
    price: 1800,
    brand: "Puma",
    sizes: ["S", "M", "XL"],
    colorNames: ["Orange", "Red"],
    badge: "New Arrival",
    badgeType: "tertiary",
    colors: ["bg-primary", "bg-tertiary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVVa5LGRxDJqIDf1aNvUdUZjJwrcK4Z-0HcTkSlHJQzAnvxA1L9cWMwLl5tlYkMoh9NKFAlzlH2WpKKBVSQAnlTWIHIuOpZrMT7TqNZ-IkrKH7AynPTL7pFRpj8ffiJbJAbj2IvUwJuC2nF4zZmmZQhLGapIiLAOEowvajHojGzPDWuuIuxs1yY6Zm_KSnPW8-SyUnAk9c3IgBJITD4hghRR3yiH4UJRZAoJQTfJkFvESJfpQ-hGextcuV4aZFDFnOaDLsIQ0_CPU",
    productType: "clothes",
    clothesType: "bottom",
    sportType: "Running",
    targetGroup: "men",
    fabricMaterial: "cotton",
    amount: 60,
    review: 4.6,
    description: "Extremely breathable lightweight shorts for marathon runners.",
    sku: "GA-RN-2024-003",
    status: "Published"
  },
  {
    id: 4,
    name: "Cloud Strike V3",
    series: "Recovery Series / Max Cushioning",
    price: 3900,
    brand: "Nike",
    sizes: ["M", "L"],
    colorNames: ["White", "Blue"],
    colors: ["bg-white", "bg-secondary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlVYH6ikzf5bxQCYE53SYSRoS5l8txvds81jk9f5Qv3aUhwrb1RQHCwU4nk2NGfVkV0otOrpumXSpPUy_pdwkpSnm6OqCtQexqOFr7RY0-9WxL04JWi9ToIFSRF2BEycoIHT5YQqFgB6Cqzii4O2865S_SHbh-UNtRExTKpxnCcqxGylVP_4NDIKJBVvndJ8PPNA15TQsyqdAZCSq0mRX6_uWICHigPmCIg1rEL1iSn1bMZVwhpZQO5fet7dxOTSmz4Aas8l6VIxY",
    productType: "clothes",
    clothesType: "shoes",
    sportType: "Running",
    targetGroup: "women",
    fabricMaterial: "polyester",
    amount: 140,
    review: 4.8,
    description: "Maximum cushioning daily trainer for plush recovery runs.",
    sku: "GA-FW-2024-004",
    status: "Published"
  },
  {
    id: 5,
    name: "Elite Grip Socks",
    series: "Anatomical Fit / Zero Blister Tech",
    price: 650,
    brand: "Puma",
    sizes: ["S", "M", "L", "XL"],
    colorNames: ["Orange", "Blue"],
    colors: ["bg-primary", "bg-secondary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpTuORnCViF6OIjKpyhLSpFHkEKShjyk2wlpf-5oUQVvQp7EGpllRNoisMKYUo3pl8te_QoyEUQcJQCZITFhtwitZCQ8l5EJz-qQcINXOoDxrMPehLlk7uRB3fkbzjFNkSPiKX7a0gRvi5vGDiiKva8EhVh9yXnLhCBIoEnfeQhQQ3Dlvdi0lr8x5TzsTxXhiliBryHrLpwuhvUPcEruaKAo-i8wp1apxkQAGzYt43FfCV38pbTyrwXzaUt5ic3gW_XsnOr6qcu4",
    productType: "clothes",
    clothesType: "sock",
    sportType: "Football",
    targetGroup: "men",
    fabricMaterial: "waffle",
    amount: 300,
    review: 4.7,
    description: "Anti-slip athletic grip socks with targeted cushioning.",
    sku: "GA-RN-2024-005",
    status: "Published"
  },
  {
    id: 6,
    name: "Gogo Pulse Tracker",
    series: "GPS Multisport / Heart Rate Monitoring",
    price: 4500,
    brand: "Puma",
    sizes: ["M"],
    colorNames: ["Black"],
    colors: ["bg-surface-container-highest"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZX6vjb4OdKismLrui_Wv8pVC6izuolQeLiBvkpev0Y7Q1ZQoR2RKRrdG47sh_E-27fPhk92_4FvCiuqr7pJOfm88cF1pWRdJXZX5h2VTjsv9WxdTrwQU9HpdBH3Wus0bBMVcs2_yX_6xTWyRPzHhhCRo0z6OXMSImaceXRMhOjqfsc3D0f_4QDQjoUjbNv6K1J2qG_2dwMknpqUw6B9PKqFeezLgWMwrDyrFpqiH5AwoL7oYG-kIUuwPCuogbbHJOLazQAkFhMs4",
    productType: "equipment",
    sportType: "Running",
    targetGroup: "men",
    amount: 40,
    review: 4.4,
    description: "Biometric monitoring fitness watch with multi-satellite GPS navigation.",
    sku: "GA-WR-2024-012",
    status: "Published"
  },
  {
    id: 7,
    name: "Strike Elite Football",
    series: "Aerowsculpt Tech / High-Performance Ball",
    price: 1350,
    brand: "Nike",
    sizes: ["M"],
    colorNames: ["White", "Orange"],
    colors: ["bg-white", "bg-primary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn76oCMWziwU-o3V95aYlmHIkqh4LQQ0EP71hXDYfYnTuJ93tofPdZGB5Ad2-C1ZI5CmJKCkhjt_Bgw-HneHBXKWNwJxvTolx9WDIuqcJT2ujt0rkrsilBz0nVV4deckTmoDBoBLjKiGmK-sVJ3MMgQSbcTl7zyEaQnvTi2E_dnK4bYOD9XDYD7Dx0neZNm50TGWa2JeBZ46JqOdC4jXZmcJ5Ft6Gvz6c97j06Izxi9Cc24I-hQeXucQctNrHTPmK19UNZ-zR6xWk",
    productType: "equipment",
    sportType: "Football",
    targetGroup: "kid",
    amount: 150,
    review: 4.8,
    description: "Professional grade soccer ball with molded grooves for consistent flight.",
    sku: "GA-FB-2024-007",
    status: "Published"
  },
  {
    id: 8,
    name: "Hydro-Fast Swim Goggles",
    series: "Anti-Fog / UV Protection / Speed Tech",
    price: 950,
    brand: "Adidas",
    sizes: ["S", "M"],
    colorNames: ["Blue", "Black"],
    colors: ["bg-secondary", "bg-surface-container-highest"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpTuORnCViF6OIjKpyhLSpFHkEKShjyk2wlpf-5oUQVvQp7EGpllRNoisMKYUo3pl8te_QoyEUQcJQCZITFhtwitZCQ8l5EJz-qQcINXOoDxrMPehLlk7uRB3fkbzjFNkSPiKX7a0gRvi5vGDiiKva8EhVh9yXnLhCBIoEnfeQhQQ3Dlvdi0lr8x5TzsTxXhiliBryHrLpwuhvUPcEruaKAo-i8wp1apxkQAGzYt43FfCV38pbTyrwXzaUt5ic3gW_XsnOr6qcu4",
    productType: "equipment",
    sportType: "Swimming",
    targetGroup: "women",
    amount: 90,
    review: 4.5,
    description: "Hydrodynamic swim goggles for competitive training and racing.",
    sku: "GA-SW-2024-008",
    status: "Published"
  },
  {
    id: 9,
    name: "Classic Swim Cap V1",
    series: "100% Silicone / Anti-Slip Fit",
    price: 350,
    brand: "Nike",
    sizes: ["S", "M"],
    colorNames: ["White", "Blue"],
    colors: ["bg-white", "bg-secondary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTnM-8DY9lYLdkxbB1u6YF0F_XEernIKhjHIViEc8ldLCsZhf-fNZmZhXqL5JWQGpt0zshAUhkv0D9NeJfVGLBOlwtsSvml3hEi7mqzGQSRr5xIW_iY_vX_qLvle52Pze3b-LwdLe5VVWQ_xIkIZSwPNePlUyFkWjQeyAA-vONzbLl7aPxcMXWZtrNvagtkoXWTHC_8KRWaAoUkdmZf9j5ikWe0_4orj6UGhV8afvKO-w-n9D0fjDgED3LeWUmsgWa_5QCUBtizvY",
    productType: "clothes",
    clothesType: "hat",
    sportType: "Swimming",
    targetGroup: "kid",
    fabricMaterial: "polyester",
    amount: 250,
    review: 4.6,
    description: "High-grade silicone swim cap designed to reduce drag.",
    sku: "GA-SW-2024-009",
    status: "Published"
  }
];

let storedProducts = [];
try {
  const local = localStorage.getItem('gogo_products');
  if (local) {
    storedProducts = JSON.parse(local);
  } else {
    storedProducts = INITIAL_PRODUCTS;
    localStorage.setItem('gogo_products', JSON.stringify(INITIAL_PRODUCTS));
  }
} catch (e) {
  storedProducts = INITIAL_PRODUCTS;
}

export const PRODUCTS = storedProducts;

export function addProduct(product) {
  PRODUCTS.push(product);
  try {
    localStorage.setItem('gogo_products', JSON.stringify(PRODUCTS));
  } catch (e) {
    console.error("Failed to save products to localStorage", e);
  }
}

export function updateProduct(updatedProduct) {
  const index = PRODUCTS.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    PRODUCTS[index] = { ...PRODUCTS[index], ...updatedProduct };
    try {
      localStorage.setItem('gogo_products', JSON.stringify(PRODUCTS));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  }
}

export function deleteProduct(id) {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index !== -1) {
    PRODUCTS.splice(index, 1);
    try {
      localStorage.setItem('gogo_products', JSON.stringify(PRODUCTS));
    } catch (e) {
      console.error("Failed to delete product from localStorage", e);
    }
  }
}
