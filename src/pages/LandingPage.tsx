import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="h-12 w-12 text-primary" />,
      title: 'Easy Scheduling',
      description: 'Book appointments with just a few clicks',
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: 'Flexible Timing',
      description: 'Choose from various available time slots',
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: 'Expert Doctors',
      description: 'Connect with experienced healthcare professionals',
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: 'Quick Confirmation',
      description: 'Get instant appointment confirmations',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Health, Our Priority
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Book appointments with top healthcare professionals in your area.
          Quick, easy, and secure.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="py-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-6 rounded-lg border bg-card text-center"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}