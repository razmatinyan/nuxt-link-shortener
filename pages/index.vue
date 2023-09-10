<template>
	<UContainer class="mt-28 mb-28">
        <h1 class="wrapper relative flex justify-center text-4xl font-semibold mb-10">URL Shortener</h1>
        <UInput 
            v-model="link"
            size="lg"
            icon="i-heroicons-link"
            class="max-w-lg mx-auto mb-10"
            placeholder="https://example.com/"
        />
        <div class="wrapper text-center">
            <UButton
                class="text-center text-lg"
                :disabled="link === ''"
                :loading="loading"
                @click="generateURL();"
            >
                Generate
            </UButton>
        </div>

        <UTable :columns="columns" :rows="urls" class="mt-20 max-w-2xl mx-auto" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No link yet.' }" />
    </UContainer>

    <UNotifications class="sm:w-4/12" />

    <UModal v-model="openModal" prevent-close>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Information</h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="openModal = false" />
                </div>
            </template>

            <div class="flex items-center">
                Your link is: 
                <code class="ml-1">{{ config.public.DOMAIN + 'url/' + shortLink }}</code>
                <UTooltip text="Copy URL">
                    <UButton class="icon-btn ml-1 px-1.5 py-1.5" @click="copyUrl">
                        <UIcon name="i-heroicons-clipboard" />
                    </UButton>
                </UTooltip>
            </div>
        </UCard>
    </UModal>
</template>

<script setup>
// Composables / Libs
const db = useSupabaseClient();
const config = useRuntimeConfig();
const toast = useToast();
const cookies = useCookie('urls');

// Variables
const link = ref('');
const shortLink = ref('');
const loading = ref(false);
const openModal = ref(false);
const urls = ref([]);
const columns = [
    {
        key: 'url',
        label: 'URL'
    },
    {
        key: 'shortUrl',
        label: 'Short URL'
    },
    {
        key: 'visits',
        label: 'Visits'
    }
]

// Actions
if ( cookies.value ) {
    const cookieUrls = cookies.value;

    for(let url in cookieUrls) {
        let currentUrl = cookieUrls[url];
        let row = await db.from('links').select().eq('shortUrl', currentUrl.shortUrl);
        let newUrl = row.data[0].url.length > 25 ? row.data[0].url.slice(0, 25) + '...' : row.data[0].url;

        urls.value.push({
            url: newUrl,
            shortUrl: `${config.public.DOMAIN}url/${row.data[0].shortUrl}`,
            visits: row.data[0].visits ?? 0
        })
    }
}

// Functions
async function generateURL() {
    loading.value = true;

    if ( validateURL(link.value) !== false ) {
        const data = await $fetch('/api/link', {
            method: 'POST',
            body: {
                url: link.value
            }
        });

        if ( !data.error ) {
            urls.value.push({
                url: data.data[0].url.length > 25 ? data.data[0].url.slice(0, 25) + '...' : data.data[0].url,
                shortUrl: `${config.public.DOMAIN}url/${data.data[0].shortUrl}`,
                visits: data.data[0].visits ?? 0
            });

            shortLink.value = data.data[0].shortUrl;
            openModal.value = true;
        }

    } else {
        showError('URL is not valid.', 'Valid URL should look like this: https://example.com/');
    }

    link.value = '';
    loading.value = false;
}

function copyUrl() {
    navigator.clipboard.writeText(config.public.DOMAIN + 'url/' + shortLink.value);
    openModal.value = false;
    showSuccess('Clipboard', 'URL is copied to your clipboard.');
}

function validateURL(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

function showError(title, description) {
    toast.add({
        title,
        description,
        icon: 'i-heroicons-x-circle',
        color: 'red'
    });
}

function showSuccess(title, description) {
    toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green'
    });
}
</script>

<style>
::-webkit-scrollbar {
	width: 8px;
}
::-webkit-scrollbar-track {
	background: #1E293B;
	border-radius: 10px;
}
::-webkit-scrollbar-thumb {
	background: #334155;
	border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
	background: #3c4a5e;
}
body {
	font: normal 16px/1.5 'Inter', sans-serif;
}
code {
    display: inline-block;
    background-color: rgb(30 41 59);
    border: rgb(51 65 85);
    border-radius: .375rem;
    color: #fff;
    font-size: .875em;
    font-weight: 600;
    padding: .25rem .375rem;
}
</style>