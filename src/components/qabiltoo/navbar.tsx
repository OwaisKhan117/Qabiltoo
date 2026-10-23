"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Heart, LogOut, UserRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo, LogoMark } from "./logo";
import { useAuthStore } from "@/lib/qabiltoo/store";
import type { View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

interface NavbarProps {
  view: View;
  navigate: (view: View) => void;
  onOpenAuth: () => void;
}

export function Navbar({ view, navigate, onOpenAuth }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const links: { label: string; active: boolean; onClick: () => void }[] = [
    { label: "Home", active: view.name === "landing", onClick: () => navigate({ name: "landing" }) },
    { label: "Browse Profiles", active: view.name === "browse", onClick: () => navigate({ name: "browse" }) },
    { label: "My Interests", active: view.name === "interests", onClick: () => navigate({ name: "interests" }) },
  ];

  function handleLogout() {
    logout();
    navigate({ name: "landing" });
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ name: "landing" })}
            className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
            aria-label="Qabiltoo home"
          >
            <Logo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={link.onClick}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  link.active
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
                {link.active && (
                  <span className="absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-gold-500" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              <Sun className="hidden h-5 w-5 dark:block" />
              <Moon className="h-5 w-5 dark:hidden" />
            </Button>

            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden gap-2 rounded-full pl-1 pr-3 md:flex">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {user.fullName[0]}
                    </span>
                    <span className="max-w-[120px] truncate text-sm font-medium">
                      {user.fullName.split(" ")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {user.city}, {user.state}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ name: "profile", id: user.id })}>
                    <UserRound className="h-4 w-4" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ name: "interests" })}>
                    <Heart className="h-4 w-4" /> My Interests
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" className="rounded-full" onClick={onOpenAuth}>
                  Sign In
                </Button>
                <Button
                  className="rounded-full shadow-sm"
                  onClick={() => navigate({ name: "register" })}
                >
                  <Sparkles className="h-4 w-4" /> Join Free
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <LogoMark className="h-7 w-7" /> Qabiltoo
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4 pt-2">
                  {links.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        link.onClick();
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                        link.active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="my-3 h-px bg-border" />
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          navigate({ name: "profile", id: user.id });
                          setMobileOpen(false);
                        }}
                        className="rounded-xl px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="rounded-xl px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full rounded-full"
                        onClick={() => {
                          setMobileOpen(false);
                          navigate({ name: "register" });
                        }}
                      >
                        <Sparkles className="h-4 w-4" /> Join Free
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={() => {
                          setMobileOpen(false);
                          onOpenAuth();
                        }}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
