/**
 * converts a Google Drive share link into a direct download/view link
 * that can be used in an <img> tag.
 * 
 * Supported formats:
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/open?id=FILE_ID
 */
export function getDirectDriveUrl(url: string): string {
    if (!url) return "";

    // If it's already a direct Google user content link or not a drive link, return as is
    if (!url.includes("drive.google.com")) {
        return url;
    }

    try {
        let fileId = "";

        // Pattern 1: /file/d/FILE_ID/view
        const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match1 && match1[1]) {
            fileId = match1[1];
        }

        // Pattern 2: id=FILE_ID
        const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match2 && match2[1]) {
            fileId = match2[1];
        }

        if (fileId) {
            // lh3.googleusercontent.com is generally faster and supports resizing params if needed, 
            // but drive.google.com/uc?id=XXX is the standard export format.
            // Using UC export=view is reliable for images.
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
    } catch (e) {
        console.error("Error parsing Google Drive URL:", e);
    }

    return url;
}
