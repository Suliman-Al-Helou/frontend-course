// src/lib/api.ts 
import axios from 'axios';

// إنشاء نسخة Axios موجهة للـ Proxy الداخلي لتلبية طلبات المتصفح بنجاح
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// تصدير افتراضي لإصلاح أخطاء "Export default doesn't exist" فوراً
export default api;
