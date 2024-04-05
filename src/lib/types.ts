export interface pagesJsonType {
	deleted_pages: [
		{
			context: string;
			link: string;
			page_type: string[];
			release_score: number;
			score: number;
			time: number;
			title: string;
		}
	];
	errors: [
		{
			num: number;
			id: string;
			content: string;
			url: string;
			error_type: string;
		}
	];
	pre_delete_pages: [
		{
			discuss_link: string;
			isOriginal: boolean;
			link: string;
			post_id: string;
			post_page: number;
			release_score: number;
			score: number;
			time: number;
			timestamp: number;
			title: string;
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
