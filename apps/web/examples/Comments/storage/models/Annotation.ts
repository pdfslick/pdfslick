export type AnnotationType = 'highlight' | 'comment' | 'drawing';

export interface Annotation {
    annotation_id: string;
    user_id: string;
    document_id: string;
    annotation_type: AnnotationType;
    coordinates: string;
    page: number;
    color: string;
    created_at: string;
    updated_at: string;
  }