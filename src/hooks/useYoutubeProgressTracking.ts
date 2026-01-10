import { useRef, useCallback, useEffect } from "react";

/**
 * Hook để tracking tiến độ xem video YouTube theo chuẩn Udemy
 * 
 * QUAN TRỌNG:
 * - watched_seconds chỉ tăng khi video PLAYING, không bao giờ giảm
 * - Tua video KHÔNG thay đổi watched_seconds
 * - currentTime chỉ dùng để hiển thị UI
 * - Auto-save mỗi 5-10s với debounce
 * - Chỉ 1 interval duy nhất, không phụ thuộc render
 */

interface UseYoutubeProgressTrackingOptions {
    /**
     * Callback được gọi mỗi giây để update UI
     * watchedSeconds: số giây đã xem thật (không tính tua)
     * percentage: phần trăm để hiển thị UI (từ watchedSeconds / duration)
     * shouldSave: true nếu cần gọi API save (auto-save)
     */
    onProgressUpdate?: (watchedSeconds: number, percentage: number, shouldSave: boolean) => void;

    /**
     * Callback được gọi khi cần save progress (chỉ khi shouldSave = true)
     * watchedSeconds: số giây đã xem thật (không tính tua)
     * percentage: phần trăm để hiển thị UI (từ watchedSeconds / duration)
     */
    onProgress?: (watchedSeconds: number, percentage: number) => void;

    /**
     * Callback được gọi khi video kết thúc
     */
    onComplete?: () => void;

    /**
     * Bật/tắt auto-save
     */
    autoSave?: boolean;

    /**
     * Thời gian ban đầu đã xem (từ backend)
     */
    initialWatchedSeconds?: number;

    /**
     * Thời lượng video (seconds)
     */
    videoDuration?: number;
}

interface UseYoutubeProgressTrackingReturn {
    /**
     * Bắt đầu tracking (gọi khi video PLAYING)
     */
    startTracking: () => void;

    /**
     * Dừng tracking (gọi khi video PAUSED hoặc ENDED)
     */
    stopTracking: () => void;

    /**
     * Cập nhật tiến độ từ player (gọi mỗi giây khi PLAYING)
     * currentTime: thời gian hiện tại của video (có thể bị tua)
     */
    updateProgress: (currentTime: number, duration: number) => void;

    /**
     * Phát hiện fast-forward (gọi mỗi 500ms khi PLAYING)
     * currentTime: thời gian hiện tại của video
     */
    checkFastForward: (currentTime: number) => void;

    /**
     * Xử lý khi video ENDED
     */
    handleVideoEnd: (duration: number) => void;

    /**
     * Lấy maxWatchedTime hiện tại (để resume)
     */
    getMaxWatchedTime: () => number;

    /**
     * Reset tracking (khi chuyển video mới)
     */
    reset: (newInitialWatchedSeconds?: number) => void;
}

