import { Home } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-md">
            <Home className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight font-headline">
            Rental Insights
          </h1>
        </div>
      </div>
    </header>
  );
}
