import AOS from 'aos';
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
                <div className="container" data-aos="fade-up">
                    <h3 className="display-6 fw-bold">Client Vendor Capability Statement <br /> & Event Management</h3>
                    <p className="lead mt-3 fw-bold text-white">Connecting clients and vendors through smarter tools & matchmaking</p>
                </div>
            </div>

            {/* Intro Section */}
            <section className="container my-5 text-center" data-aos="fade-up">
                <h3 className="fw-bold mb-4">Welcome to the Future of Business Events & Matchmaking with CVCSEM</h3>
                <p className="text-muted ">
                    <b>Client Vendor Capabilities System and Event Management</b> (CVCSEM) transforms how
                    <b> vendors and large clients</b> connect and grow. Whether you’re a <b>corporation, government agency, or small business</b>,
                    CVCSEM streamlines collaboration using powerful tools.
                </p>
            </section>

            {/* Feature Cards */}
            <section className="container my-5">
                <h4 className="fw-bold text-center mb-4">How CVCSEM Empowers Your Business</h4>
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
                            <div className="card h-100 shadow-sm border-1 feature-card">
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
                            <div className="p-4 h-100 bg-white shadow-sm border-1 rounded">
                                <h5 className="fw-bold mb-3">For Clients & Government Agencies</h5>
                                <ul className="list-unstyled">
                                    <li>🔹 Efficient Vendor Discovery</li>
                                    <li>🔹 Seamless Lead Nurturing</li>
                                    <li>🔹 Advanced Event & Relationship Management</li>
                                </ul>
                            </div>
                        </div>

                        {/* Vendors Section */}
                        <div className="col-md-6" data-aos="fade-left">
                            <div className="p-4 h-100 bg-white shadow-sm border-1 rounded">
                                <h5 className="fw-bold mb-3">For Small & Medium Vendors</h5>
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
                    <h4 className="fw-bold mb-3">Why Choose CVCSEM?</h4>
                    <div className=" text-muted">
                        <ul className='list-unstyled'>
                            <li>✅ Centralized Access – A smarter marketplace for buyers & vendors</li>
                            <li>✅ Time-Saving Automation – Simplify procurement & partnerships</li>
                            <li>✅ Growth-Oriented Platform – Empowering businesses to succeed</li>
                        </ul>
                    </div>
                    <p className=' text-muted'>CVCSEM is changing the game—bringing efficiency, visibility, and opportunity to business matchmaking. Contact us today and become part of a powerful, streamlined ecosystem that connects businesses in ways never seen before! </p>
                </div>
            </section>
        </>
    );
}
