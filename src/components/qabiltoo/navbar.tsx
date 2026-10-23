"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Moon,
  Sun,
  Menu,
  Heart,
  LogOut,
  UserRound,
  Sparkles,
  Bell,
  MessageCircle,
  ShieldCheck,
  LayoutDashboard,
  Users,
  HandHeart,
} from "lucide-react";
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
import type { NotificationItem, View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/qabiltoo/types";

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
  const queryClient = useQueryClient();

  const links: { label: string; active: boolean; onClick: () => void }[] = [
    { label: "Home", active: view.name === "landing", onClick: () => navigate({ name: "landing" }) },
    { label: "Discover", active: view.name === "browse", onClick: () => navigate({ name: "browse" }) },
    { label: "Stories", active: view.name === "stories", onClick: () => navigate({ name: "stories" }) },
    { label: "Pricing", active: view.name === "pricing", onClick: () => navigate({ name: "pricing" }) },
    { label: "Trust & Safety", active: view.name === "trust", onClick: () => navigate({ name: "trust" }) },
  ];

  function handleLogout() {
    logout();
    navigate({ name: "landing" });
  }

  /* ── Notifications (poll + realtime invalidation) ─────────── */
  const { data: notifData } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?profileId=${user!.id}`);
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ notifications: NotificationItem[] }>;
    },
    enabled: !!user,
    refetchInterval: 20_000,
  });
  const notifications = notifData?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    if (!user) return;
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: user.id }),
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
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
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={link.onClick}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
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

          <div className="flex items-center gap-1.5">
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
              <>
                {/* Notification bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full"
                      aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-sm font-semibold">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          className="text-xs font-medium text-gold-600 hover:underline"
                          onClick={markAllRead}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {notifications.length === 0 ? (
                        <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No notifications yet — insha&apos;Allah soon.
                        </p>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <DropdownMenuItem
                            key={n.id}
                            className={cn(
                              "flex cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5",
                              !n.read && "bg-gold-50/60 dark:bg-gold-900/10"
                            )}
                            onClick={() => {
                              if (n.type === "message") navigate({ name: "chat" });
                              else if (n.type === "proposal" || n.type === "match")
                                navigate({ name: "interests" });
                              else if (n.type === "view") navigate({ name: "interests" });
                            }}
                          >
                            <span className="flex w-full items-center justify-between gap-2">
                              <span className="text-sm font-medium leading-snug">{n.title}</span>
                              <span className="shrink-0 text-[10px] text-muted-foreground">
                                {timeAgo(n.createdAt)}
                              </span>
                            </span>
                            {n.body && (
                              <span className="line-clamp-2 text-xs text-muted-foreground">
                                {n.body}
                              </span>
                            )}
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden gap-2 rounded-full pl-1 pr-3 md:flex">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {user.fullName[0]}
                      </span>
                      <span className="max-w-[110px] truncate text-sm font-medium">
                        {user.fullName.split(" ")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="font-semibold">{user.fullName}</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        {user.city}
                        {user.city && ", "}
                        {user.country === "India" ? user.state : user.country} · {user.tier} member
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ name: "profile", id: user.id })}>
                      <UserRound className="h-4 w-4" /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ name: "interests" })}>
                      <Heart className="h-4 w-4" /> Proposals & Matches
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ name: "chat" })}>
                      <MessageCircle className="h-4 w-4" /> Conversations
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ name: "guardian" })}>
                      <ShieldCheck className="h-4 w-4" /> Guardian Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ name: "admin" })}>
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" className="rounded-full" onClick={onOpenAuth}>
                  Sign In
                </Button>
                <Button
                  className="btn-gold-shimmer rounded-full bg-gold-500 text-charcoal shadow-sm hover:bg-gold-400 dark:text-emerald-950"
                  onClick={() => navigate({ name: "register" })}
                >
                  <Sparkles className="h-4 w-4" /> Begin Free
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
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

                  {[
                    { label: "Our Islamic Approach", view: { name: "approach" } as View, icon: HandHeart },
                    { label: "Guardian Dashboard", view: { name: "guardian" } as View, icon: ShieldCheck },
                    { label: "Admin Panel", view: { name: "admin" } as View, icon: LayoutDashboard },
                  ].map(({ label, view: v, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => {
                        navigate(v);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-muted"
                    >
                      <Icon className="h-4 w-4" /> {label}
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
                        onClick={() => {
                          navigate({ name: "interests" });
                          setMobileOpen(false);
                        }}
                        className="rounded-xl px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                      >
                        Proposals & Matches
                      </button>
                      <button
                        onClick={() => {
                          navigate({ name: "chat" });
                          setMobileOpen(false);
                        }}
                        className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium hover:bg-muted"
                      >
                        <Users className="h-4 w-4" /> Conversations
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="rounded-xl px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="btn-gold-shimmer w-full rounded-full bg-gold-500 text-charcoal hover:bg-gold-400 dark:text-emerald-950"
                        onClick={() => {
                          setMobileOpen(false);
                          navigate({ name: "register" });
                        }}
                      >
                        <Sparkles className="h-4 w-4" /> Begin Free
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
