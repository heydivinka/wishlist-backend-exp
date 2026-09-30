// @ts-check
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = (req.body && typeof req.body === 'object') ? req.body : {};
  const { user_identifier, product_handle } = body;

  if (!user_identifier || !product_handle) {
    return res.status(400).json({ error: 'User identifier and product handle are required' });
  }

  try {
    const { error } = await supabase
      .from('wishlist_items')
      .insert({ user_identifier, product_handle });
    
    if (error) {
      if (error.code === '23505') {
        return res.status(200).json({ message: 'Item already in wishlist' });
      }
      throw error;
    }

    res.status(201).json({ message: 'Successfully added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding to wishlist', details: error.message });
  }
}