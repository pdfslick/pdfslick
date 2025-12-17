import { Annotation } from "./models/Annotation";
import { Document } from "./models/Document";
import { pdfDocs } from "../../../components/pdfDocs";

const ANNOTATION_KEY = 'annotations';
const DOCUMENT_KEY = 'documents';

export function getAnnotations(): Annotation[] {
    const annotations = localStorage.getItem(ANNOTATION_KEY);
    return annotations ? JSON.parse(annotations) : [];
}

export function storeAnnotation(annotation: Annotation) {
    const existingAnnotations = getAnnotations();
    existingAnnotations.push(annotation);
    localStorage.setItem(ANNOTATION_KEY, JSON.stringify(existingAnnotations));
}

export function deleteAnnotation(annotationId: string) {
    const existingAnnotations = getAnnotations();
    const filteredAnnotations = existingAnnotations.filter((annotation) => annotation.annotation_id !== annotationId);
    localStorage.setItem(ANNOTATION_KEY, JSON.stringify(filteredAnnotations));
}

export function getDocuments(): Document[] {
    const documents = localStorage.getItem(DOCUMENT_KEY);
    return documents ? JSON.parse(documents) : [];
}

export function storeDocument(document: Document) {
    const existingDocuments = getDocuments();
    existingDocuments.push(document);
    localStorage.setItem(DOCUMENT_KEY, JSON.stringify(existingDocuments));
}

export function initDocuments() {
    //IMPORTANT NOTE: These PDF-file names are hardcoded in the pdfDocs.ts file. (pdfDocs.ts is already part of PDFSlick).
    const entries = Object.entries(pdfDocs);

    if (!localStorage.getItem(DOCUMENT_KEY)) {
        const documents: Document[] = entries.map(([_, doc]) => ({
          document_id: crypto.randomUUID(),
          document_name: doc.title ?? doc.name,
          document_url: doc.url,
          document_filetype: 'pdf',
          document_size: doc.size ?? 0,
          amount_of_pages: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
      
        localStorage.setItem(DOCUMENT_KEY, JSON.stringify(documents));
    }
  }