import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/auth-form";
import { Hospital, Stethoscope, Clock, CalendarCheck } from "lucide-react";
import { getRandomQuote } from "@/lib/quotes";
import { useState, useEffect } from "react";

export default function Register() {
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <motion.div 
        className="lg:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to create your account
            </p>
          </div>
          <AuthForm type="register" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-l">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-800" />
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16" />
        
        <motion.div 
          className="relative z-20 flex items-center text-lg font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Hospital className="mr-2 h-6 w-6" /> MedCare
        </motion.div>

        <div className="relative z-20 mt-auto">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <blockquote className="space-y-4">
              <p className="text-xl leading-relaxed">{quote.text}</p>
              <footer className="text-sm opacity-80">— {quote.author}</footer>
            </blockquote>
          </motion.div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-4 rounded-lg bg-white/10 p-4">
              <Stethoscope className="h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Professional Care</h3>
                <p className="text-sm opacity-80">Access to qualified healthcare professionals</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg bg-white/10 p-4">
              <Clock className="h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-medium">24/7 Availability</h3>
                <p className="text-sm opacity-80">Book appointments at your convenience</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg bg-white/10 p-4">
              <CalendarCheck className="h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Easy Scheduling</h3>
                <p className="text-sm opacity-80">Manage your appointments effortlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}