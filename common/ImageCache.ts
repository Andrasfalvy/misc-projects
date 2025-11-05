export default class ImageCache {
    private cache: Promise<Cache>;

    constructor() {
        this.cache = caches.open("images");
    }

    async getImage(url: string) {
        let cache = await this.cache;
        let response = await fetch(url, {
            mode: "no-cors"
        });
        await cache.put(url, response.clone());
        return url;
    }
}