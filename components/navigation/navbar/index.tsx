import Image from "next/image";
import Link from "next/link";
import React from 'react';

import MobileNavigation from "@/components/navigation/navbar/MobileNavigation";
import Theme from "@/components/navigation/navbar/Theme";

const Navbar = () => {
    return (
        <nav className="flex-between background-light900_dark200 fixed z-40 w-full p-6 dark:shadow-none sm:px-12">
            <Link href='/' className='flex items-center gap-1'>
                <Image src='/images/site-logo.svg' alt='Dev flow logo' width={23} height={23}/>
                <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
                    Dev<span className='text-primary-500'>Flow</span>
                </p>
            </Link>
            <p>Global search</p>
            <div className='flex-between gap-5'>
                <Theme />
            </div>
            <MobileNavigation />
        </nav>
    );
};

export default Navbar;