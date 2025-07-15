// src/lib/types/category.ts
export interface Category {
  id: string | number;
  name: string;
}
export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | number;
  onCategoryChange: (category: string | number) => void;
}