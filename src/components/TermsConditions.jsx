import AOS from 'aos';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import {
    FaHandshake, FaUserShield, FaCogs, FaMoneyBillWave, FaBalanceScale,
    FaLock, FaPowerOff, FaExclamationTriangle, FaGavel, FaPenFancy, FaGlobe
} from 'react-icons/fa';

export default function TermsConditions() {
    useEffect(() => {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    }, []);

    const headerSpacer = { height: '12.4vh' };

    const sections = [
        {
            title: "1. Scope of Service",
            icon: <FaHandshake />,
            lines: [
                "Vendors provide their company profile and documentation for validation.",
                "Clients search and communicate with vendors based on qualifications.",
                "The platform serves as a digital bridge between Clients and Vendors."
            ]
        },
        {
            title: "2. Eligibility and Access",
            icon: <FaUserShield />,
            lines: [
                "Users must be 18 years or older.",
                "Proper authorization is required to act on behalf of a business.",
                "Accounts must be used by the individual or company that registered."
            ]
        },
        {
            title: "3. Obligations of Parties",
            icon: <FaCogs />,
            lines: [
                "Vendors agree to provide accurate, up-to-date information.",
                "Clients agree to use vendor data responsibly and professionally.",
                "Both parties agree to comply with applicable laws and regulations."
            ]
        },
        {
            title: "4. Fees and Payment",
            icon: <FaMoneyBillWave />,
            lines: [
                "Some services may incur fees which will be clearly communicated.",
                "Failure to pay may result in suspended access."
            ]
        },
        {
            title: "5. Intellectual Property",
            icon: <FaBalanceScale />,
            lines: [
                "All content on the platform is owned by Real Time Technology Services, LLC unless otherwise noted.",
                "Users may not copy, modify, or distribute platform content without permission."
            ]
        },
        {
            title: "6. Confidentiality",
            icon: <FaLock />,
            lines: [
                "All parties must maintain confidentiality of sensitive information shared through the platform."
            ]
        },
        {
            title: "7. Termination and Cancellation",
            icon: <FaPowerOff />,
            lines: [
                "Users may terminate their accounts at any time.",
                "Violation of terms may lead to account suspension or termination."
            ]
        },
        {
            title: "8. Limitation of Liability",
            icon: <FaExclamationTriangle />,
            lines: [
                "Real Time Technology Services, LLC is not liable for any indirect, incidental, or consequential damages."
            ]
        },
        {
            title: "9. Dispute Resolution",
            icon: <FaGavel />,
            lines: [
                "All disputes shall be resolved through arbitration in accordance with U.S. law."
            ]
        },
        {
            title: "10. Amendments",
            icon: <FaPenFancy />,
            lines: [
                "We may revise these Terms occasionally. Continued use implies acceptance of any changes."
            ]
        },
        {
            title: "11. Governing Law",
            icon: <FaGlobe />,
            lines: [
                "These Terms shall be governed by the laws of the State of California, USA."
            ]
        }
    ];

    return (
        <>
            <div style={headerSpacer}></div>

            {/* Hero Section */}
            <div className="hero-section bg-primary text-muted text-center py-5">
                <div data-aos="fade-up">
                    <h1 className="display-5 fw-bold">Terms & Conditions</h1>
                    <p className="lead mt-2">Effective Date: July 28, 2025</p>
                </div>

            </div>

            {/* Intro */}
            <section className="container py-5" data-aos="fade-up">
                <p className="text-muted text-center fs-6">
                    These Terms govern the use of the <strong>CVCSEM</strong> platform provided by <strong>Real Time Technology Services, LLC</strong>.
                    By using this system, you agree to the conditions set below.
                </p>
            </section>

            {/* Terms List */}
            <section className="container pb-5">
                {sections.map((section, idx) => (
                    <div
                        className="bg-light rounded-4 shadow p-4 mb-4"
                        data-aos="fade-up"
                        data-aos-delay={idx * 100}
                        key={idx}
                    >
                        <h5 className="fw-bold d-flex align-items-center mb-4 text-primary">
                            <span className="me-2 fs-4">{section.icon}</span> {section.title}
                        </h5>
                        <ul className="text-muted ps-3 mb-0">
                            {section.lines.map((line, i) => (
                                <li key={i} className="mb-2">{line}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Acceptance */}
            <section className="container text-center py-4" data-aos="fade-up">
                <p className="fw-semibold text-muted fs-5">
                    <strong>Acceptance:</strong> By using the CVCSEM System, Clients and Vendors confirm they’ve read and agreed to these Terms as of today’s date.
                </p>
            </section>
        </>
    );
}
