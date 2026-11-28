import type { MetadataRoute } from "next";
import { getCourses } from "@/features/courses/api/getCourses";
import { getInstructors } from "@/features/instructors/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://futurehouse.academy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/instructors`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const courses = await getCourses();
    for (const course of courses) {
      dynamicRoutes.push({
        url: `${SITE_URL}/courses/${course.id}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Fallback gracefully if backend is unreachable during build
  }

  try {
    const instructors = await getInstructors();
    for (const instructor of instructors) {
      dynamicRoutes.push({
        url: `${SITE_URL}/instructors/${instructor.id}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Fallback gracefully if backend is unreachable during build
  }

  return [...staticRoutes, ...dynamicRoutes];
}
