import { 
  createItem, 
  getItems, 
  updateItem, 
  deleteItem,
  getItemStock,
  updateStock
} from '../services/inventory.service.js';

export const getAllItems = async (req, res) => {
  try {
    const { category, search, expiry } = req.query;
    const items = await getItems({ category, search, expiry });
    res.status(200).json(items);
  } catch (error) {
    console.error('Get Items Error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, category, description, unit } = req.body;
    const item = await createItem({ name, category, description, unit });
    res.status(201).json(item);
  } catch (error) {
    console.error('Add Item Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateItemDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const item = await updateItem(id, updates);
    res.status(200).json(item);
  } catch (error) {
    console.error('Update Item Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteItem(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete Item Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await getItemStock(id);
    res.status(200).json(stock);
  } catch (error) {
    console.error('Get Stock Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateStockLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, batch_number, expiry_date } = req.body;
    const stock = await updateStock(id, {
      facility_id: req.user.facility_id,
      quantity,
      batch_number,
      expiry_date
    });
    res.status(200).json(stock);
  } catch (error) {
    console.error('Update Stock Error:', error);
    res.status(400).json({ error: error.message });
  }
}; 