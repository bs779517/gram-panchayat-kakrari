import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-20">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold font-headline text-primary">
            <div className="relative w-12 h-12">
              <Image 
                src="https://picsum.photos/seed/logo/48/48" 
                alt="ग्राम पंचायत ककरारी logo" 
                fill 
                sizes="48px"
                className="object-cover rounded-full"
              />
            </div>
            <span>ग्राम पंचायत ककरारी</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
