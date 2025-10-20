import { useNavigate } from "react-router-dom";

function ReturnMenu() {
    const navigate = useNavigate();
    return (
        <>
            <div className="d-flex mt-4 align-items-center">
                <button
                    className="btn d-inline-flex align-items-center justify-content-center border-0 rounded-circle text-white"
                    style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                        e.currentTarget.style.transform = 'translateX(-4px) scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.currentTarget.style.transform = 'translateX(0) scale(1)';
                    }}
                    onClick={() => navigate("/dashboard")}
                >
                    <svg width="20" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="m-3"></div>
                <div className="navbar-brand d-flex align-items-center">
                    <span className="fs-1 fw-light">Territo<span className="fw-bold text-success">Rios</span></span>
                </div>
            </div>
        </>
    );
}

export default ReturnMenu;