// 'use client';

// import { motion } from 'framer-motion';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import { useContactFAQ, FAQItem } from '../_hooks/useContact';

// interface ContactFAQProps {
//   faqs: FAQItem[];
// }

// export function ContactFAQ({ faqs }: ContactFAQProps) {
//   const { openIndex, toggle } = useContactFAQ();

//   return (
//     <div className="mt-20">
//       <h2 className="text-2xl font-bold text-blue-deep dark:text-foreground text-center mb-10">
//         الأسئلة الشائعة
//       </h2>
//       <div className="max-w-3xl mx-auto space-y-3">
//         {faqs.map((faq, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.08 }}
//             className="border border-blue-100 dark:border-border rounded-xl overflow-hidden"
//           >
//             <button
//               onClick={() => toggle(i)}
//               className="w-full flex items-center justify-between p-5 text-right hover:bg-blue-50 dark:hover:bg-muted/50 transition-colors"
//             >
//               <span className="font-semibold text-blue-deep dark:text-foreground">
//                 {faq.q}
//               </span>
//               {openIndex === i
//                 ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
//                 : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
//               }
//             </button>
//             {openIndex === i && (
//               <div className="px-5 pb-5 border-t border-blue-50 dark:border-border">
//                 <p className="pt-4 text-muted-foreground text-sm leading-relaxed">
//                   {faq.a}
//                 </p>
//               </div>
//             )}
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }