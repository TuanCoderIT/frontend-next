// app/(admin)/403.tsx hoặc app/403.tsx
export default function ForbiddenPage() {
  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600">403</h1>
        <p className="mt-2 text-lg">Bạn không có quyền truy cập trang này.</p>
        <p className="mt-4">
          Vui lòng liên hệ với quản trị viên nếu bạn nghĩ đây là một lỗi.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Quay lại trang chủ
        </a>
      </div>
    </div>
  );
}
