import type { pagesJsonType } from '$lib/types';
import type { PageServerLoad } from './$types';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export const load: PageServerLoad = async () => {
	let pagesJson: pagesJsonType;
	const response = await fetch('https://cn-cd-dx-tmp17.natfrp.cloud:32470/', {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error(response.status + response.statusText);
	}
	pagesJson = await response.json();
    console.log(`${response.status}: ${response.statusText}`);
	return pagesJson;
};
