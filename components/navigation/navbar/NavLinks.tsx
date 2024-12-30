'use client'

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from 'react';

import {SheetClose} from "@/components/ui/sheet";
import {sidebarLinks} from "@/constans";
import {cn} from "@/lib/utils";

interface NavLinksProps {
    isMobileNav?: boolean
}
const NavLinks = ({isMobileNav = false}: NavLinksProps) => {

    const pathname = usePathname()
    const userId = 21;

    return (
        <>
            {sidebarLinks.map((item) => {
                const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route

                const profileLink = item.route === '/profile' ? `/profile/${userId}` : '/'

                const LinkComponent = (
                    <Link
                        href={item.route === '/profile' ? profileLink : item.route}
                        key={item.label}
                        className={cn(isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark-300_light900", "flex items-center justify-start gap-4 bg-transparent p-4")}
                    >
                        <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            className={cn({"invert-colors": !isActive})}
                        />
                        <p className={cn(isActive ? "base-bold" : "base-meduim", !isMobileNav && "max-lg:hidden")}>{item.label}</p>
                    </Link>
                )

                if (isMobileNav) {
                    return <SheetClose asChild key={item.label}>
                        {LinkComponent}
                    </SheetClose>
                } else {
                    return <React.Fragment key={item.label}>
                        {LinkComponent}
                    </React.Fragment>
                }
            })}
        </>
    );
};

export default NavLinks;