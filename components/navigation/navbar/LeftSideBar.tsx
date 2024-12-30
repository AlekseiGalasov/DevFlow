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
        <section className='custom-scrollbar sticky left-0 top-0 h-screen pt-36 background-light900_dark200 light-border
        flex flex-col justify-between border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
            <div className='flex flex-1 flex-col gap-6'>
                <NavLinks isMobileNav={false}/>
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
                            className='invert-colors lg:hidden'
                        />
                        <span className="max-lg:hidden">Log out</span>
                    </Button>
                </form>
                : <div className="flex flex-col gap-3">
                    <Button asChild className="btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                        <Link href={ROUTES.SIGN_IN}>
                            <Image
                                src={'/icons/account.svg'}
                                alt={'Log out'}
                                width={24}
                                height={24}
                                className='invert-colors lg:hidden'
                            />
                            <span className="primary-text-gradient max-lg:hidden">Log in</span>
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={ROUTES.SIGN_UP}
                              className="light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                            <Image
                                src={'/icons/sign-up.svg'}
                                alt={'Log out'}
                                width={24}
                                height={24}
                                className='invert-colors lg:hidden'
                            />
                            <span className="max-lg:hidden">Sign up</span>
                        </Link>
                    </Button>
                </div>
            }
        </section>
    );
};

export default LeftSideBar;