import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Eye, EyeOff, Loader2, User, Mail, Phone, Lock, HeartHandshake, ArrowRight } from "lucide-react";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultRole = searchParams.get("role") || "donor";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: defaultRole,
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve location.");
        setIsLoading(false);
      }
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (form.password.length < 6) newErrors.password = "Min 6 characters";
    if (!form.latitude || !form.longitude) newErrors.location = "Location required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role,
      location: { type: "Point", coordinates: [Number(form.longitude), Number(form.latitude)] },
    };

    try {
      const res = await axios.post("http://localhost:5000/api/signup", payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* LEFT SIDE - VISUAL HERO */}
      <div className="hidden lg:flex w-1/2 bg-green-900 relative items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-black/60"></div>

        {/* Text Content */}
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-6 bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10">
            <HeartHandshake size={32} className="text-green-300" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Turn Excess into <br/>
            <span className="text-green-400">Impact.</span>
          </h1>
          <p className="text-lg text-green-100 leading-relaxed mb-8">
            Join thousands of restaurants and volunteers in the mission to end hunger. 
            ResQPlate connects surplus food with those who need it most—instantly.
          </p>
          
          <div className="flex gap-4 text-sm font-medium text-green-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div> Real-time tracking
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div> Verified NGOs
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">
              Enter your details to start your journey with ResQPlate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
              {['donor', 'ngo'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2.5 text-sm font-semibold rounded-lg capitalize transition-all duration-200 ${
                    form.role === r
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {r === 'donor' ? '🍛 Donor' : '🤝 NGO'}
                </button>
              ))}
            </div>

            {/* Inputs Group */}
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name / Organization"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                  onChange={handleChange}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                  onChange={handleChange}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="relative group">
                <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create Password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
              </div>
            </div>

            {/* Location Block */}
            <div className={`p-4 rounded-xl border transition-all ${errors.location ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700">Location</span>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                  Auto-Detect
                </button>
              </div>
              <div className="flex gap-3">
                <input
                  readOnly
                  value={form.latitude}
                  placeholder="Latitude"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500"
                />
                <input
                  readOnly
                  value={form.longitude}
                  placeholder="Longitude"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-bold hover:underline hover:text-green-700">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;