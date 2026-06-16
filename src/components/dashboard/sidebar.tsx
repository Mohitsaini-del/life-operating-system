"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiHome, FiTarget, FiCheckSquare, FiFileText, FiLogOut, FiCpu } from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: FiHome },
    { name: "Goals", href: "/goals", icon: FiTarget },
    { name: "Habits", href: "/habits", icon: FiCheckSquare },
    { name: "Notes", href: "/notes", icon: FiFileText },
    { name: "Assistant", href: "/assistant", icon: FiCpu },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-6 text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
            Life OS
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black shadow-md shadow-zinc-900/10 dark:shadow-zinc-50/5"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 cursor-pointer"
        >
          <FiLogOut className="w-4.5 h-4.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}