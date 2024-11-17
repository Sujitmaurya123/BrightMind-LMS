import { courseCategories } from "@/config";
import banner from "../../../../public/learning2.jpg";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning That Drives You Forward</h1>
          <p className="text-xl">
            Empower Your Future with the Right Skills. Start Your Journey with Us Today!
          </p>
        </div>
            <div className="lg:w-full mb-8 lg:mb-0 flex justify-center">
              <img
                src={banner}
                alt="banner"
                className="w-full max-w-[750px] h-auto rounded-lg shadow-lg object-cover"
                loading="lazy"
              />
            </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
     <section className="py-12 px-4 lg:px-8">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
    Featured Courses
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
      studentViewCoursesList.map((courseItem) => (
        <div
          key={courseItem?._id}
          onClick={() => handleCourseNavigate(courseItem?._id)}
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <img
            src={courseItem?.image}
            alt={courseItem?.title || "Course Image"}
            width={300}
            height={150}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className="font-bold mb-2 text-lg text-gray-800">
              {courseItem?.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {courseItem?.instructorName}
            </p>
            <p className="font-bold text-lg text-gray-900">
              ₹{courseItem?.pricing}
            </p>
          </div>
        </div>
      ))
    ) : (
      <h1 className="text-xl font-semibold text-gray-700 col-span-full text-center">
        No Courses Found
      </h1>
    )}
  </div>
</section>

    </div>
  );
}

export default StudentHomePage;
