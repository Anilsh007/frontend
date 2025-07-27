import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import 'aos/dist/aos.css';
import Footer from "./Footer";

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
