import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-20">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold font-headline text-primary">
            <div className="relative w-16 h-16">
              <Image 
                src="https://storage.googleapis.com/project-spark-341200.appspot.com/images%2Fteams%2Fteam_1724068777011_86400%2FGENERATED_1724070004077.png" 
                alt="ग्राम पंचायत ककरारी logo" 
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <span className="hidden sm:inline">ग्राम पंचायत ककरारी</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
