import { ChevronDown, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ManualQuestion } from "@/lib/manual/manualSections";
import { MANUAL_PREVIEWS } from "./previews";

interface ManualAccordionProps {
  question: ManualQuestion;
  className?: string;
}

export function ManualAccordion({ question, className }: ManualAccordionProps) {
  const Preview = question.previewId ? MANUAL_PREVIEWS[question.previewId] : null;

  return (
    <details
      className={cn(
        "group overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-sm",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 select-none">
        <span className="text-sm font-medium leading-snug">{question.question}</span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="border-t px-5 pb-5 pt-4 text-sm text-muted-foreground">
        <p className="leading-relaxed">{question.answer}</p>

        {question.steps && question.steps.length > 0 && (
          <ol className="mt-4 space-y-2">
            {question.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {question.note && (
          <div className="mt-4 flex gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="text-xs leading-relaxed">{question.note}</p>
          </div>
        )}

        {question.warning && (
          <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="text-xs leading-relaxed">{question.warning}</p>
          </div>
        )}

        {/* Visual preview */}
        {Preview && (
          <div className="mt-5 border-t pt-4">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden="true" />
              Vista de la interfaz
            </p>
            <Preview />
          </div>
        )}
      </div>
    </details>
  );
}
