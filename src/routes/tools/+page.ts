import type { pagesJsonType } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const load: PageLoad = async ({ fetch }) => {
	let pagesJson: pagesJsonType;

	let response: Response;

	try {
		response = await fetch('https://cn-cd-dx-tmp17.natfrp.cloud:32470/', {
			method: 'GET',
			credentials: 'omit'
		});
	} catch (e) {
		console.error(e);
		error(503, `Br_Bot 服务器未响应，原因：${e}`);
	}

	if (!response.ok) {
		error(response.status, `Br_Bot 服务器未响应，原因：${response.statusText}`);
	}
	pagesJson = await response.json();
	return pagesJson;
};
