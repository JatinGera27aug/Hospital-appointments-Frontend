import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/auth-form";
import { Hospital, Heart, Shield, UserPlus } from "lucide-react";
import { getRandomQuote } from "@/lib/quotes";
import { useState, useEffect } from "react";

export default function Login() {
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800" />
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

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center space-y-2 rounded-lg bg-white/10 p-4">
              <Heart className="h-6 w-6" />
              <span className="text-sm text-center">Expert Care</span>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg bg-white/10 p-4">
              <Shield className="h-6 w-6" />
              <span className="text-sm text-center">Secure Platform</span>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg bg-white/10 p-4">
              <UserPlus className="h-6 w-6" />
              <span className="text-sm text-center">Easy Booking</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        className="lg:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
          </div>
          <AuthForm type="login" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="underline underline-offset-4 hover:text-primary">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}