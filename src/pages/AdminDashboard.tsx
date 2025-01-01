import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Activity, Calendar } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DoctorRegistrationForm } from "@/components/admin/doctor-registration-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doctor } from "@/types";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctor/get/doctors");
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const stats = [
    {
      title: "Total Doctors",
      value: doctors.length,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "New Registrations",
      value: "5",
      icon: <UserPlus className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Active Sessions",
      value: "12",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Appointments",
      value: "48",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage doctors and monitor system activity
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Register New Doctor</CardTitle>
            <CardDescription>
              Add a new doctor to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorRegistrationForm onSuccess={fetchDoctors} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered Doctors</CardTitle>
            <CardDescription>
              List of all registered doctors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading doctors...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor._id}>
                      <TableCell>Dr. {doctor.name}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.yearsOfExperience} years</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}