'use client';

import { useAuthStore } from '@/store/authStore';
import { User, Mail } from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore(state => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ملفي الشخصي</h1>
      <div className="bg-white rounded-2xl p-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          {user?.name?.charAt(0) ?? 'T'}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">الاسم</p>
              <p className="font-medium text-gray-800">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">البريد الإلكتروني</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}   