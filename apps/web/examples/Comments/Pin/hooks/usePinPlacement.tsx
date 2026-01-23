import { TUsePDFSlickStore } from "@pdfslick/react";
import { Annotation } from "../../storage/models/Annotation";
import { useEffect } from "react";
import { AnnotationEditorType } from "pdfjs-dist";

type UsePinPlacementProps = {
    usePDFSlickStore: TUsePDFSlickStore;
    pinColor: string;
    isInteracting: boolean;
    onPinPlaced: (annotation: Annotation) => void;
    onBackgroundClick: () => void;
};

export default function usePinPlacement({ usePDFSlickStore, pinColor, isInteracting, onPinPlaced, onBackgroundClick }: UsePinPlacementProps) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const mode = usePDFSlickStore((s) => s.annotationEditorMode);

    useEffect(() => {
        const container = (pdfSlick as any)?.viewer?.container as HTMLElement | undefined;
        if (!container) return;
        const onClick = (e: MouseEvent) => {
            if (mode !== AnnotationEditorType.STAMP) return;
            
            if (isInteracting) {
                onBackgroundClick();
                return;
            }
            
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
                    const newId = crypto.randomUUID();

                    const newAnnotation: Annotation = {
                        annotation_id: newId,
                        user_id: "null", //TODO: Get the user_id from the user that is logged in.
                        document_id: "null", //TODO: Get the document_id from the document that is open.
                        annotation_type: "pin", //TODO: Use the AnnotationType enum.
                        coordinates: `${px},${py}`,
                        page: i + 1,
                        color: pinColor,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    onPinPlaced(newAnnotation);
                    break;
                }
            }
        };
        container.addEventListener("click", onClick);
        return () => container.removeEventListener("click", onClick);
    }, [pdfSlick, mode, isInteracting, onBackgroundClick, onPinPlaced]);

}