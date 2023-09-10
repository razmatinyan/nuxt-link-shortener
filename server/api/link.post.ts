import { defineEventHandler, parseCookies, setCookie, getCookie } from 'h3';
import { serverSupabaseClient } from '#supabase/server';
import crypto from 'crypto';

interface Database {
	public: {
		Tables: {
			movies: {
				Row: {
					id: number;
					name: string;
					data: JSON | null;
				};
				Insert: {
					id?: never;
					name: string;
					data?: JSON | null;
				};
				Update: {
					id?: never;
					name?: string;
					data?: JSON | null;
				};
			};
		};
	};
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const db = await serverSupabaseClient<Database>(event);
	let allUrls: string | undefined | Array<{ link: string; shortUrl: string; visits: 0 }> =
		getCookie(event, 'urls');

	const shortUrl = crypto.randomBytes(6).toString('hex');
	const { data, error } = await db.from('links').insert({ url: body.url, shortUrl }).select();

	if (!error) {
		if (allUrls === undefined || allUrls === '') {
			allUrls = JSON.stringify([
				{
					link: body.url,
					shortUrl,
					visits: 0,
				},
			]);
		} else {
			allUrls = JSON.parse(allUrls);
			if (Array.isArray(allUrls)) {
				allUrls?.push({
					link: body.url,
					shortUrl,
					visits: 0,
				});

				allUrls = JSON.stringify(allUrls);
			}
		}

		setCookie(event, 'urls', allUrls as string, {
			maxAge: 365 * 24 * 60 * 60,
		});
	}

	return {
		data,
		error,
	};
});