export function useYoutubeProgressTracking(
    options: UseYoutubeProgressTrackingOptions = {}
): UseYoutubeProgressTrackingReturn {
    const {
        onProgressUpdate,
        onProgress,
        onComplete,
        autoSave = true,
        initialWatchedSeconds = 0,
        videoDuration = 0,
    } = options;

    // ============================================
    // REFS - Giữ giá trị không bị tạo lại khi render
    // ============================================

    /**
     * maxWatchedTime: Giá trị watched_seconds tối đa đã đạt được
     * Đây là giá trị THẬT, không bao giờ giảm, không bị ảnh hưởng bởi tua
     */
    const maxWatchedTimeRef = useRef<number>(initialWatchedSeconds);

    /**
     * lastSavedTime: Thời gian đã save lần cuối (để tránh spam API)
     */
    const lastSavedTimeRef = useRef<number>(initialWatchedSeconds);

    /**
     * Debounce timeout cho auto-save
     */
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Fast-forward detection refs
     */
    const previousTimeRef = useRef<number>(0);
    const lastCheckTimeRef = useRef<number>(Date.now());
    const isFastForwardingRef = useRef<boolean>(false);
    const fastForwardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Callback refs - để không bị tạo lại khi render
     */
    const onProgressUpdateRef = useRef(onProgressUpdate);
    const onProgressRef = useRef(onProgress);
    const onCompleteRef = useRef(onComplete);
    const autoSaveRef = useRef(autoSave);
    const videoDurationRef = useRef(videoDuration);

    // ============================================
    // UPDATE REFS KHI PROPS THAY ĐỔI
    // ============================================

    useEffect(() => {
        onProgressUpdateRef.current = onProgressUpdate;
    }, [onProgressUpdate]);

    useEffect(() => {
        onProgressRef.current = onProgress;
    }, [onProgress]);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        autoSaveRef.current = autoSave;
    }, [autoSave]);

    useEffect(() => {
        videoDurationRef.current = videoDuration;
    }, [videoDuration]);

    // ============================================
    // CORE LOGIC
    // ============================================

    /**
     * Dừng tracking - clear timeout
     * Note: Interval được quản lý bởi component, không phải hook
     */
    const stopTracking = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
        }
        if (fastForwardTimeoutRef.current) {
            clearTimeout(fastForwardTimeoutRef.current);
            fastForwardTimeoutRef.current = null;
        }
        isFastForwardingRef.current = false;
    }, []);

    /**
     * Phát hiện fast-forward (tua nhanh)
     * Logic: Nếu currentTime tăng > 9 giây trong < 3 giây thực → đang fast-forward
     */
    const handleFastForwardDetection = useCallback((currentTime: number) => {
        const prevTime = previousTimeRef.current;
        const now = Date.now();
        const timePassed = (now - lastCheckTimeRef.current) / 1000;
        const timeDifference = currentTime - prevTime;

        // Phát hiện fast-forward: timeDifference > 9s trong < 3s thực
        if (timeDifference > 9 && prevTime > 0 && timePassed < 3) {
            isFastForwardingRef.current = true;

            // Clear timeout cũ nếu có
            if (fastForwardTimeoutRef.current) {
                clearTimeout(fastForwardTimeoutRef.current);
            }

            // Tự động tắt fast-forward sau 5 giây
            fastForwardTimeoutRef.current = setTimeout(() => {
                isFastForwardingRef.current = false;
                fastForwardTimeoutRef.current = null;
            }, 5000);

            previousTimeRef.current = currentTime;
            lastCheckTimeRef.current = now;
        } else if (timeDifference <= 20 && timeDifference >= -1) {
            // Xem bình thường: timeDifference hợp lý
            previousTimeRef.current = currentTime;
            lastCheckTimeRef.current = now;

            // Nếu đang trong trạng thái fast-forward và timeDifference hợp lý → tắt fast-forward
            if (isFastForwardingRef.current && timeDifference <= 20) {
                isFastForwardingRef.current = false;
                if (fastForwardTimeoutRef.current) {
                    clearTimeout(fastForwardTimeoutRef.current);
                    fastForwardTimeoutRef.current = null;
                }
            }
        } else {
            // Cập nhật refs
            previousTimeRef.current = currentTime;
            lastCheckTimeRef.current = now;
        }
    }, []);

    /**
     * Cập nhật tiến độ từ player
     * currentTime: có thể bị tua (nhảy lùi/tới)
     * duration: thời lượng video
     */
    const updateProgress = useCallback((currentTime: number, duration: number) => {
        // Chỉ cập nhật nếu duration hợp lệ
        if (!duration || duration < 10) return;

        // QUAN TRỌNG: Chỉ tăng watchedSeconds khi KHÔNG phải fast-forwarding
        // Nếu đang fast-forwarding → không tăng watchedSeconds
        if (!isFastForwardingRef.current) {
            // QUAN TRỌNG: maxWatchedTime chỉ tăng, không bao giờ giảm
            // Nếu currentTime < maxWatchedTime → đó là do tua lùi → bỏ qua
            // Nếu currentTime >= maxWatchedTime → đó là xem thật → cập nhật
            const newMaxWatched = Math.max(maxWatchedTimeRef.current, currentTime);

            // Clamp không vượt quá duration
            const clampedWatched = Math.min(newMaxWatched, duration);

            // Cập nhật maxWatchedTime
            maxWatchedTimeRef.current = clampedWatched;
        }

        // Lấy giá trị hiện tại (có thể không thay đổi nếu đang fast-forwarding)
        const clampedWatched = maxWatchedTimeRef.current;

        // Tính percentage để hiển thị UI (dựa trên maxWatchedTime, không phải currentTime)
        const percentage = Math.min(Math.round((clampedWatched / duration) * 100), 100);

        // Kiểm tra xem có cần auto-save không
        const timeSinceLastSave = clampedWatched - lastSavedTimeRef.current;
        const shouldSave = autoSaveRef.current && timeSinceLastSave >= 5;

        // QUAN TRỌNG: Luôn gọi onProgressUpdate để update UI mỗi giây
        // Component sẽ tự quyết định có gọi API hay không dựa trên shouldSave
        if (onProgressUpdateRef.current) {
            onProgressUpdateRef.current(clampedWatched, percentage, shouldSave);
        }

        // Auto-save logic: cập nhật lastSavedTime khi shouldSave = true
        // Component sẽ tự gọi API trong onProgressUpdate callback
        if (shouldSave) {
            // Clear timeout cũ nếu có
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
            }

            // Update lastSavedTime ngay để tránh gọi API nhiều lần
            // Debounce sẽ được xử lý ở component level nếu cần
            lastSavedTimeRef.current = clampedWatched;
        }

        return {
            watchedSeconds: clampedWatched,
            percentage,
        };
    }, []);

    /**
     * Bắt đầu tracking
     * Note: Interval được quản lý bởi component, hook chỉ quản lý logic tracking
     */
    const startTracking = useCallback(() => {
        // Reset fast-forward detection refs khi bắt đầu play
        previousTimeRef.current = 0;
        lastCheckTimeRef.current = Date.now();
        isFastForwardingRef.current = false;
        if (fastForwardTimeoutRef.current) {
            clearTimeout(fastForwardTimeoutRef.current);
            fastForwardTimeoutRef.current = null;
        }
    }, []);

    /**
     * Xử lý khi video kết thúc
     */
    const handleVideoEnd = useCallback((duration: number) => {
        stopTracking();

        // Khi video END → gửi watched_seconds = full duration và percentage = 100%
        const finalDuration = duration || videoDurationRef.current || maxWatchedTimeRef.current;

        maxWatchedTimeRef.current = finalDuration;
        lastSavedTimeRef.current = finalDuration;

        // Gửi ngay lập tức (không debounce) với 100%
        // shouldSave = true để component gọi API save
        if (onProgressUpdateRef.current) {
            onProgressUpdateRef.current(Math.floor(finalDuration), 100, true);
        }

        if (onCompleteRef.current) {
            onCompleteRef.current();
        }
    }, [stopTracking]);

    /**
     * Lấy maxWatchedTime hiện tại
     */
    const getMaxWatchedTime = useCallback(() => {
        return maxWatchedTimeRef.current;
    }, []);

    /**
     * Reset tracking (khi chuyển video mới)
     */
    const reset = useCallback((newInitialWatchedSeconds?: number) => {
        stopTracking();

        const initial = newInitialWatchedSeconds ?? initialWatchedSeconds;
        maxWatchedTimeRef.current = initial;
        lastSavedTimeRef.current = initial;
        previousTimeRef.current = initial;
        lastCheckTimeRef.current = Date.now();
        isFastForwardingRef.current = false;
    }, [initialWatchedSeconds, stopTracking]);

    // Cleanup khi unmount
    useEffect(() => {
        return () => {
            // Clear timeout khi unmount
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            if (fastForwardTimeoutRef.current) {
                clearTimeout(fastForwardTimeoutRef.current);
            }
        };
    }, []);

    return {
        startTracking,
        stopTracking,
        updateProgress,
        checkFastForward: handleFastForwardDetection,
        handleVideoEnd,
        getMaxWatchedTime,
        reset,
    };
}

