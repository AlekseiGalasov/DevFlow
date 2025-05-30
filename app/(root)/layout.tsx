import React, {ReactNode} from 'react';
import Navbar from "@/components/navigation/navbar";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import RightSideBar from "@/components/navigation/RightSideBar";

const RootLayout = ({children}: {children: ReactNode}) => {
    return (
        <main className="background-light850_dark100 relative">
            <Navbar />
            <div className="flex">
                <LeftSideBar />
                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb14 sm:px-14">
                    <div className="mx-auto w-full">
                        {children}
                    </div>
                </section>
                <RightSideBar />
                <div />
            </div>
        </main>
    );
};

export default RootLayout;