export interface pagesJsonType {
    pre_delete_pages: [
        {
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
    ];
    deleted_pages: [
        {
            link: string;
            title: string;
            score: number;
            time: number;
            context: string;
            page_type: string[];
            release_score: number;
        }
    ];
    errors: [
        {
            threadId: number;
            postId: number;
            title: string;
            source: string;
            errorType: string;
        }
    ];
    update_timestamp: number;
}

export interface timerTextType {
    warning: string;
    text: string;
    timer: string;
    status: string;
}
