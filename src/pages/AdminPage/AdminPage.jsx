import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrushStrokes from "../../utils/brushStrokes";
import ReturnMenu from "../../components/return-menu";
import TagsManager from "./TagsManager";
import SourceUrlsManager from "./SourceUrlsManager";
import "./AdminPage.css";
import HelpTooltip from "../../components/HelpTooltip";
import TTSButton from "../../components/TTSButton";

const TABS = [
    { key: "tags", label: "🏷️ Etiquetas" },
    { key: "sources", label: "🔗 Fuentes de Origen" },
];

function AdminPage() {
    const [activeTab, setActiveTab] = useState("tags");
    const navigate = useNavigate();

    return (
        <div
            className="min-vh-100 position-relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #43C6AC 0%, #191654 100%)",
            }}
        >
            <div className="position-absolute top-0 start-0 opacity-25" style={{ pointerEvents: 'none' }}>
                <BrushStrokes
                    variant="circle"
                    color="#ffffff"
                    width={130}
                    height={130}
                    strokeWidth={8}
                    opacity={0.3}
                />
            </div>
            <div
                className="position-absolute"
                style={{ top: "25%", right: "4%", opacity: 0.15, pointerEvents: 'none' }}
            >
                <BrushStrokes
                    variant="wave"
                    color="#ffffff"
                    width={180}
                    height={60}
                    strokeWidth={6}
                    opacity={0.4}
                />
            </div>
            <div
                className="position-absolute"
                style={{ bottom: "12%", left: "3%", opacity: 0.1, pointerEvents: 'none' }}
            >
                <BrushStrokes
                    variant="circle"
                    color="#ffffff"
                    width={100}
                    height={100}
                    strokeWidth={6}
                    opacity={0.3}
                />
            </div>

            <div className="container-fluid px-4 pb-5">
                <ReturnMenu />

                <div className="text-white mb-4 mt-2 p-4">
                    <div className="position-relative d-inline-block mb-2">
                        <h2 className="fw-bold mb-0">
                            Panel de Administración
                        </h2>
                        <div
                            className="position-absolute"
                            style={{ bottom: "-8px", left: 0 }}
                        >
                            <BrushStrokes
                                variant="underline"
                                color="#43C6AC"
                                width={300}
                                height={20}
                                strokeWidth={3}
                                opacity={0.9}
                            />
                        </div>
                    </div>
                    <p className="text-white-80 mt-3 mb-0">
                        Gestiona las etiquetas y fuentes de origen del sistema de monitoreo
                    </p>
                </div>

                <div
                    className="card border-0 shadow admin-shortcut-card mb-4"
                    style={{ borderRadius: "16px", cursor: "pointer" }}
                    onClick={() => navigate("/article-form")}
                >
                    <div className="card-body d-flex align-items-center gap-3 p-4">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                                width: "56px",
                                height: "56px",
                                background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                        >
                            <span className="fs-3">📝</span>
                        </div>
                        <div className="flex-grow-1">
                            <h5 className="mb-1 fw-bold"> Alta de Artículos
                                <TTSButton
                                    text={`Ingresa nuevos artículos periodísticos al sistema de monitoreo de manera manual.`}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </h5>
                            <p className="mb-0 text-muted small">
                                Ingresa nuevos artículos periodísticos al
                                sistema de monitoreo
                            </p>
                        </div>

                        <span className="text-primary fw-semibold">
                            Ir al formulario →
                        </span>
                    </div>
                </div>

                <div
                    className="card border-0 shadow-lg"
                    style={{ borderRadius: "20px" }}
                >
                    <div
                        className="card-header bg-white border-0 pt-4 px-4"
                        style={{ borderRadius: "20px 20px 0 0" }}
                    >
                        <ul className="nav admin-tabs border-0">
                            {TABS.map((tab) => (
                                <li className="nav-item" key={tab.key}>
                                    <button
                                        className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card-body p-4">
                        {activeTab === "tags" && <TagsManager />}
                        {activeTab === "sources" && <SourceUrlsManager />}
                    </div>
                </div>
            </div>

            <HelpTooltip
                page="admin"
                positionStyle={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px"
                }}
            />
        </div>
    );
}

export default AdminPage;
