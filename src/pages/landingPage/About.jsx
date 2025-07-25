import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { FaRocket, FaSearch, FaHandshake, FaUsers, FaChartLine, FaClock } from "react-icons/fa";



export default function About() {

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true, // only animate once
        });
    }, []);

    return (
        <>
            {/* Hero Section */}
            <div className="hero-section d-flex align-items-center text-white text-center">
                <div className="container text-center" data-aos="fade-up">
                    <h1 className="display-5 fw-bold">Client Vendor Capability & Event Management</h1>
                    <p className="lead mt-3">Connecting clients and vendors through smarter tools & matchmaking</p>
                </div>
            </div>

            {/* Intro Section */}
            <section className="container my-5">
                <div className="text-center">
                    <h2 className="fw-bold mb-4">Welcome to the Future of Business Events & Matchmaking with CVCSEM</h2>
                    <p className="text-muted fs-5">
                        <b>Client Vendor Capabilities System and Event Management</b> (CVCSEM) transforms how
                        <b> vendors and large clients</b> connect and grow. Whether you’re a <b>corporation, government agency, or small business</b>,
                        CVCSEM streamlines collaboration using powerful tools.
                    </p>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="container my-5">
                <h3 className="fw-bold text-center mb-4">How CVCSEM Empowers Your Business</h3>
                <div className="row g-4">
                    {[
                        { icon: <FaRocket />, title: 'Showcase Your Expertise', desc: 'Upload capability statements and get noticed.' },
                        { icon: <FaSearch />, title: 'Find Right Opportunities', desc: 'Access RFPs, RFQs, and RFIs easily.' },
                        { icon: <FaHandshake />, title: 'Smart Matchmaking', desc: 'Connect with the right clients quickly.' },
                        { icon: <FaUsers />, title: 'Event Management', desc: 'Host and attend powerful business events.' },
                        { icon: <FaChartLine />, title: 'Boost Visibility', desc: 'Generate reports and nurture leads.' },
                        { icon: <FaClock />, title: 'Save Time & Win More', desc: 'Simplify procurement and vendor selection.' }
                    ].map((item, idx) => (
                        <div className="col-md-4" data-aos="zoom-in" data-aos-delay={idx * 100} key={idx}>
                            <div className="card h-100 shadow-sm border-0 feature-card">
                                <div className="card-body text-center">
                                    <div className="icon-box mb-3">{item.icon}</div>
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-text text-muted">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </section>

            {/* For Clients & Vendors */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4">
                        {/* Clients Section */}
                        <div className="col-md-6" data-aos="fade-right">
                            <div className="p-4 h-100 bg-white shadow-sm border rounded">
                                <h4 className="fw-bold mb-3">For Clients & Government Agencies</h4>
                                <ul className="list-unstyled">
                                    <li>🔹 Efficient Vendor Discovery</li>
                                    <li>🔹 Seamless Lead Nurturing</li>
                                    <li>🔹 Advanced Event & Relationship Management</li>
                                </ul>
                            </div>
                        </div>

                        {/* Vendors Section */}
                        <div className="col-md-6" data-aos="fade-left">
                            <div className="p-4 h-100 bg-white shadow-sm border rounded">
                                <h4 className="fw-bold mb-3">For Small & Medium Vendors</h4>
                                <ul className="list-unstyled">
                                    <li>🚀 Showcase Your Strengths</li>
                                    <li>🚀 Expand Your Reach</li>
                                    <li>🚀 Build Stronger Relationships</li>
                                    <li>🚀 Win More Contracts</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why CVCSEM */}
            <section className="container py-5">
                <div className="text-center" data-aos="fade-up">
                    <h3 className="fw-bold mb-3">Why Choose CVCSEM?</h3>
                    <p className="fs-5 text-muted">
                        <ul className='list-unstyled'>
                            <li>✅ Centralized Access – A smarter marketplace for buyers & vendors</li>
                            <li>✅ Time-Saving Automation – Simplify procurement & partnerships</li>
                            <li>✅ Growth-Oriented Platform – Empowering businesses to succeed</li>
                        </ul>
                    </p>
                    <p className='fs-5 text-muted'>CVCSEM is changing the game—bringing efficiency, visibility, and opportunity to business matchmaking. Contact us today and become part of a powerful, streamlined ecosystem that connects businesses in ways never seen before! </p>
                </div>
            </section>
        </>
    );
}
