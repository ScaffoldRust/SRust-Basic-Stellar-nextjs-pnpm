import { BookIcon, CodeIcon, GithubIcon } from "lucide-react";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import ListItem from "./list-items";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const navigationItems = (
    <>
        <NavigationMenuItem className="w-full">
            <NavigationMenuTrigger className="w-full justify-start md:w-auto">Get Started</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                        <NavigationMenuLink asChild>
                            <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href="/"
                            >
                                <CodeIcon className="h-6 w-6" />
                                <div className="mb-2 mt-4 text-lg font-medium">Quick Start</div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                    Get started with Scaffold Rust for Stellar in minutes
                                </p>
                            </a>
                        </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Documentation">
                        Comprehensive guides and API documentation
                    </ListItem>
                    <ListItem href="/examples" title="Examples">
                        Ready-to-use code examples and templates
                    </ListItem>
                    <ListItem href="/tutorials" title="Tutorials">
                        Step-by-step tutorials for different use cases
                    </ListItem>
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full md:w-auto">
            <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start md:w-auto")}>
                    <BookIcon className="mr-2 h-4 w-4" />
                    Docs
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full md:w-auto">
            <Link href="https://github.com/ScaffoldRust/Scaffold-Stellar-pnpm/" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start md:w-auto")}>
                    <GithubIcon className="mr-2 h-4 w-4" />
                    GitHub
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
    </>
)