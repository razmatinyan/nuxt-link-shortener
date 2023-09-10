export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxt/ui', '@nuxtjs/supabase'],
	ui: {
		global: true,
		icons: ['heroicons'],
	},
	colorMode: {
		preference: 'dark',
	},
	css: ['~/assets/fonts.css'],
	alias: {
		assets: '/<rootDir>/assets',
	},
	supabase: {
		redirectOptions: {
			login: '/',
			callback: '/',
			exclude: [],
		},
	},
	runtimeConfig: {
		public: {
			DOMAIN: process.env.DOMAIN ?? 'http://127.0.0.1:3000/',
		},
	},
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			title: 'URL Shortener - Create Short links and track them | URLShortener',
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0',
			meta: [
				{
					name: 'description',
					content:
						'Create Short links and track them, get statistics about visits count.',
				},
				{
					name: 'keywords',
					content: 'URL, Shortener, URL Shortener, Short, Link, short link',
				},
				// {
				// 	hid: "og:image",
				// 	property: "og:image",
				// 	content: "/og-image.jpg"
				// },
				// {
				// 	hid: "og:site_name",
				// 	property: "og:site_name",
				// 	content: "Colorgen"
				// },
				// {
				// 	hid: "og:type",
				// 	property: "og:type",
				// 	content: "website"
				// },
				// {
				// 	name: "google-site-verification",
				// 	content: "_nkR76E889L8-Gs_AQOTLSCNwkS4PKh40ZgsIoL028w"
				// },
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/logo.svg' }],
		},
	},
});
