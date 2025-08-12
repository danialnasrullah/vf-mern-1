import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  bootcamp: string; // bootcamp id
}

interface Bootcamp { _id: string; name: string; }

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', duration: '', difficulty: 'Beginner', bootcamp: '' });
  const { role, token } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const bootRes = await fetch('http://localhost:3000/api/bootcamps');
      const bootJson = await bootRes.json();
      const boots = Array.isArray(bootJson) ? bootJson : bootJson.data ?? [];
      setBootcamps(boots);

      const allCourses: Course[] = [];
      for (const b of boots) {
        const res = await fetch(`http://localhost:3000/api/bootcamps/${b._id}/courses`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) allCourses.push(...data.data);
        }
      }
      setCourses(allCourses);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create course');
      }
      setShowForm(false);
      setForm({ title: '', description: '', duration: '', difficulty: 'Beginner', bootcamp: '' });
      await loadData();
      alert('Course created');
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageContainer>
      <h2 className='text-4xl font-bold text-center text-blue-600 mb-8 animate-bounce'>Courses</h2>

      {role === 'teacher' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg hover:bg-purple-700"
            title="Add Course"
          >
            +
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-semibold">Add Course</h3>
            <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <select className="w-full border p-2 rounded" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <select className="w-full border p-2 rounded" value={form.bootcamp} onChange={(e) => setForm({ ...form, bootcamp: e.target.value })}>
              <option value="">Select Bootcamp</option>
              {bootcamps.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-purple-600 text-white" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No courses found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
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
                <Link to={`/bootcamps/${course.bootcamp}/courses`} className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium underline">
                  View all courses for this bootcamp
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Courses;
