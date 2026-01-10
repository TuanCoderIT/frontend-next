"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LessonVideoPlayerProps {
    videoUrl: string;
    title: string;
    lessonId: number;
    initialWatchedSeconds?: number;
    videoDuration?: number;
    isCompleted?: boolean;
    onProgress?: (watchedSeconds: number, percentage: number) => void;
    onComplete?: () => void;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

/**
 * Extract video ID from YouTube URL
 */
function getVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
}

/**
 * Calculate percentage from watched seconds and duration
 */
function calcPercent(watchedSeconds: number, duration: number): number {
    if (!duration || duration <= 0) return 0;
    return Math.min(Math.round((watchedSeconds / duration) * 100), 100);
}

/**
 * LessonVideoPlayer Component - Đơn giản hóa theo file mẫu
 * 
 * QUAN TRỌNG:
 * - watchTime tăng mỗi giây khi PLAYING và không fast-forwarding
 * - Tua video KHÔNG tăng watchTime
 * - Chỉ save progress khi cần (không phải mỗi 5s)
 * - Hoàn thành khi watchTime >= duration * 0.75 (75%)
 */
export default function LessonVideoPlayer({
    videoUrl,
    title,
    lessonId,
    initialWatchedSeconds = 0,
    videoDuration = 0,
    isCompleted: externalIsCompleted = false,
    onProgress,
    onComplete,
}: LessonVideoPlayerProps) {
    // ============================================
    // STATE
    // ============================================
    const [watchTime, setWatchTime] = useState(initialWatchedSeconds);
    const [videoProgress, setVideoProgress] = useState(
        videoDuration > 0 ? calcPercent(initialWatchedSeconds, videoDuration) : 0
    );
    const [currentVideoDuration, setCurrentVideoDuration] = useState(videoDuration || 0);
    const [isCompleted, setIsCompleted] = useState(externalIsCompleted);
    const [isPaused, setIsPaused] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // ============================================
    // REFS
    // ============================================
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const fastForwardCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const saveProgressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fast-forward detection refs
    const isFastForwardingRef = useRef(false);
    const previousTimeRef = useRef(0);
    const lastCheckTimeRef = useRef(Date.now());

    // ============================================
    // FAST-FORWARD DETECTION
    // ============================================
    const handleFastForwardDetection = useCallback((currentTime: number) => {
        const prevTime = previousTimeRef.current;
        const now = Date.now();
        const timePassed = (now - lastCheckTimeRef.current) / 1000;
        const timeDifference = currentTime - prevTime;

        if (timeDifference > 9 && prevTime > 0 && timePassed < 3) {
            isFastForwardingRef.current = true;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            const newTimeoutId = setTimeout(() => {
                isFastForwardingRef.current = false;
            }, 5000);
            timeoutRef.current = newTimeoutId;

            previousTimeRef.current = currentTime;
            lastCheckTimeRef.current = now;
        } else if (timeDifference <= 20 && timeDifference >= -1) {
            previousTimeRef.current = currentTime;
            lastCheckTimeRef.current = now;

            if (isFastForwardingRef.current && timeDifference <= 20) {
                isFastForwardingRef.current = false;
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            }
        } else {
            previousTimeRef.current = currentTime;
            lastCheckTimeRef.current = now;
        }
    }, []);

    // ============================================
    // SAVE PROGRESS (debounced)
    // ============================================
    const saveProgressDebounced = useCallback((watchedSeconds: number, percentage: number) => {
        // Clear timeout cũ nếu có
        if (saveProgressTimeoutRef.current) {
            clearTimeout(saveProgressTimeoutRef.current);
        }

        // Debounce: đợi 2 giây sau lần tick cuối mới gọi API
        saveProgressTimeoutRef.current = setTimeout(() => {
            if (onProgress) {
                onProgress(watchedSeconds, percentage);
            }
        }, 2000);
    }, [onProgress]);

    // ============================================
    // PLAYER STATE CHANGE HANDLER
    // ============================================
    const handlePlayerStateChange = useCallback(
        (event: any) => {
            const player = playerRef.current;
            if (!player) return;

            if (event.data === 1) {
                // PLAYING
                setIsPaused(false);

                // Clear interval cũ nếu có
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }

                // Set initial time
                const initialTime = player.getCurrentTime() || 0;
                previousTimeRef.current = initialTime;
                lastCheckTimeRef.current = Date.now();

                // Clear fast-forward check interval cũ
                if (fastForwardCheckIntervalRef.current) {
                    clearInterval(fastForwardCheckIntervalRef.current);
                }

                // Fast-forward check interval (mỗi 500ms)
                fastForwardCheckIntervalRef.current = setInterval(() => {
                    if (player && player.getCurrentTime) {
                        try {
                            const currentTime = player.getCurrentTime();
                            if (
                                currentTime !== undefined &&
                                currentTime !== null &&
                                !isNaN(currentTime)
                            ) {
                                handleFastForwardDetection(currentTime);
                            }
                        } catch (e) {
                            console.warn("Error checking fast forward:", e);
                        }
                    }
                }, 500);

                // Watch time interval (mỗi giây)
                intervalRef.current = setInterval(() => {
                    if (player && player.getCurrentTime) {
                        try {
                            const currentTime = player.getCurrentTime();
                            if (
                                currentTime !== undefined &&
                                currentTime !== null &&
                                !isNaN(currentTime)
                            ) {
                                // Chỉ tăng watchTime khi KHÔNG fast-forwarding
                                if (!isFastForwardingRef.current) {
                                    setWatchTime((prev) => {
                                        const newWatchTime = prev + 1;

                                        // Update progress percentage
                                        const duration = player.getDuration() || currentVideoDuration;
                                        if (duration > 0) {
                                            const percentage = calcPercent(newWatchTime, duration);
                                            setVideoProgress(percentage);

                                            // Save progress (debounced)
                                            saveProgressDebounced(newWatchTime, percentage);

                                            // Check if completed (75% of duration)
                                            const requiredTime = Math.floor(duration * 0.75);
                                            if (newWatchTime >= requiredTime && !isCompleted) {
                                                setIsCompleted(true);
                                                if (onComplete) {
                                                    onComplete();
                                                }
                                            }
                                        }

                                        return newWatchTime;
                                    });
                                    previousTimeRef.current = currentTime;
                                    lastCheckTimeRef.current = Date.now();
                                }
                            }
                        } catch (e) {
                            console.warn("Error getting current time:", e);
                        }
                    }
                }, 1000);
            }

            if (event.data === 2 || event.data === 0) {
                // PAUSED or ENDED
                setIsPaused(true);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                if (fastForwardCheckIntervalRef.current) {
                    clearInterval(fastForwardCheckIntervalRef.current);
                    fastForwardCheckIntervalRef.current = null;
                }
            }
        },
        [handleFastForwardDetection, currentVideoDuration, isCompleted, onComplete, saveProgressDebounced]
    );

    // ============================================
    // PLAYER READY HANDLER
    // ============================================
    const handlePlayerReady = useCallback((event: any) => {
        setIsReady(true);
        const player = event.target;
        const duration = player.getDuration();

        if (duration && duration > 0) {
            setCurrentVideoDuration(duration);

            // Set initial progress
            const initialProgress = calcPercent(initialWatchedSeconds, duration);
            setWatchTime(initialWatchedSeconds);
            setVideoProgress(initialProgress);
        }

        // Set initial time for fast-forward detection
        const currentTime = player.getCurrentTime() || 0;
        previousTimeRef.current = currentTime;
        lastCheckTimeRef.current = Date.now();
        playerRef.current = player;

        // Seek đến vị trí đã xem
        if (initialWatchedSeconds > 0) {
            player.seekTo(initialWatchedSeconds, true);
        }
    }, [initialWatchedSeconds]);

    // ============================================
    // YOUTUBE PLAYER INITIALIZATION
    // ============================================
    useEffect(() => {
        if (typeof window === "undefined") return;

        const vid = getVideoId(videoUrl);
        if (!vid) return;

        const initPlayer = () => {
            if (!containerRef.current || !window.YT) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: vid,
                playerVars: {
                    autoplay: 0,
                    start: Math.floor(initialWatchedSeconds),
                    rel: 0,
                    modestbranding: 1,
                    enablejsapi: 1,
                    playsinline: 1,
                },
                events: {
                    onReady: handlePlayerReady,
                    onStateChange: handlePlayerStateChange,
                },
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            tag.id = "youtube-iframe-api";
            document.body.appendChild(tag);

            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            // Cleanup
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (fastForwardCheckIntervalRef.current) {
                clearInterval(fastForwardCheckIntervalRef.current);
                fastForwardCheckIntervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (saveProgressTimeoutRef.current) {
                clearTimeout(saveProgressTimeoutRef.current);
                saveProgressTimeoutRef.current = null;
            }
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch {
                    // Ignore errors
                }
                playerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoUrl, initialWatchedSeconds]);

    // ============================================
    // RESET KHI LESSON THAY ĐỔI
    // ============================================
    useEffect(() => {
        setWatchTime(initialWatchedSeconds);
        setIsPaused(false);
        setIsReady(false);
        previousTimeRef.current = 0;
        lastCheckTimeRef.current = Date.now();
        isFastForwardingRef.current = false;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (fastForwardCheckIntervalRef.current) {
            clearInterval(fastForwardCheckIntervalRef.current);
            fastForwardCheckIntervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, [lessonId, initialWatchedSeconds]);

    // ============================================
    // UPDATE COMPLETED STATE
    // ============================================
    useEffect(() => {
        setIsCompleted(externalIsCompleted);
    }, [externalIsCompleted]);

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="space-y-4">
            {/* Player */}
            <div
                className="relative w-full overflow-hidden rounded-xl bg-black"
                style={{ paddingBottom: "56.25%" }}
            >
                <div ref={containerRef} className="absolute left-0 top-0 h-full w-full" />
            </div>

            {/* Progress UI */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Tiến độ bài học</span>
                    <span className="font-medium">
                        {currentVideoDuration
                            ? `${Math.floor(watchTime)}s / ${Math.floor(
                                currentVideoDuration
                            )}s (${videoProgress}%)`
                            : `${videoProgress}%`}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                    />
                </div>

                {isCompleted && (
                    <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-2 rounded-lg">
                        ✓ Đã hoàn thành bài học
                    </div>
                )}
            </div>
        </div>
    );
}
