"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    stats: false,
    quizzes: false,
    groups: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Check which sections are visible
      const statsSection = document.getElementById("stats-section");
      const quizzesSection = document.getElementById("quizzes-section");
      const groupsSection = document.getElementById("groups-section");
      const ctaSection = document.getElementById("cta-section");

      setVisibleSections({
        hero: window.scrollY < 300,
        stats: statsSection ? window.scrollY + window.innerHeight > statsSection.offsetTop + 100 : false,
        quizzes: quizzesSection ? window.scrollY + window.innerHeight > quizzesSection.offsetTop + 100 : false,
        groups: groupsSection ? window.scrollY + window.innerHeight > groupsSection.offsetTop + 100 : false,
        cta: ctaSection ? window.scrollY + window.innerHeight > ctaSection.offsetTop + 100 : false
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          className="text-center"
          initial="hidden"
          animate={visibleSections.hero ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6 leading-tight"
            variants={itemVariants}
          >
            Học thông minh,
            <br />
            <span className="text-blue-600">Học tốt hơn</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Tham gia hàng ngàn học sinh trong nền tảng học tập tương tác của chúng tôi.
            Thành thạo kỹ năng mới với bài kiểm tra thú vị và nhóm học tập đồng đội.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Link
              href="/quiz"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Bắt đầu miễn phí
            </Link>
            <button className="bg-white text-blue-600 border-2 border-blue-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Xem demo
            </button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          id="stats-section"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center"
          initial="hidden"
          animate={visibleSections.stats ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
            <div className="text-gray-600">Học sinh hoạt động</div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">1,200+</div>
            <div className="text-gray-600">Nhóm học tập</div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">Tỷ lệ thành công</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Top Quizzes Section */}
      <section id="quizzes-section" className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={visibleSections.quizzes ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h2 className="text-4xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              Bài kiểm tra phổ biến
            </motion.h2>
            <motion.p className="text-xl text-gray-700" variants={itemVariants}>
              Kiểm tra kiến thức của bạn với bài kiểm tra thú vị nhất của chúng tôi
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate={visibleSections.quizzes ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {/* Quiz Card 1 */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                JavaScript Fundamentals
              </h3>
              <p className="text-gray-600 mb-4">
                Thành thạo các kiến thức cơ bản của JavaScript programming
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">25 câu hỏi</span>
                <Link
                  href="/quiz"
                  className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
                >
                  Bắt đầu bài kiểm tra
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Quiz Card 2 */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cấu trúc dữ liệu
              </h3>
              <p className="text-gray-600 mb-4">
                Hiểu về mảng, đối tượng và thuật toán
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">30 câu hỏi</span>
                <Link
                  href="/quiz"
                  className="text-green-600 font-medium hover:text-green-700 flex items-center"
                >
                  Bắt đầu bài kiểm tra
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Quiz Card 3 */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                React Fundamentals
              </h3>
              <p className="text-gray-600 mb-4">
                Components, hooks, and state management
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">20 câu hỏi</span>
                <Link
                  href="/quiz"
                  className="text-purple-600 font-medium hover:text-purple-700 flex items-center"
                >
                  Bắt đầu bài kiểm tra
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            animate={visibleSections.quizzes ? "visible" : "hidden"}
            variants={itemVariants}
          >
            <Link
              href="/quiz"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Xem tất cả bài kiểm tra
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Group Study Section */}
      <section id="groups-section" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            initial="hidden"
            animate={visibleSections.groups ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Học cùng nhau,
                <br />
                <span className="text-blue-600">Đạt được nhiều hơn</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Tham gia nhóm học với các bạn học sinh khác, chia sẻ kiến thức và
                giải quyết các chủ đề khó khăn cùng nhau. Học tập đồng đội đã
                bao giờ cũng dễ dàng hơn.
              </p>

              <div className="space-y-4 mb-8">
                <motion.div variants={itemVariants} className="flex items-center bg-blue-50 p-4 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Công cụ hợp tác thời gian thực
                  </span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center bg-purple-50 p-4 rounded-xl">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Lịch học nhóm
                  </span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center bg-green-50 p-4 rounded-xl">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Chia sẻ ghi chép và tài nguyên
                  </span>
                </motion.div>
              </div>

              <Link
                href="/groups"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
              >
                Tìm nhóm học
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-2"></div>
                    <div>
                      <div className="font-semibold text-sm">
                        Nhóm học Toán
                      </div>
                      <div className="text-xs text-gray-500">5 thành viên</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
                    Đang học: Giải tích
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-2"></div>
                    <div>
                      <div className="font-semibold text-sm">
                        Nhóm học React
                      </div>
                      <div className="text-xs text-gray-500">8 thành viên</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-green-50 p-2 rounded-lg">
                    Đang học: Hooks
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-2"></div>
                    <div>
                      <div className="font-semibold text-sm">
                        Nhóm học Cơ sở dữ liệu
                      </div>
                      <div className="text-xs text-gray-500">12 thành viên</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-purple-50 p-2 rounded-lg">
                    Đang học: Thuật toán
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mr-2"></div>
                    <div>
                      <div className="font-semibold text-sm">
                        Nhóm học Thiết kế mẫu
                      </div>
                      <div className="text-xs text-gray-500">6 thành viên</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-red-50 p-2 rounded-lg">
                    Đang học: Observer
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta-section" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate={visibleSections.cta ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h2 className="text-4xl font-bold mb-6" variants={itemVariants}>
              Sẵn sàng chuyển đổi cách học của bạn?
            </motion.h2>
            <motion.p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" variants={itemVariants}>
              Tham gia cộng đồng học sinh của chúng tôi và bắt đầu hành trình đạt được sự hoàn hảo trong học tập ngay hôm nay.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link
                href="/account"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Đăng ký ngay
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                Tìm hiểu thêm
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}