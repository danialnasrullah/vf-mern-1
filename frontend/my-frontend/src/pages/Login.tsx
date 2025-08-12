import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedCircles from '../components/AnimatedCircles';

// ✅ Zod schema for login (removed name and role fields)
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ✅ Animated Illustration Component (updated text)
const AnimatedIllustration = () => (
  <AnimatedCircles text="Sign In" />
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Login successful!');
        reset();
        // Store token and update auth context
        if (result.token) {
          login(result.token);
        }
        // Redirect to home page
        navigate('/');
      } else {
        if (result.message === 'Invalid credentials') {
          setError('email', { type: 'manual', message: 'Invalid email or password' });
          setError('password', { type: 'manual', message: 'Invalid email or password' });
        } else {
          alert(result.message || 'Login failed');
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

      {/* Right: Login Form */}
      <div className="w-1/2 h-full flex items-center justify-center bg-white px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-5">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-left">Welcome Back</h2>

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full bg-gray-600 text-white py-2 rounded font-semibold hover:bg-gray-700 transition duration-200"
          >
            Create Account
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
