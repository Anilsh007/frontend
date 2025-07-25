import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
    return (
        <>
            <Header />
            <main className="bg-pulse">
                <Outlet /> {/* This is where nested route pages will render */}
            </main>
        </>
    );
}
