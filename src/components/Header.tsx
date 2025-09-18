import { PartyPopper } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-primary">
            <PartyPopper className="w-8 h-8 text-accent" />
            <span>Poll Party</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
