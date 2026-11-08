import { motion } from 'framer-motion';
import { Code2, Star } from 'lucide-react';
import {  AuthTerminal } from '@/components/shared/ProfessionalTerminal';

export function BrandSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col gap-20 p-12 bg-login-signup-background">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-16 right-16 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-24 left-10 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>


      <AuthTerminal/>

   

      
    </div>
  );
}