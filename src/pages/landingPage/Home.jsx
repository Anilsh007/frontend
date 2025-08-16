import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

import Footer from "../../components/Footer";

export default function Home() {
    return (
        <>
            <Header />
            <main className="bg-pulse">
                <Outlet /> {/* This is where nested route pages will render */}
            </main>
            <Footer />
        </>
    );
}
