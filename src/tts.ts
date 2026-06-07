interface Narrations {
    id: string
    narration: string;
}

const extract_narrations = (llm_output: string) : Narrations[] => {

    // extract narrations logic here..
    //
    // Example return
    return [{
        id: 'why-is-the-sky-blue',
        narration: 'xyz'
    }]
}

// returns the ULRs of buckets in which the audio file (mp3) files are in Supabase, ex:
// TTS generation is done concurrently using Promise.all
// Tip: once we run `store_audio_in_bucket`, we'll know the url buckets by simply using process.env.S3_ENDPOINT, etc.,
const generateTTSAndFetchStorageUrls = (narrations: Narrations[]) : string[] => {
    return [
        // ex: 'https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/why-is-the-sky-blue/0.mp3'
    ]
}
