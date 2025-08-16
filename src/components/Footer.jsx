import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/logo.png';
import { LuPhone } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import TermsConditions from "./TermsConditions";

export default function Footer() {

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    return (
        <footer style={{ backgroundColor: '#1c2331' }} className="text-white py-3">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <img src={logo} alt={logo} className="footerLogo" />
                    </div>
                    <div className="col-md-6">
                        <div className="float-end">
                            <h5>Get in Touch</h5>
                            <p className="mb-1"><LuPhone /> Phone: <a href="tel:+16785571247" className="text-white"> (678) 557 1247 </a></p>
                            <p className="mb-1"><TfiEmail /> Email: <a href="mailto:info@cvcsem.com" className="text-white"> info@cvcsem.com </a></p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                    <NavLink to="/TermsConditions">Terms and Conditions</NavLink>
                    <p className="text-center mb-0">© 2025 cvcsem.com</p>
                </div>
            </div>
        </footer>
    );
}
