import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
}

const BootcampCourses = () => {
  const { bootcampId } = useParams<{ bootcampId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bootcampId) return;
    fetch(`http://localhost:3000/api/bootcamps/${bootcampId}/courses`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch courses for this bootcamp');
        return res.json();
      })
      .then((data) => {
        setCourses(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [bootcampId]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageContainer>
      <h2 className='text-3xl font-bold text-center text-purple-600 mb-8 animate-bounce'>Courses for this Bootcamp</h2>
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No courses found for this bootcamp.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white truncate">{course.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                <div className="flex items-center mb-2">
                  <span className="text-gray-700 font-medium mr-2">Duration:</span>
                  <span className="text-gray-500">{course.duration}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-700 font-medium mr-2">Difficulty:</span>
                  <span className="text-gray-500">{course.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default BootcampCourses;