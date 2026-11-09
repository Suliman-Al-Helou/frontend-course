"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";
import { QueryState } from "@/components/shared/QueryState";
import { EmptyState } from "@/components/shared/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LABELS } from "../constants/labels";
import { useExamResults } from "../queries/useExamResults";
import type { ExamResult } from "../types";

function ExamRow({ exam }: { exam: ExamResult }) {
  const StatusIcon = exam.passed ? CheckCircle : XCircle;

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <StatusIcon
            className={exam.passed ? "size-4 text-success" : "size-4 text-destructive"}
            aria-hidden
          />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{exam.lesson}</p>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{exam.course}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" aria-hidden />
              {exam.date}
            </span>
          </p>
        </div>
      </div>
      <Badge variant={exam.passed ? "success" : "destructive"} className="ms-2 shrink-0">
        {exam.score}%
      </Badge>
    </li>
  );
}

function ExamResultsSkeleton() {
  return (
    <div className="divide-y divide-border">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-pulse bg-muted" />
      ))}
    </div>
  );
}

export default function ExamResults() {
  const query = useExamResults();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{LABELS.exams.title}</h2>
      <Card className="overflow-hidden">
        <QueryState
          query={query}
          skeleton={<ExamResultsSkeleton />}
          isEmpty={(d) => d.results.length === 0}
          empty={
            <EmptyState
              title={LABELS.exams.emptyTitle}
              description={LABELS.exams.emptyDescription}
            />
          }
        >
          {({ results, passRate }) => (
            <>
              <ul className="divide-y divide-border">
                {results.map((exam, i) => (
                  <ExamRow key={`${exam.course}-${exam.lesson}-${i}`} exam={exam} />
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-border bg-muted px-4 py-3">
                <span className="text-xs text-muted-foreground">{LABELS.exams.passRate}</span>
                <span className="text-sm font-semibold text-primary">{passRate}%</span>
              </div>
            </>
          )}
        </QueryState>
      </Card>
    </section>
  );
}
