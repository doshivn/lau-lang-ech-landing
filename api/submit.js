import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, phone, date, time, guests } = req.body;

        // Ensure required variables are present
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
            return res.status(500).json({ message: 'Lỗi cấu hình Server: Thiếu thông tin Database.' });
        }

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

        const { data, error } = await supabase
            .from('bookings')
            .insert([
                { name, phone, date, time, guests }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ message: 'Lỗi khi lưu vào Database.', error: error.message });
        }

        return res.status(200).json({ message: 'Đặt bàn thành công!' });
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ.', error: err.message });
    }
}
