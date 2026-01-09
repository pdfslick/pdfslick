export interface Document {
    document_id: string;
    user_id?: string;           //TODO: Make user_id required. Current user_id is optional, since we are not logged in yet.
    document_name: string;
    document_url: string;
    document_filetype: string;
    document_size: number;
    amount_of_pages: number;
    created_at: string;
    updated_at: string;
  }