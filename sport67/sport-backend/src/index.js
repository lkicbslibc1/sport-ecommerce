import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// --- Upload API Route ---
app.post('/api/upload', (req, res) => {
  const { image } = req.body;
  if (!image || !image.startsWith('data:image/')) {
    return res.status(400).json({ success: false, message: 'Invalid image data' });
  }

  try {
    // Extract mime type and base64 data
    const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 string' });
    }

    let extension = matches[1];
    if (extension === 'jpeg') extension = 'jpg';
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `${Date.now()}.${extension}`;
    const imageDir = path.join(__dirname, '../../sport-frontend/public/image');
    
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    const filePath = path.join(imageDir, filename);
    fs.writeFileSync(filePath, buffer);
    
    // Return relative URL for frontend to use
    res.json({ success: true, url: `image/${filename}` });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ success: false, message: 'Failed to save image' });
  }
});

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
