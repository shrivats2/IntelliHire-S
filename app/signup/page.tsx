// @ts-nocheck
"use client";
import { useState } from "react";
import axios from "axios";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import itLocale from "i18n-iso-countries/langs/it.json";
import validationSchema from "./_components/validationSchema";
import {
  AtSign,
  Building,
  Building2,
  CircleUser,
  Eye,
  EyeOff,
  LoaderIcon,
  MapPin,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    is_premium: true,
    email: "",
    company_name: "",
    mob_no: "",
    password1: "",
    password2: "",
    country: "",
    city: "",
    role: "",
    company_desc: "",
  });

  const [error, setError] = useState({});
  const [servererror, setServerError] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectCountryHandler = (value) => {
    setSelectedCountry(value);
    setData({
      ...data,
      country: value,
    });
  };

  countries.registerLocale(enLocale);
  countries.registerLocale(itLocale);

  const countryObj = countries.getNames("en", { select: "official" });

  const countryArr = Object.entries(countryObj).map(([key, value]) => ({
    label: `${value} (${key})`,
    value: key,
  }));

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedData = validationSchema.safeParse(data);

      if (!validatedData.success) {
        setError(validatedData.error.formErrors.fieldErrors);
        return;
      }
      setLoading(true);

      const location = `${data.city}, ${data.country}`;
      const modifiedData = { ...data, location };
      delete modifiedData.city;
      delete modifiedData.country;

      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        modifiedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      router.push("/login");
    } catch (error) {
      if (error.name === "ValidationError") {
        if (error.inner) {
          const updatedErrors = {};
          error.inner.forEach((error) => {
            const errorMessage = error.errors[0];
            updatedErrors[error.path] = errorMessage;
          });
          setError(updatedErrors);
        } else {
          console.error(error.validationError);
        }
      }

      if (error.response) {
        const errorMessage =
          error.response.data.detail || "An error occurred during signup.";
        setServerError(errorMessage);
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRole = (e) => {
    setRole(e);
    setData({ ...data, role: e });
    setError("");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Create Account</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex justify-center gap-4 mb-8">
          <div className="relative">
            <button
              type="button"
              className={`inline-flex items-center border rounded-full p-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${
                role === "employer"
                  ? "bg-green-400 "
                  : "bg-transparent text-primary-400 hover:bg-primary-400"
              }`}
              onClick={() => handleRole("employer")}
            >
              <Building2 className="mr-2" />
              Recruiter
            </button>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Recruiter
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              className={`inline-flex p-2 items-center border rounded-full  text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${
                role === "applicant"
                  ? "bg-green-400 "
                  : "bg-transparent text-primary-400 hover:bg-primary-400"
              }`}
              onClick={() => handleRole("applicant")}
            >
              <CircleUser className="mr-2" />
              Applicant
            </button>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Applicant
            </div>
          </div>
        </div>
        {error?.role && (
          <p className="text-red-500 flex justify-center">{error?.role}</p>
        )}
        <div className="flex gap-3 flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block  mb-2">
                Full Name *
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <CircleUser className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400" />
              </div>
              {error?.name && <p className="text-red-500">{error?.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                Email *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400" />
              </div>
              {error?.email && <p className="text-red-500">{error?.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block  mb-2">
                Select Country *
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => selectCountryHandler(e.target.value)}
                placeholder="Select a country"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">Select a country</option>
                {countryArr.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {error?.country && (
                <p className="text-red-500">{error?.country}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block mb-2">
                City *
              </label>
              <div className="relative">
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={data.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400" />
              </div>
              {error?.city && <p className="text-red-500">{error?.city}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password1" className="block mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password1"
                  type={showPassword ? "text" : "password"}
                  name="password1"
                  value={data.password1}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {error?.password1 && (
                <p className="text-red-500">{error?.password1}</p>
              )}
            </div>
            <div>
              <label htmlFor="password2" className="block mb-2">
                Re-enter Password *
              </label>
              <div className="relative">
                <input
                  id="password2"
                  type="password"
                  name="password2"
                  value={data.password2}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400" />
              </div>
              {error?.password2 && (
                <p className="text-red-500">{error?.password2}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mob_no" className="block mb-2">
                Phone No. *
              </label>
              <div className="relative">
                <input
                  id="mob_no"
                  type="tel"
                  name="mob_no"
                  value={data.mob_no}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400" />
              </div>
              {error?.mob_no && <p className="text-red-500">{error?.mob_no}</p>}
            </div>
            {role === "employer" && (
              <div>
                <label htmlFor="company_name" className="block  mb-2">
                  Organisation *
                </label>
                <div className="relative">
                  <input
                    id="company_name"
                    type="text"
                    name="company_name"
                    value={data.company_name}
                    onChange={handleChange}
                    placeholder="Enter your organisation name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                  <Building className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400" />
                </div>
                {error?.company_name && (
                  <p className="text-red-500">{error?.company_name}</p>
                )}
              </div>
            )}
          </div>
          {role === "employer" && (
            <div className="mb-4">
              <label htmlFor="company_desc" className="block mb-2">
                Organisation detail *
              </label>
              <textarea
                id="company_desc"
                name="company_desc"
                value={data.company_desc}
                onChange={handleChange}
                placeholder="Enter your organisation details"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                rows={4}
              />
            </div>
          )}
          {servererror && <p className="text-red-500">{servererror}</p>}
        </div>

        {loading ? (
          <LoaderIcon size={30} className="text-primary-400 mx-auto my-4" />
        ) : (
          <Button
            type="submit"
            className="w-full mt-4 bg-primary-400 text-white py-2 rounded-md hover:bg-primary-500 transition-colors"
          >
            Sign Up
          </Button>
        )}
      </form>
    </div>
  );
};
export default Signup;
