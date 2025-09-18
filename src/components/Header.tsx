import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-20">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold font-headline text-primary">
            <div className="relative w-10 h-10">
              <Image 
                src="https://picsum.photos/seed/polllogo/200/200" 
                alt="Janmat logo"
                data-ai-hint="abstract poll logo"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <span className="hidden sm:inline">Janmat</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
