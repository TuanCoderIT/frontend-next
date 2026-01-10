/**
 * Get full image URL from API response
 * If the URL is a relative path, prepend the backend base URL
 */
export function getImageUrl(url: string | null | undefined): string {
    if (!url || url.trim() === "") {
        console.warn("getImageUrl: Empty or null URL provided");
        return "";
    }

    // If already a full URL (http/https), return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
        console.log("getImageUrl: Full URL detected:", url);
        return url;
    }

    // If relative path, prepend backend base URL
    // Remove /api from base URL since storage is at root level
    const baseURL = "http://localhost:8000";
    const fullUrl = `${baseURL}${url.startsWith("/") ? url : `/${url}`}`;
    console.log("getImageUrl: Converted relative path to full URL:", { original: url, full: fullUrl });
    return fullUrl;
}

