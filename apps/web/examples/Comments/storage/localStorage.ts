import { Annotation } from "./models/Annotation";

const ANNOTATION_KEY = 'annotations';

export function getAnnotations(): Annotation[] {
    const annotations = localStorage.getItem(ANNOTATION_KEY);
    return annotations ? JSON.parse(annotations) : [];
}

export function storeAnnotation(annotation: Annotation) {
    const existingAnnotations = getAnnotations();
    existingAnnotations.push(annotation);
    localStorage.setItem(ANNOTATION_KEY, JSON.stringify(existingAnnotations));
}

