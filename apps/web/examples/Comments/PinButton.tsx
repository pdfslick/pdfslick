import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TUsePDFSlickStore } from "@pdfslick/react";
import { AnnotationEditorType } from "pdfjs-dist";
import Comment from "./Comment/Comment";
import { VscPinnedDirty } from "react-icons/vsc";
import PinMenu from "./Toolbar/PinMenu";

type PinButtonProps = {
    usePDFSlickStore: TUsePDFSlickStore;
};

export default function PinButton({ usePDFSlickStore }: PinButtonProps) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const mode = usePDFSlickStore((s) => s.annotationEditorMode);
    const [openCommentPinId, setOpenCommentPinId] = useState<string | null>(null);

    const [pinColor, setPinColor] = useState("#ef4444"); // Default red color
    const [pins, setPins] = useState<
        Array<{ id: string; pageNumber: number; x: number; y: number; color: string }> // Added extra color property
    >([]);
    const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

    useEffect(() => {
        const container = (pdfSlick as any)?.viewer?.container as HTMLElement | undefined;
        if (!container) return;
        const onClick = (e: MouseEvent) => {
            if (mode !== AnnotationEditorType.STAMP) return;
            const x = e.clientX;
            const y = e.clientY;
            const numPages = pdfSlick?.document?.numPages ?? 0;
            for (let i = 0; i < numPages; i++) {
                const pageView = (pdfSlick as any).viewer?.getPageView?.(i);
                const div = pageView?.div as HTMLElement | undefined;
                if (!div) continue;
                const rect = div.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    const px = ((x - rect.left) / rect.width) * 100;
                    const py = ((y - rect.top) / rect.height) * 100;
                    const newId = `${Date.now()}-${Math.random()}`;
                    setPins((prev) => [
                        ...prev,
                        { id: newId, pageNumber: i + 1, x: px, y: py, color: pinColor },
                    ]);
                    setOpenCommentPinId(newId);
                    break;
                }
            }
        };
        container.addEventListener("click", onClick);
        return () => container.removeEventListener("click", onClick);
    }, [pdfSlick, mode]);

    const togglePinsMode = () => {
        if (!pdfSlick) return;
        pdfSlick.setAnnotationEditorMode(
            mode === AnnotationEditorType.STAMP ? AnnotationEditorType.NONE : AnnotationEditorType.STAMP
        );
    };

    return (
        <>
            <div
                className={`flex items-center rounded-sm group ${
                    mode === AnnotationEditorType.STAMP
                        ? "bg-blue-100"
                        : "hover:bg-slate-200/50"
                }`}
            >
                <button
                    type="button"
                    className="enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
                    onClick={togglePinsMode}
                >
                    <VscPinnedDirty className="h-4 w-4" />
                </button>
                <PinMenu usePDFSlickStore={usePDFSlickStore} setPinColor={setPinColor} />
            </div>
            {pins.map((pin) => {
                const pageView = (pdfSlick as any).viewer?.getPageView?.(pin.pageNumber - 1);
                const container = pageView?.div as HTMLElement | undefined;
                if (!container) return null;
                return createPortal(
                    <div
                        key={pin.id}
                        className="absolute"
                        style={{
                            top: `${pin.y}%`,
                            left: `${pin.x}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPinId(pin.id);
                        }}
                        onContextMenu={(e) => { // onContextMenu = right click
                            e.preventDefault(); // stop the usual behaviour (open context menu)
                            e.stopPropagation();
                            setPins((prev) => prev.filter((p) => p.id !== pin.id)); // remove pin from array
                        }} // right click to delete (will be removed in the future)
                    >
                        <div>
                            <div style={{ width: 15, height: 15, borderRadius: "50%", background: pin.color }} />
                            <div onClick={(e) => e.stopPropagation()}>
                                <Comment isOpenend={openCommentPinId === pin.id} onClose={() => setOpenCommentPinId(null)} />
                            </div>
                        </div>

                        {selectedPinId === pin.id && ( // placeholder rectangle to delete pin
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '0',
                                    width: '30px',
                                    height: '30px',
                                    background: 'grey',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent triggering pin selection again from parent div
                                    setPins((prev) => prev.filter((p) => p.id !== pin.id));
                                    setSelectedPinId(null);
                                }}
                            />
                        )}
                    </div>,
                    container
                );
            })}
        </>
    );
}
