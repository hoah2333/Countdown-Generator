import type { pagesJsonType } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	let pagesJson: pagesJsonType;
	const response = await fetch('https://cn-cd-dx-tmp17.natfrp.cloud:32470/', {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error(response.status + response.statusText);
	}
	pagesJson = await response.json();
	return pagesJson;
};
