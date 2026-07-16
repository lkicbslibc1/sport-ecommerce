import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to get file path for a resource
const getFilePath = (resource) => path.join(DATA_DIR, `${resource}.json`);

// Define default shapes for resources based on frontend usage
const DEFAULT_STATES = {
  addresses: {},
  cart: [],
  noti: {},
  orders: [],
  products: [],
  reviews: {},
  users: []
};

// Helper to read data
const readData = (resource) => {
  const filePath = getFilePath(resource);
  if (!fs.existsSync(filePath)) {
    const defaultData = DEFAULT_STATES[resource] !== undefined ? DEFAULT_STATES[resource] : [];
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  const data = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error parsing ${resource}.json:`, error);
    return DEFAULT_STATES[resource] !== undefined ? DEFAULT_STATES[resource] : [];
  }
};

// Helper to write data
const writeData = (resource, data) => {
  const filePath = getFilePath(resource);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- Generic CRUD API Routes ---

// GET /api/:resource - Get all items
app.get('/api/:resource', (req, res) => {
  const { resource } = req.params;
  const data = readData(resource);
  res.json(data);
});

// POST /api/:resource - Add an item or overwrite entirely
// If body is an array, we might append or just overwrite depending on logic.
// For objects (like addresses, noti), usually we might want to update a key.
// To keep it simple and compatible with localStorage: 
// A POST can act as a complete replacement (like localStorage.setItem) if you send the whole object/array.
app.post('/api/:resource', (req, res) => {
  const { resource } = req.params;
  const newData = req.body;
  
  // To mimic localStorage setItem, we can just overwrite the whole file for now.
  // This is the easiest way to drop-in replace frontend localStorage.setItem(key, JSON.stringify(data))
  writeData(resource, newData);
  
  res.json({ success: true, message: `${resource} updated successfully`, data: newData });
});

// For partial updates, you could use PUT/PATCH, but since the frontend 
// currently overwrites the whole array/object in localStorage, POST as overwrite is safest for a 1:1 migration.

// Health check route
app.get('/', (req, res) => {
  res.send('Sport E-commerce JSON Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Data will be stored in: ${DATA_DIR}`);
});
