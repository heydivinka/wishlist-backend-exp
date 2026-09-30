// @ts-check
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const query = (req.query && typeof req.query === 'object') ? req.query : {};
  const { user_identifier } = query;

  if (!user_identifier) {
    return res.status(400).json({ error: 'User identifier is required' });
  }

  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product_handle')
      .eq('user_identifier', user_identifier);

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching wishlist', details: error.message });
  }
}