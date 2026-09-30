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
      .delete()
      .eq('user_identifier', user_identifier)
      .eq('product_handle', product_handle);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Successfully removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing from wishlist', details: error.message });
  }
}