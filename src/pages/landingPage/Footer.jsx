import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../../assets/logo.png';
import { LuPhone } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { CiGlobe } from "react-icons/ci";

export default function Footer() {

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    return (
        <footer style={{ backgroundColor: '#1c2331' }} className="text-white py-5" data-aos="fade-up">
            <div className="container">
                <img src={logo} alt={logo} className="footerLogo" />
                <h5 className="mb-3">Get in Touch</h5>
                <p className="mb-1"><LuPhone /> Phone: <a href="tel:+16785571247" className="text-white"> (678) 557 1247 </a></p>
                <p className="mb-1"><TfiEmail /> Email: <a href="mailto:admin@cvcsem.com" className="text-white"> admin@cvcsem.com </a></p>
                <p className="mb-0"><CiGlobe /> Web: <a href="https://www.cvcsem.com" className="text-white" target="_blank" rel="noopener noreferrer"> www.cvcsem.com </a></p>
            </div>
        </footer>
    );
}
