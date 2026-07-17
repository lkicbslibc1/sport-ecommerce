const fs = require('fs');
const path = 'c:\\Users\\mook\\OneDrive\\Documents\\GitHub\\sport-ecommerce\\sport67\\sport-frontend\\src\\admin\\Products.jsx';
let content = fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

const replacements = [
    {
        old: `import {
    Boxes,
    Search,
    Bell,
    UserCircle,
    Pencil,
    ChevronLeft,
    ChevronRight,
    X,
    Plus,
    Trash2,
    Package,
    ArrowUpDown,
    ChevronUp,
    ChevronDown
} from "lucide-react";
import { ProductContext } from "../data/products.jsx";`,
        new: `import {
    Search,
    Bell,
    UserCircle,
    Pencil,
    ChevronLeft,
    ChevronRight,
    X,
    Plus,
    Trash2,
    Package,
    ArrowUpDown,
    ChevronUp,
    ChevronDown,
    Upload,
    ImageIcon
} from "lucide-react";
import { ProductContext, getSizeOptions, getTotalStock } from "../data/products.jsx";`
    },
    {
        old: `];

export default function GogoAthleticProducts({ onNavigate, onViewChange, user, setUser }) {`,
        new: `];

// Default empty color variant
const makeEmptyVariant = (color = "") => ({
    color,
    colorClass: COLOR_CLASSES[color] || "bg-white",
    image: "",
    amount: 0,       // used when no sizes (equipment)
    stock: {}        // { "S": 10, "M": 5, ... } or { "38": 3, ... }
});

export default function GogoAthleticProducts({ onNavigate, onViewChange, user, setUser }) {`
    },
    {
        old: `    const [selectedItem, setSelectedItem] = useState(null);
    const [newQty, setNewQty] = useState("");
    const [adjustmentReason, setAdjustmentReason] = useState("Restock Received");
    const [selectedColors, setSelectedColors] = useState([]);

    const [formFields, setFormFields] = useState({
        name: "",
        sku: "",
        price: "",
        brand: "Nike",
        sportType: "Running",
        targetGroup: "men",
        amount: "100",
        image: "",
        description: "",
        status: "Published",
        productType: "clothes",
        clothesType: "shoes"
    });

    const handleOpenAdd = () => {
        setCurrentProduct(null);
        setFormFields({
            name: "",
            sku: "",
            price: "",
            brand: "Nike",
            sportType: "Running",
            targetGroup: "men",
            amount: "100",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTnM-8DY9lYLdkxbB1u6YF0F_XEernIKhjHIViEc8ldLCsZhf-fNZmZhXqL5JWQGpt0zshAUhkv0D9NeJfVGLBOlwtsSvml3hEi7mqzGQSRr5xIW_iY_vX_qLvle52Pze3b-LwdLe5VVWQ_xIkIZSwPNePlUyFkWjQeyAA-vONzbLl7aPxcMXWZtrNvagtkoXWTHC_8KRWaAoUkdmZf9j5ikWe0_4orj6UGhV8afvKO-w-n9D0fjDgED3LeWUmsgWa_5QCUBtizvY",
            description: "Elite high-performance gear built for athletes.",
            status: "Published",
            productType: "clothes",
            clothesType: "shoes"
        });
        setSelectedColors(["orange", "black"]);
        setModalOpen(true);
    };`,
        new: `    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustQtyColor, setAdjustQtyColor] = useState("");
    const [adjustQtySize, setAdjustQtySize] = useState("");
    const [newQty, setNewQty] = useState("");
    const [adjustmentReason, setAdjustmentReason] = useState("Restock Received");

    // Color variants: array of { color, colorClass, image, amount, stock: {size: qty} }
    const [colorVariants, setColorVariants] = useState([makeEmptyVariant()]);

    const [formFields, setFormFields] = useState({
        name: "",
        sku: "",
        price: "",
        brand: "Nike",
        sportType: "Running",
        targetGroup: "men",
        description: "",
        status: "Published",
        productType: "clothes",
        clothesType: "shoes"
    });

    // Compute sizes for current form selection
    const currentSizes = useMemo(() => getSizeOptions(formFields.productType, formFields.clothesType), [formFields.productType, formFields.clothesType]);

    const handleOpenAdd = () => {
        setCurrentProduct(null);
        setFormFields({
            name: "",
            sku: "",
            price: "",
            brand: "Nike",
            sportType: "Running",
            targetGroup: "men",
            description: "Elite high-performance gear built for athletes.",
            status: "Published",
            productType: "clothes",
            clothesType: "shoes"
        });
        setColorVariants([makeEmptyVariant("orange"), makeEmptyVariant("black")]);
        setModalOpen(true);
    };`
    },
    {
        old: `        setFormFields({
            name: product.name || "",
            sku: product.sku || "",
            price: product.price ? product.price.toString() : "",
            brand: product.brand || "Nike",
            sportType: product.sportType || "Running",
            targetGroup: product.targetGroup || "men",
            amount: product.amount ? product.amount.toString() : "100",
            image: product.image || "",
            description: product.description || "",
            status: product.status || "Published",
            productType: product.productType || "clothes",
            clothesType: product.clothesType || ""
        });
        const initialColors = product.colorNames 
            ? product.colorNames.map(c => c.toLowerCase()) 
            : [];
        setSelectedColors(initialColors);
        setModalOpen(true);
    };

    const handleOpenAdjust = (item) => {
        setSelectedItem(item);
        setNewQty(item.amount.toString());
        setStockModalOpen(true);
    };

    const handleStockFormSubmit = (e) => {
        e.preventDefault();
        if (!selectedItem) return;
        const qtyNum = parseInt(newQty);
        if (isNaN(qtyNum) || qtyNum < 0) {
            showAlert("Please enter a valid stock quantity.", "warning");
            return;
        }

        updateProduct({
            id: selectedItem.id,
            amount: qtyNum
        });

        setStockModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleColor = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormFields(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formFields.image) {
            showAlert("Please upload an image file or enter an image URL.", "warning");
            return;
        }
        const priceNum = parseFloat(formFields.price) || 0;
        const amountNum = parseInt(formFields.amount) || 0;`,
        new: `        setFormFields({
            name: product.name || "",
            sku: product.sku || "",
            price: product.price ? product.price.toString() : "",
            brand: product.brand || "Nike",
            sportType: product.sportType || "Running",
            targetGroup: product.targetGroup || "men",
            description: product.description || "",
            status: product.status || "Published",
            productType: product.productType || "clothes",
            clothesType: product.clothesType || "shoes"
        });
        // Restore colorVariants from product data
        if (product.colorVariants && product.colorVariants.length > 0) {
            setColorVariants(product.colorVariants.map(v => ({ ...v, stock: v.stock || {}, amount: v.amount || 0 })));
        } else {
            // Fallback: build from old colorNames
            const oldColors = product.colorNames ? product.colorNames.map(c => c.toLowerCase()) : ["black"];
            const sizes = getSizeOptions(product.productType, product.clothesType);
            setColorVariants(oldColors.map(color => {
                const variant = makeEmptyVariant(color);
                variant.image = product.colorImages?.[color] || product.image || "";
                if (sizes.length > 0) {
                    variant.stock = Object.fromEntries(sizes.map(s => [s, Math.floor((product.amount || 0) / (oldColors.length * sizes.length))])); 
                } else {
                    variant.amount = Math.floor((product.amount || 0) / oldColors.length);
                }
                return variant;
            }));
        }
        setModalOpen(true);
    };

    const handleOpenAdjust = (item) => {
        setSelectedItem(item);
        const firstVariant = item.colorVariants?.[0];
        const initColor = firstVariant?.color || item.colorNames?.[0]?.toLowerCase() || "";
        setAdjustQtyColor(initColor);
        const sizes = getSizeOptions(item.productType, item.clothesType);
        setAdjustQtySize(sizes[0] || "");
        const initStock = firstVariant?.stock?.[sizes[0]] ?? firstVariant?.amount ?? item.amount;
        setNewQty(String(initStock));
        setStockModalOpen(true);
    };

    // ---- Variant helpers ----
    const handleVariantColorChange = (idx, color) => {
        setColorVariants(prev => prev.map((v, i) => i === idx ? { ...v, color, colorClass: COLOR_CLASSES[color] || "bg-white" } : v));
    };

    const handleVariantImageFile = (idx, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setColorVariants(prev => prev.map((v, i) => i === idx ? { ...v, image: reader.result } : v));
        };
        reader.readAsDataURL(file);
    };

    const handleVariantImageUrl = (idx, url) => {
        setColorVariants(prev => prev.map((v, i) => i === idx ? { ...v, image: url } : v));
    };

    const handleVariantStockChange = (idx, size, value) => {
        setColorVariants(prev => prev.map((v, i) => {
            if (i !== idx) return v;
            if (size === "__amount") return { ...v, amount: parseInt(value) || 0 };
            return { ...v, stock: { ...v.stock, [size]: parseInt(value) || 0 } };
        }));
    };

    const handleAddVariant = () => {
        const usedColors = colorVariants.map(v => v.color);
        const nextColor = COLOR_NAMES.find(c => !usedColors.includes(c)) || "";
        setColorVariants(prev => [...prev, makeEmptyVariant(nextColor)]);
    };

    const handleRemoveVariant = (idx) => {
        if (colorVariants.length <= 1) { showAlert("At least one color variant is required.", "warning"); return; }
        setColorVariants(prev => prev.filter((_, i) => i !== idx));
    };

    const handleStockFormSubmit = (e) => {
        e.preventDefault();
        if (!selectedItem) return;
        const qtyNum = parseInt(newQty);
        if (isNaN(qtyNum) || qtyNum < 0) {
            showAlert("Please enter a valid stock quantity.", "warning");
            return;
        }
        const sizes = getSizeOptions(selectedItem.productType, selectedItem.clothesType);
        let updatedVariants = (selectedItem.colorVariants || []).map(v => ({ ...v, stock: { ...v.stock } }));
        const variantIdx = updatedVariants.findIndex(v => v.color === adjustQtyColor);
        if (variantIdx === -1) {
            showAlert("Color variant not found.", "warning");
            return;
        }
        if (sizes.length === 0) {
            updatedVariants[variantIdx].amount = qtyNum;
        } else {
            updatedVariants[variantIdx].stock[adjustQtySize] = qtyNum;
        }
        // Recalculate total amount
        let total = 0;
        updatedVariants.forEach(v => {
            if (sizes.length === 0) { total += v.amount || 0; }
            else { Object.values(v.stock || {}).forEach(q => { total += parseInt(q) || 0; }); }
        });
        updateProduct({ id: selectedItem.id, colorVariants: updatedVariants, amount: total });
        setStockModalOpen(false);
        showAlert("Stock updated successfully.", "success");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Validate: every variant must have an image
        const missingImage = colorVariants.some(v => !v.image);
        if (missingImage) {
            showAlert("Please upload or enter an image for every color variant.", "warning");
            return;
        }
        if (colorVariants.length === 0) {
            showAlert("Please add at least one color variant.", "warning");
            return;
        }

        const priceNum = parseFloat(formFields.price) || 0;
        const sizes = getSizeOptions(formFields.productType, formFields.clothesType);

        // Compute total amount from variants
        let totalAmount = 0;
        colorVariants.forEach(v => {
            if (sizes.length === 0) { totalAmount += v.amount || 0; }
            else { Object.values(v.stock || {}).forEach(q => { totalAmount += parseInt(q) || 0; }); }
        });`
    },
    {
        old: `            brand: formFields.brand,
            sportType: formFields.sportType,
            targetGroup: formFields.targetGroup,
            amount: amountNum,
            image: formFields.image,
            description: formFields.description,
            status: formFields.status,
            productType: formFields.productType,
            clothesType: formFields.productType === "clothes" ? formFields.clothesType : "",
            colorNames: selectedColors.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            colors: selectedColors.map(c => COLOR_CLASSES[c] || "bg-white"),
            sizes: formFields.productType === "clothes" && formFields.clothesType !== "hat" 
                ? ["S", "M", "L", "XL"] 
                : ["M"]
        };

        if (currentProduct) {
            updateProduct({ ...currentProduct, ...productData });
        } else {
            addProduct({
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                ...productData
            });
        }

        setModalOpen(false);`,
        new: `            brand: formFields.brand,
            sportType: formFields.sportType,
            targetGroup: formFields.targetGroup,
            amount: totalAmount,
            // Legacy fields for backward-compat with old shopping pages
            image: colorVariants[0]?.image || "",
            colorNames: colorVariants.map(v => v.color.charAt(0).toUpperCase() + v.color.slice(1)),
            colors: colorVariants.map(v => v.colorClass || COLOR_CLASSES[v.color] || "bg-white"),
            colorImages: Object.fromEntries(colorVariants.map(v => [v.color, v.image])),
            sizes: sizes.length > 0 ? sizes : ["One Size"],
            description: formFields.description,
            status: formFields.status,
            productType: formFields.productType,
            clothesType: formFields.productType === "clothes" ? formFields.clothesType : "",
            // New variant model
            colorVariants: colorVariants.map(v => ({
                color: v.color,
                colorClass: v.colorClass || COLOR_CLASSES[v.color] || "bg-white",
                image: v.image,
                amount: v.amount || 0,
                stock: v.stock || {}
            }))
        };

        if (currentProduct) {
            updateProduct({ ...currentProduct, ...productData });
        } else {
            addProduct({
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                ...productData
            });
        }
        showAlert(currentProduct ? "Product updated!" : "Product added!", "success");
        setModalOpen(false);`
    }
];

let success = true;
for (const rep of replacements) {
    if (content.includes(rep.old.replace(/\r\n/g, '\n'))) {
        content = content.replace(rep.old.replace(/\r\n/g, '\n'), rep.new.replace(/\r\n/g, '\n'));
    } else {
        success = false;
        console.log("Failed to find chunk starting with:\n", rep.old.slice(0, 100).replace(/\r\n/g, '\\n'));
    }
}

if (success) {
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched successfully");
} else {
    console.log("Failed to patch");
}
