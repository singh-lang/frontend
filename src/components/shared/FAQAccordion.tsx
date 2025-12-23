import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQAccordionProps {
  question: string;
  answer: string;
  id: string;
}

export default function FAQAccordion({ question, answer, id }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-soft-grey/20 shadow-sm hover:shadow-md transition-all scroll-mt-32"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-xl"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-dark-base pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-accent flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-6 animate-[fadeIn_0.2s_ease-out]">
          <p className="text-grey leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
