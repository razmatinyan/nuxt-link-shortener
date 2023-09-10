import { serverSupabaseClient } from '#supabase/server';

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
	const db = await serverSupabaseClient<Database>(event);
	const home = useRuntimeConfig().public.DOMAIN;
	const url = event.context.params?.url;
	const { data } = await db.from('links').select().eq('shortUrl', url);
	let redirectUrl = home;

	if (data?.length) {
		redirectUrl = data[0].url;
		let visits = data[0].visits + 1;
		await db.from('links').update({ visits }).eq('id', data[0].id);
	}

	return sendRedirect(event, redirectUrl, 301);
});
