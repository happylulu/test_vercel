import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { question, databaseUuid } = req.body;
  const defaultDatabaseUuid = '921c838c-541d-4361-8c96-70cb23abd9f5';

  try {
    // Example of querying Supabase
    const { data, error } = await supabase
      .from('your_table_name')
      .select('*')
      .eq('uuid', databaseUuid || defaultDatabaseUuid);

    if (error) {
      throw error;
    }

    // Process the data as needed
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in run:', error);
    res.status(500).json({ message: `Error in run: ${error.message}` });
  }
}
