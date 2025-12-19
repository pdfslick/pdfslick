import { Annotation } from "./models/Annotation";
import { Document } from "./models/Document";
import { pdfDocs } from "../../../components/pdfDocs";
import type { Comment as CommentModel } from './models/Comment';

const ANNOTATION_KEY = 'annotations';
const DOCUMENT_KEY = 'documents';
const COMMENT_KEY = 'comments';

//COMMENTS
//--------------------------------
export function getComments(): CommentModel[] {
    const comments = localStorage.getItem(COMMENT_KEY);
    return comments ? JSON.parse(comments) : [];
}

export function getCommentsFromAnnotation(annotationId: string): CommentModel[] | null {
    const existingComments = getComments();
    const existingCommentsFromAnnotation = existingComments.filter((comment: CommentModel) => comment.annotation_id === annotationId);

    if (!existingCommentsFromAnnotation) return null;
    return existingCommentsFromAnnotation;
}

export function storeComment(comment: CommentModel) {
    const existingComments = getComments();
    existingComments.push(comment);
    localStorage.setItem(COMMENT_KEY, JSON.stringify(existingComments));
}

export function deleteComment(commentId: string) {
    const existingComments = getComments();
    const filteredComments = existingComments.filter((comment: CommentModel) => comment.comment_id !== commentId);
    localStorage.setItem(COMMENT_KEY, JSON.stringify(filteredComments));
}

export function deleteCommentsFromAnnotation(annotationId: string) {
    const existingComments = getComments();
    const filteredComments = existingComments.filter((comment: CommentModel) => comment.annotation_id !== annotationId);
    localStorage.setItem(COMMENT_KEY, JSON.stringify(filteredComments));
}

export function getAnnotationFromComment(commentId: string): Annotation | null {
    const existingComments = getComments();
    const existingComment = existingComments.find((comment: CommentModel) => comment.comment_id === commentId);
    const existingAnnotations = getAnnotations()
    const existingAnnotation = existingAnnotations.find((annotation: Annotation) => annotation.annotation_id === existingComment?.annotation_id);

    if (!existingAnnotation) return null;
    return existingAnnotation;
}

//ANNOTATIONS
//--------------------------------
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

//DOCUMENTS
//--------------------------------
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