using System;
using System.IO;

class Program {
    static void Main() {
        string path = @"c:\Users\mook\OneDrive\Documents\GitHub\sport-ecommerce\sport67\sport-frontend\src\admin\Products.jsx";
        string content = File.ReadAllText(path);

        string old1 = @"import {
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
} from ""lucide-react"";
import { ProductContext } from ""../data/products.jsx"";";
        string new1 = @"import {
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
} from ""lucide-react"";
import { ProductContext, getSizeOptions, getTotalStock } from ""../data/products.jsx"";";
        content = content.Replace(old1.Replace("\r\n", "\n"), new1.Replace("\r\n", "\n"));

        string old2 = @"];

export default function GogoAthleticProducts({ onNavigate, onViewChange, user, setUser }) {";
        string new2 = @"];

// Default empty color variant
const makeEmptyVariant = (color = """") => ({
    color,
    colorClass: COLOR_CLASSES[color] || ""bg-white"",
    image: """",
    amount: 0,       // used when no sizes (equipment)
    stock: {}        // { ""S"": 10, ""M"": 5, ... } or { ""38"": 3, ... }
});

export default function GogoAthleticProducts({ onNavigate, onViewChange, user, setUser }) {";
        content = content.Replace(old2.Replace("\r\n", "\n"), new2.Replace("\r\n", "\n"));

        File.WriteAllText(path, content);
    }
}
