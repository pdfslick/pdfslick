import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TUsePDFSlickStore } from "@pdfslick/react";
import { AnnotationEditorType } from "pdfjs-dist";
import Comment from "./Comment/Comment";

type PinButtonProps = {
    usePDFSlickStore: TUsePDFSlickStore;
};

export default function PinButton({ usePDFSlickStore }: PinButtonProps) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const mode = usePDFSlickStore((s) => s.annotationEditorMode);
    const [pins, setPins] = useState<
        Array<{ id: string; pageNumber: number; x: number; y: number }>
    >([]);
    const [openCommentPinId, setOpenCommentPinId] = useState<string | null>(null);
    
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
                        { id: newId, pageNumber: i + 1, x: px, y: py },
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
            <button
                type="button"
                className={
                    mode === AnnotationEditorType.STAMP
                        ? "px-2 py-1 rounded-sm bg-blue-100 border border-blue-200 text-blue-700"
                        : "px-2 py-1 rounded-sm border border-transparent enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500"
                }
                onClick={togglePinsMode}
            >
                Pins
            </button>
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
                        }}
                        onContextMenu={(e) => { // onContextMenu = right click
                            // stop the usual behaviour (open context menu) and remove pin
                            e.preventDefault(); 
                            setPins((prev) => prev.filter((p) => p.id !== pin.id));
                        }}
                    >
                        <div>
                            <div style={{ width: 15, height: 15, borderRadius: "50%", background: "red" }} />
                            <div onClick={(e) => e.stopPropagation()}>
                                <Comment isOpenend={openCommentPinId === pin.id} onClose={() => setOpenCommentPinId(null)} />
                            </div>
                        </div>
                    </div>,
                    container
                );
            })}
        </>
    );
}
