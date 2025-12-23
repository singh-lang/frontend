import { LucideIcon } from 'lucide-react';

interface TrustBadgeProps {
  icon: LucideIcon;
  label: string;
}

export default function TrustBadge({ icon: Icon, label }: TrustBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-sm border border-soft-grey/20 hover:shadow-md transition-all">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/10 via-slate-teal/15 to-slate-teal/10 flex items-center justify-center">
        <Icon className="w-7 h-7 text-site-accent" />
      </div>
      <span className="text-sm font-semibold text-dark-base text-center">
        {label}
      </span>
    </div>
  );
}
