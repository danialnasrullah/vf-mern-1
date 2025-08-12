import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../contexts/AuthContext';

interface Bootcamp {
  _id: string;
  name: string;
  description: string;
  location: string;
  website: string;
}

const Bootcamps = () => {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', location: '', website: '' });
  const { role, token } = useAuth();

  const loadBootcamps = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/bootcamps')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch bootcamps');
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data ?? [];
        setBootcamps(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBootcamps();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/bootcamps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create bootcamp');
      }
      setShowForm(false);
      setForm({ name: '', description: '', location: '', website: '' });
      loadBootcamps();
      alert('Bootcamp created');
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <div>Loading bootcamps...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageContainer>
      <h2 className='text-4xl font-bold text-center text-blue-600 mb-8 animate-bounce'>
        Bootcamps
      </h2>

      {role === 'teacher' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg hover:bg-blue-700"
            title="Add Bootcamp"
          >
            +
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-semibold">Add Bootcamp</h3>
            <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            <textarea className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {bootcamps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No bootcamps found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bootcamps.map((bootcamp) => (
            <div key={bootcamp._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white truncate">
                  {bootcamp.name}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3">{bootcamp.description}</p>
                <div className="flex items-center mb-3">
                  <span className="text-gray-700 font-medium">{bootcamp.location}</span>
                </div>
                <div className="flex items-center">
                  <a href={bootcamp.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium truncate transition-colors duration-200">
                    Visit Website
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex flex-col gap-2">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
                  Learn More
                </button>
                <Link to={`/bootcamps/${bootcamp._id}/courses`} className="w-full block bg-purple-600 text-white py-2 px-4 rounded-md text-center font-medium hover:bg-purple-700 transition-colors duration-200">
                  View Courses
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Bootcamps;
