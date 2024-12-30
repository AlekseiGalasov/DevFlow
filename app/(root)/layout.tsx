import React, {ReactNode} from 'react';
import Navbar from "@/components/navigation/navbar";
import SideBar from "@/components/navigation/navbar/SideBar";

const RootLayout = ({children}: {children: ReactNode}) => {
    return (
        <main>
            <Navbar />
            {children}
            <SideBar />
        </main>
    );
};

export default RootLayout;