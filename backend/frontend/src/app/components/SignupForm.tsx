// src/app/components/SignupForm.tsx
interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-[#1a24d2] mb-6">Sign Up</h2>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Full Name" className="p-2 border rounded" />
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <input type="password" placeholder="Password" className="p-2 border rounded" />
        <button type="submit" className="bg-[#1a24d2] text-white py-2 rounded hover:bg-[#002266] transition-colors">
          Sign Up
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-[#1a24d2] font-medium hover:underline">
          Log In
        </button>
      </p>
    </div>
  );
}
