export interface PagesJsonType {
  pre_delete_pages: PreDeletePagesType[];
  deleted_pages: DeletedPagesType[];
  errors: [{ threadId: number; postId: number; title: string; source: string; errorType: string }];
  update_timestamp: number;
}

export interface PreDeletePagesType {
  link: string;
  title: string;
  score: number;
  release_score: number;
  time: number;
  discuss_link: string;
  post_id: number;
  isOriginal: boolean;
  timestamp: number;
}

export interface DeletedPagesType {
  link: string;
  title: string;
  score: number;
  time: number;
  context: string;
  page_type: string[];
  release_score: number;
}

export interface TimerTextType {
  warning: string;
  text: string;
  timer: string;
  status: string;
}

export interface TimerComponentType {
  type: "ban" | "delete" | "custom";
  time: Date | string;
  custom?: { before?: string; after?: string };
}
