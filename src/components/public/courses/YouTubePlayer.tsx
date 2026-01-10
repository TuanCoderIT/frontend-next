"use client";

interface YouTubePlayerProps {
    videoUrl: string;
    title?: string;
}

export default function YouTubePlayer({ videoUrl, title }: YouTubePlayerProps) {
    // Extract video ID from various YouTube URL formats
    const getVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    };

    const videoId = getVideoId(videoUrl);

    if (!videoId) {
        return (
            <div className="flex h-96 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">URL YouTube không hợp lệ</p>
                    <p className="mt-1 text-xs text-gray-500">{videoUrl}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ paddingBottom: "56.25%" }}>
            <iframe
                className="absolute left-0 top-0 h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={title || "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

