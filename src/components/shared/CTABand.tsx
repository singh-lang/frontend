import Link from 'next/link';

interface CTABandProps {
  title: string;
  subtitle?: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export default function CTABand({
  title,
  subtitle,
  primaryText,
  primaryLink,
  secondaryText,
  secondaryLink
}: CTABandProps) {
  return (
    <div className="bg-gradient-to-br from-site-accent to-slate-teal rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 xl:p-16 text-center relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(9,180,198,0.2),rgba(89,120,124,0.1)_40%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4" style={{ fontFamily: 'Stretch Pro, sans-serif' }}>
          {title}
        </h2>

        {subtitle && (
          <p className="text-site-base md:text-lg text-white/90 mb-6 md:mb-8 leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <Link
            href={primaryLink}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-site-accent hover:bg-site-accent/90 text-white rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-site-primary"
          >
            {primaryText}
          </Link>

          {secondaryText && secondaryLink && (
            <Link
              href={secondaryLink}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 rounded-xl font-bold text-site-base md:text-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-site-primary"
            >
              {secondaryText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
