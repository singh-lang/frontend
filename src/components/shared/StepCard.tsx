import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StepCardProps {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  learnMoreLink?: string;
}

export default function StepCard({ number, icon: Icon, title, description, learnMoreLink }: StepCardProps) {
  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-md border border-soft-grey/20 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-site-accent via-site-accent/95 to-slate-teal flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">{number}</span>
      </div>

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-site-accent/10 via-slate-teal/15 to-slate-teal/10 flex items-center justify-center mb-6 group-hover:from-site-accent/20 group-hover:to-slate-teal/20 transition-all">
        <Icon className="w-8 h-8 text-site-accent" />
      </div>

      <h3 className="text-xl font-bold text-dark-base mb-3">
        {title}
      </h3>

      <p className="text-grey leading-relaxed mb-4">
        {description}
      </p>

      {learnMoreLink && (
        <Link
          href={learnMoreLink}
          className="inline-flex items-center text-sm font-semibold text-site-accent hover:text-slate-teal transition-colors"
        >
          Learn more →
        </Link>
      )}
    </div>
  );
}
