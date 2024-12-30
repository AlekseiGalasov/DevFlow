import React from 'react';
import NavLinks from "@/components/navigation/navbar/NavLinks";
import Link from "next/link";
import Image from "next/image";
import {SheetClose} from "@/components/ui/sheet";
import ROUTES from "@/constans/routes";
import {Button} from "@/components/ui/button";
import {auth, signOut} from "@/auth";

const LeftSideBar = async () => {

    const session = await auth()

    return (
        <aside className='sticky z-50 h-[calc(100vh)] w-[266px] background-light900_dark200
        hidden flex-col justify-between border-r-2 border-dark-500 sm:flex'>
            <div className="flex flex-col gap-4 px-6 pt-6">
                <Link href='/' className='self-center flex items-center gap-1'>
                    <Image src='/images/site-logo.svg' alt='Dev flow logo' width={23} height={23}/>
                    <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900'>
                        Dev<span className='text-primary-500'>Flow</span>
                    </p>
                </Link>
                <div className='mt-14 flex flex-col gap-6'>
                    <NavLinks isMobileNav={false}/>
                </div>
            </div>
            {session?.user ?
                <form className='flex flex-col px-6 pb-6' action={async () => {
                    'use server'
                    await signOut({redirectTo: ROUTES.SIGN_IN})
                }}>
                    <Button variant="link" className='bg-transparent flex items-center justify-start gap-4 p-4'>
                        <Image
                            src={'/icons/logout.svg'}
                            alt={'Log out'}
                            width={24}
                            height={24}
                            className='invert-colors'
                        />
                        <p className='text-dark-300_light900' >Log out</p>
                    </Button>
                </form>
                : <div className="flex flex-col gap-3 px-6 pb-6">
                    <Link href={ROUTES.SIGN_IN}>
                        <Button className="btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                            <span className="primary-text-gradient">Log in</span>
                        </Button>
                    </Link>
                    <Link href={ROUTES.SIGN_UP}>
                        <Button
                            className="light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            }
        </aside>
    );
};

export default LeftSideBar;