//import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd, KbdKey } from "@/components/ui/kbd";
import { UserAccountNav } from "@/components/user-account-nav";
import { getSession } from "@/hooks/get-session";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-b px-4 md:px-6 bg-background/90 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="text-primary hover:text-primary/90">
            <Logo />
          </Link>
        </div>
        {/* Middle area */}
        <div className="grow max-sm:hidden">
          {/* Search form */}
          {/* TODO: add command palette */}
          <div className="relative mx-auto w-full max-w-xs hidden">
            <Input id="search" className="peer h-8 px-8" placeholder="Search..." type="search" />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center justify-center">
              <Kbd>
                <KbdKey>⌘</KbdKey>
                <KbdKey>K</KbdKey>
              </Kbd>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {session ? (
            <>
              {/* <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button> */}
              <UserAccountNav user={session.user} />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
}
