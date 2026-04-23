import { ReactNode } from 'react';

interface PageHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly children?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-2">
        <p className="eyebrow text-rose-400/80">{eyebrow}</p>
        <h1 className="text-balance text-4xl font-bold tracking-tighter text-white sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-400 sm:text-lg">
          {description}
        </p>
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}
