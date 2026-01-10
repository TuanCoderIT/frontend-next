export const uploadFile = async (file: File): Promise<string> => {
    // Implement your file upload logic here
    // This is a placeholder - you'll need to integrate with your backend
    // or a service like Cloudinary, S3, etc.

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url; // Return the file URL
};

export const validateFile = (file: File, maxSize: number = 10 * 1024 * 1024): boolean => {
    if (file.size > maxSize) {
        throw new Error('File size exceeds maximum allowed size');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed');
    }

    return true;
};