import React, {ReactNode} from 'react';
import Navbar from "@/components/navigation/navbar";
import LeftSideBar from "@/components/navigation/navbar/LeftSideBar";

const RootLayout = ({children}: {children: ReactNode}) => {
    return (
        <main>
            <Navbar />
            <main className="flex ">
                <LeftSideBar />
                <div className="pt-[84px] p-4 w-full">
                    {children}
                </div>
                <div />
            </main>
        </main>
    );
};

export default RootLayout;