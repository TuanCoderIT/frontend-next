"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getCourses } from "@/api/courses";
import { getCategories } from "@/api/quiz";
import { Course } from "@/types/public/course";
import CourseList from "@/components/public/courses/CourseList";
import CategoryFilter from "@/components/public/quiz/CategoryFilter";
import Pagination from "@/components/common/Pagination";
import { notify } from "@/utils/toast";
import { Category } from "@/types/public/category";
import SearchBar from "@/components/public/quiz/SearchBar";

export default function PublicCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | number>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const data = await getCourses({ is_public: true });
                setCourses(
                    data.filter((course) => course.is_public)
                );
            } catch (error) {
                console.error(error);
                notify.error("Unable to load courses. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const data = await getCategories();
                // Filter only active categories
                const activeCategories = Array.isArray(data)
                    ? data.filter((cat: Category) => cat.is_active !== false)
                    : [];
                setCategories(activeCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesCategory =
                categoryFilter === "all" ||
                course.category?.id === Number(categoryFilter);
            const matchesSearch =
                searchTerm.trim().length === 0 ||
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [courses, categoryFilter, searchTerm]);

    // Pagination logic
    const paginatedCourses = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredCourses.slice(start, end);
    }, [filteredCourses, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [categoryFilter, searchTerm, pageSize]);

    return (
        <div className="bg-slate-50/60 pb-16">
            <section className="bg-gradient-to-br from-blue-50 via-slate-50 to-white py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl space-y-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                            Khám phá khóa học
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Nâng cao kỹ năng với khóa học được tuyển chọn từ các chuyên gia công nghệ
                        </h1>
                        <p className="text-base text-gray-600 sm:text-lg">
                            Khám phá thư viện khóa học được thiết kế để giúp bạn thành thạo
                            các kỹ năng mới, đứng top trong công nghệ và đạt được mục tiêu học tập của bạn theo tốc độ của riêng mình.
                        </p>
                    </div>

                    {/* Category Filter */}
                    {!isLoadingCategories && categories.length > 0 && (
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={categoryFilter}
                            onCategoryChange={(id) => {
                                setCategoryFilter(id);
                                setCurrentPage(1);
                            }}
                        />
                    )}

                    {/* Search Bar */}
                    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-4 w-4 text-gray-400" />
                            <input
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Tìm kiếm khóa học theo tiêu đề hoặc mô tả..."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-3 text-sm text-gray-700 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <CourseList
                        courses={paginatedCourses}
                        isLoading={isLoading}
                        actionLabel="Xem chi tiết"
                        emptyState={{
                            title: "Không có khóa học công khai.",
                            description:
                                "Kiểm tra lại sau hoặc theo dõi các giảng viên yêu thích để cập nhật.",
                        }}
                    />

                    {/* Pagination */}
                    {filteredCourses.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                pageSize={pageSize}
                                totalItems={filteredCourses.length}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={setPageSize}
                                pageSizeOptions={[12, 24, 36]}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

