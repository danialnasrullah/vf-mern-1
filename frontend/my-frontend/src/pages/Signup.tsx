import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import AnimatedCircles from '../components/AnimatedCircles';

// ✅ Zod schema
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'teacher']),
});

type SignupFormData = z.infer<typeof signupSchema>;
const AnimatedIllustration = () => (
  <AnimatedCircles text="Sign Up" />
);

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Signup successful!');
        reset();
      } else {
        if (result.message === 'Email already exists') {
          setError('email', { type: 'manual', message: 'Email is already registered' });
        } else {
          alert(result.message || 'Signup failed');
        }
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Left: Animation */}
      <div className="w-1/2 h-full">
        <AnimatedIllustration />
      </div>

      {/* Right: Signup Form */}
      <div className="w-1/2 h-full flex items-center justify-center bg-white px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-5">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-left">Create Your Account</h2>

          <div>
            <input
              type="text"
              placeholder="Name"
              {...register('name')}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email')}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <select
              {...register('role')}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-red-600 text-gray-300 py-2 rounded font-semibold hover:bg-gray-400 transition duration-200"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Signup;
