import { describe, it, expect, expectTypeOf } from "vite-plus/test";
import type { paths, components } from "../api.generated";
import type { AdminStats, Course, Lesson, Question, Section, Task, User } from "../index";

type AssertTrue<T extends true> = T;
type IsAssignable<TSub, TSuper> = [TSub] extends [TSuper] ? true : false;
type IsEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

describe("Full-Stack Contract Alignment & Schema Audit", () => {
  describe("Domain 1: User / UserAdminResource & UserResource", () => {
    it("verifies User aligns with UserResource and UserAdminResource", () => {
      type ServerUser = components["schemas"]["UserResource"];
      type ServerAdminUser = components["schemas"]["UserAdminResource"];

      // UserResource shares core identity types with User
      type _UserIdEq = AssertTrue<IsEqual<ServerUser["id"], User["id"]>>;
      type _UserNameEq = AssertTrue<IsEqual<ServerUser["name"], User["name"]>>;
      type _UserEmailEq = AssertTrue<IsEqual<ServerUser["email"], User["email"]>>;
      type _UserRoleAssignable = AssertTrue<IsAssignable<User["role"], ServerUser["role"]>>;

      // UserAdminResource shares string identity fields; id is stringified in OpenAPI
      type _AdminNameEq = AssertTrue<IsEqual<ServerAdminUser["name"], User["name"]>>;
      type _AdminEmailEq = AssertTrue<IsEqual<ServerAdminUser["email"], User["email"]>>;
      type _AdminRoleAssignable = AssertTrue<IsAssignable<User["role"], ServerAdminUser["role"]>>;
      type _AdminIdDivergence = AssertTrue<IsEqual<ServerAdminUser["id"], string>>;

      expectTypeOf<ServerUser["id"]>().toEqualTypeOf<number>();
      expectTypeOf<ServerAdminUser["id"]>().toEqualTypeOf<string>();
      expectTypeOf<User["role"]>().toExtend<ServerAdminUser["role"]>();

      const mockUser: User = {
        id: 1,
        name: "Ahmad Developer",
        email: "ahmad@futurehouse.academy",
        role: "instructor",
      };

      const mockAdminUser: ServerAdminUser = {
        id: "1",
        name: "Ahmad Developer",
        email: "ahmad@futurehouse.academy",
        role: "instructor",
        is_active: "1",
        enrollments_count: "3",
        created_at: "2026-01-01T00:00:00Z",
      };

      expect(mockUser.id).toBe(Number(mockAdminUser.id));
      expect(mockUser.email).toBe(mockAdminUser.email);
      expect(["admin", "student", "instructor"]).toContain(mockUser.role);
    });
  });

  describe("Domain 2: Course / CourseDetailResource / CourseAdminResource", () => {
    it("verifies Course shares core fields and documents boundary divergences", () => {
      type ServerCourseDetail = components["schemas"]["CourseDetailResource"];
      type ServerCourseAdmin = components["schemas"]["CourseAdminResource"];

      // Shared string fields
      type _DetailTitleEq = AssertTrue<IsEqual<ServerCourseDetail["title"], Course["title"]>>;
      type _DetailDescEq = AssertTrue<
        IsEqual<ServerCourseDetail["description"], Course["description"]>
      >;
      type _AdminTitleEq = AssertTrue<IsEqual<ServerCourseAdmin["title"], Course["title"]>>;
      type _AdminDescEq = AssertTrue<
        IsEqual<ServerCourseAdmin["description"], Course["description"]>
      >;

      // Narrower frontend unions are assignable to backend string fields
      type _LevelAssignable = AssertTrue<
        IsAssignable<Course["level"], ServerCourseDetail["level"]>
      >;
      type _StatusAssignable = AssertTrue<
        IsAssignable<Course["status"], ServerCourseDetail["status"]>
      >;

      // Array/string fields on frontend are assignable to union on backend
      type _LearnAssignable = AssertTrue<
        IsAssignable<Course["what_you_learn"], ServerCourseDetail["what_you_learn"]>
      >;
      type _ReqAssignable = AssertTrue<
        IsAssignable<Course["requirements"], ServerCourseDetail["requirements"]>
      >;
      type _AudienceAssignable = AssertTrue<
        IsAssignable<Course["target_audience"], ServerCourseDetail["target_audience"]>
      >;

      // Boundary divergence: Scramble exports numeric/boolean CourseResource fields as strings
      type _DetailIdString = AssertTrue<IsEqual<ServerCourseDetail["id"], string>>;
      type _AdminIdString = AssertTrue<IsEqual<ServerCourseAdmin["id"], string>>;

      expectTypeOf<ServerCourseDetail["title"]>().toEqualTypeOf<Course["title"]>();
      expectTypeOf<ServerCourseAdmin["title"]>().toEqualTypeOf<Course["title"]>();
      expectTypeOf<Course["level"]>().toExtend<ServerCourseDetail["level"]>();
      expectTypeOf<Course["status"]>().toExtend<ServerCourseAdmin["status"]>();

      const mockCourseDetail: ServerCourseDetail = {
        id: "10",
        title: "Full-Stack Architecture",
        description: "End-to-end typed contracts",
        cover_image: "https://example.com/cover.png",
        level: "intermediate",
        status: "published",
        total_duration: "3600",
        what_you_learn: ["Type safety", "Boundary adapters"],
        requirements: ["TypeScript basics"],
        target_audience: ["Frontend engineers"],
        students_count: "42",
        instructor_name: "Ahmad",
        rating: "4.9",
        is_popular: "1",
        price: "0",
        is_public: "1",
        instructor_id: "1",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        sections: [],
      };

      expect(mockCourseDetail.id).toBe("10");
      expect(mockCourseDetail.sections).toEqual([]);
    });
  });

  describe("Domain 3: Lesson / LessonResource", () => {
    it("validates LessonResource core properties match Lesson contract", () => {
      type ServerLesson = components["schemas"]["LessonResource"];

      type _HasId = AssertTrue<IsEqual<ServerLesson["id"], Lesson["id"]>>;
      type _HasTitle = AssertTrue<IsEqual<ServerLesson["title"], Lesson["title"]>>;
      type _HasDuration = AssertTrue<IsEqual<ServerLesson["duration"], Lesson["duration"]>>;
      type _HasOrder = AssertTrue<IsEqual<ServerLesson["order"], Lesson["order"]>>;
      type _HasPreview = AssertTrue<IsEqual<ServerLesson["is_preview"], Lesson["is_preview"]>>;
      type _HasPublished = AssertTrue<
        IsEqual<ServerLesson["is_published"], Lesson["is_published"]>
      >;
      type _DescAssignable = AssertTrue<
        IsAssignable<ServerLesson["description"], Lesson["description"]>
      >;
      type _ProviderAssignable = AssertTrue<
        IsAssignable<Lesson["video_provider"], ServerLesson["video_provider"]>
      >;

      expectTypeOf<ServerLesson["id"]>().toEqualTypeOf<Lesson["id"]>();
      expectTypeOf<ServerLesson["title"]>().toEqualTypeOf<Lesson["title"]>();
      expectTypeOf<ServerLesson["duration"]>().toEqualTypeOf<Lesson["duration"]>();
      expectTypeOf<ServerLesson["order"]>().toEqualTypeOf<Lesson["order"]>();
      expectTypeOf<ServerLesson["is_preview"]>().toEqualTypeOf<Lesson["is_preview"]>();
      expectTypeOf<ServerLesson["is_published"]>().toEqualTypeOf<Lesson["is_published"]>();

      const mockServerLesson: ServerLesson = {
        id: 101,
        section_id: 5,
        title: "Introduction to Event Sourcing",
        description: "Core architectural patterns",
        video_id: "dQw4w9WgXcQ",
        video_provider: "youtube",
        playback: "youtube",
        duration: 420,
        order: 1,
        is_preview: true,
        is_published: true,
      };

      expect(mockServerLesson.id).toBe(101);
      expect(mockServerLesson.section_id).toBe(5);
      expect(mockServerLesson.is_published).toBe(true);
    });
  });

  describe("Domain 4: Section / SectionResource", () => {
    it("validates SectionResource schema compatibility with Section", () => {
      type ServerSection = components["schemas"]["SectionResource"];

      type _IdEq = AssertTrue<IsEqual<ServerSection["id"], Section["id"]>>;
      type _TitleEq = AssertTrue<IsEqual<ServerSection["title"], Section["title"]>>;
      type _OrderEq = AssertTrue<IsEqual<ServerSection["order"], Section["order"]>>;
      type _CourseIdNumber = AssertTrue<IsEqual<ServerSection["course_id"], number>>;

      expectTypeOf<ServerSection["id"]>().toEqualTypeOf<Section["id"]>();
      expectTypeOf<ServerSection["title"]>().toEqualTypeOf<Section["title"]>();
      expectTypeOf<ServerSection["order"]>().toEqualTypeOf<Section["order"]>();

      const mockSection: ServerSection = {
        id: 1,
        course_id: 10,
        title: "Module 1: Foundations",
        order: 1,
        lessons: [],
      };

      expect(mockSection.id).toBe(1);
      expect(mockSection.title).toBe("Module 1: Foundations");
      expect(mockSection.lessons).toEqual([]);
    });
  });

  describe("Domain 5: Task / TaskResource & TaskQuestion", () => {
    it("validates TaskResource and Question contract alignment", () => {
      type ServerTask = components["schemas"]["TaskResource"];

      type _IdEq = AssertTrue<IsEqual<ServerTask["id"], Task["id"]>>;
      type _PassPctEq = AssertTrue<IsEqual<ServerTask["pass_percentage"], Task["pass_percentage"]>>;
      type _MaxAttemptsEq = AssertTrue<IsEqual<ServerTask["max_attempts"], Task["max_attempts"]>>;
      type _QuestionsAssignable = AssertTrue<
        IsAssignable<Task["questions"], ServerTask["questions"]>
      >;
      type _QuestionTypeUnion = AssertTrue<
        IsEqual<Question["type"], "mcq" | "true_false" | "open">
      >;

      expectTypeOf<ServerTask["id"]>().toEqualTypeOf<Task["id"]>();
      expectTypeOf<ServerTask["pass_percentage"]>().toEqualTypeOf<Task["pass_percentage"]>();
      expectTypeOf<ServerTask["max_attempts"]>().toEqualTypeOf<Task["max_attempts"]>();
      expectTypeOf<Task["questions"]>().toExtend<ServerTask["questions"]>();

      const mockQuestion: Question = {
        id: "q-1",
        type: "mcq",
        text: "Which pattern isolates backend schema drift?",
        options: ["Boundary Adapter", "Global Any"],
      };

      const mockServerTask: ServerTask = {
        id: 7,
        lesson_id: 101,
        questions: [mockQuestion],
        pass_percentage: 70,
        max_attempts: 3,
      };

      expect(mockServerTask.id).toBe(7);
      expect(mockServerTask.questions).toHaveLength(1);
      expect(mockServerTask.pass_percentage).toBe(70);
    });
  });

  describe("Domain 6: AdminStats / /admin/stats response", () => {
    it("documents field mapping between backend snake_case and frontend camelCase", () => {
      type ServerStats =
        paths["/admin/stats"]["get"]["responses"][200]["content"]["application/json"];

      type _StudentsNum = AssertTrue<
        IsEqual<ServerStats["total_students"], AdminStats["totalStudents"]>
      >;
      type _CoursesNum = AssertTrue<
        IsEqual<ServerStats["total_courses"], AdminStats["totalCourses"]>
      >;
      type _InstructorsNum = AssertTrue<
        IsEqual<ServerStats["total_instructors"], AdminStats["totalInstructors"]>
      >;
      type _EnrollmentsNum = AssertTrue<
        IsEqual<ServerStats["total_enrollments"], AdminStats["pendingEnrollments"]>
      >;

      expectTypeOf<ServerStats["total_students"]>().toEqualTypeOf<AdminStats["totalStudents"]>();
      expectTypeOf<ServerStats["total_courses"]>().toEqualTypeOf<AdminStats["totalCourses"]>();
      expectTypeOf<ServerStats["total_instructors"]>().toEqualTypeOf<
        AdminStats["totalInstructors"]
      >();
      expectTypeOf<ServerStats["total_enrollments"]>().toEqualTypeOf<
        AdminStats["pendingEnrollments"]
      >();

      const rawServerPayload: ServerStats = {
        total_students: 150,
        total_courses: 12,
        total_enrollments: 450,
        total_instructors: 5,
      };

      const adaptAdminStats = (raw: ServerStats): AdminStats => ({
        totalStudents: raw.total_students,
        totalCourses: raw.total_courses,
        totalInstructors: raw.total_instructors,
        pendingEnrollments: raw.total_enrollments,
      });

      const adapted = adaptAdminStats(rawServerPayload);
      expect(adapted.totalStudents).toBe(150);
      expect(adapted.totalCourses).toBe(12);
      expect(adapted.totalInstructors).toBe(5);
      expect(adapted.pendingEnrollments).toBe(450);
    });
  });
});
