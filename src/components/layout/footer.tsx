export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Rental Insights. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
