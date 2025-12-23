import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export default function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md border border-soft-grey/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-site-accent/10 via-slate-teal/15 to-slate-teal/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-site-accent" />
      </div>
      <div className="text-4xl font-bold bg-gradient-to-r from-site-accent to-slate-teal bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-grey font-medium">
        {label}
      </div>
    </div>
  );
}
