'use client';

// 1. Imports
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useExamResults, scoreColorClass, ExamResult } from '@/components/dashboard/_hooks/Useexamresults';
import { QueryState } from '@/components/shared/QueryState';
import { EmptyState } from '@/components/shared/states/EmptyState';

// 2. Types
interface ExamRowProps {
  exam: ExamResult;
  index: number;
}

// 3. Sub Components
function ExamRow({ exam, index }: ExamRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center justify-between px-4 py-3.5"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            exam.passed ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {exam.passed
            ? <CheckCircle className="w-4 h-4 text-green-600" />
            : <XCircle    className="w-4 h-4 text-red-500"   />
          }
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{exam.lesson}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {exam.course}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {exam.date}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`text-sm font-bold px-2.5 py-1 rounded-lg flex-shrink-0 mr-2 ${scoreColorClass(exam.score)}`}
      >
        {exam.score}٪
      </div>
    </motion.div>
  );
}

interface SummaryBarProps {
  passRate: number;
}

function SummaryBar({ passRate }: SummaryBarProps) {
  return (
    <div className="px-4 py-3  bg-muted/50 border-t border-border flex items-center justify-between">
      <span className="text-xs text-muted-foreground">معدل النجاح الكلي</span>
      <span className="text-sm font-bold text-primary">{passRate}٪</span>
    </div>
  );
}

function ExamResultsSkeleton() {
  return (
    <div className="divide-y divide-border animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-40 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>
          <div className="h-7 w-12 rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

// 4. Main Component
export default function ExamResults() {
  const query = useExamResults();

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-5">نتائج الامتحانات</h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <QueryState
          query={query}
          skeleton={<ExamResultsSkeleton />}
          isEmpty={(d) => d.results.length === 0}
          empty={
            <EmptyState
              title="لا توجد نتائج امتحانات بعد"
              description="ستظهر نتائجك هنا بعد أن تحلّ أول مهمة في أحد الدروس."
            />
          }
        >
          {({ results, passRate }) => (
            <>
              <div className="divide-y divide-border">
                {results.map((exam, i) => (
                  <ExamRow key={i} exam={exam} index={i} />
                ))}
              </div>

              <SummaryBar passRate={passRate} />
            </>
          )}
        </QueryState>
      </div>
    </div>
  );
}