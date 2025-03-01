"use client"

import * as React from "react"
import Link from "next/link"
import {  Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { navigationItems } from "./nav-items"
import { WalletConnectButton } from "@/components/Wallet/WalletConnectButton"

export default function Navbar() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full items-center justify-between px-4 py-6">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Scaffold Rust</SheetTitle>
            </SheetHeader>
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex-col items-start space-x-0 space-y-2">
                {navigationItems}
              </NavigationMenuList>
            </NavigationMenu>
          </SheetContent>
        </Sheet>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <span className="font-bold text-xl">Scaffold Rust</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>{navigationItems}</NavigationMenuList>
        </NavigationMenu>
      </div>
      <WalletConnectButton />
    </div>
  )
}
