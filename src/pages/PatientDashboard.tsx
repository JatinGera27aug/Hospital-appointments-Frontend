import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, XCircle, CalendarCheck } from "lucide-react";
// import { StatsCard } from "@/components/dashboard/stats-card";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Appointment } from "@/types";
import api from "@/lib/axios";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointment/patient/676ba5c51d5071ac799feff2");
      console.log("Fetched appointments data:", data);
      if (Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        console.error("Unexpected data format:", data);
        setAppointments([]);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    let filtered: Appointment[];

    if (type === "all") {
      filtered = appointments;
    } else {
      filtered = appointments.filter(a => a.status === type.toLowerCase());
    }

    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    if (appointments.length > 0) {
      setFilteredAppointments(appointments);
    }
  }, [appointments]);

  const filterAndSortAppointments = (appointments: Appointment[]) => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 5); // Include the past 5 days

    // Remove duplicates based on unique identifier (e.g., `id`)
    const uniqueAppointments = Array.from(
      new Map(appointments.map((a) => [a._id, a])).values()
    );

    // Filter appointments within the date range and sort in descending order
    return uniqueAppointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= today;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      filterType: "all"
    },
    {
      title: "Confirmed",
      value: appointments.filter((a) => a.status === "confirmed").length,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      filterType: "confirmed"
    },
    {
      title: "Completed",
      value: appointments.filter((a) => a.status === "completed").length,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      filterType: "completed"
    },
    {
      title: "Cancelled",
      value: appointments.filter((a) => a.status === "cancelled").length,
      icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
      filterType: "cancelled"
    },
    {
      title: "Missed",
      value: appointments.filter((a) => a.status === "missed").length,
      icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
      filterType: "missed"
    },
    {
      title: "Rescheduled",
      value: appointments.filter((a) => a.status === "rescheduled").length,
      icon: <CalendarCheck className="h-4 w-4 text-muted-foreground" />,
      filterType: "rescheduled"
    },
  ];

  const recentAppointments = filterAndSortAppointments(appointments);

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your appointments and health records
          </p>
        </div>
        <Link to="/patient/book-appointment">
          <Button>Book Appointment</Button>
        </Link>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <button
            key={stat.title}
            onClick={() => handleFilterChange(stat.filterType)}
            className={`flex flex-col items-center p-4 border rounded-md transition-colors ${
              filterType === stat.filterType ? 'bg-blue-200' : 'hover:bg-blue-400'
            }`}
          >
            {stat.icon}
            <span className="mt-2 text-sm font-semibold">{stat.title}</span>
            <span className="text-lg">{stat.value}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilterType(null)}
          className={`p-2 border rounded-md transition-colors hover:bg-blue-200 ${
            filterType === null ? 'bg-blue-400' : ''
          }`}
        >
          Recent Appointments
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            {filterType === null
              ? "Recent Appointments"
              : filterType === "all"
              ? "All Appointments"
              : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Appointments`}
          </h3>
          {loading ? (
            <p>Loading appointments...</p>
          ) : (
            <>
              {(filterType ? filteredAppointments : recentAppointments).length > 0 ? (
                <AppointmentList
                  appointments={filterType ? filteredAppointments : recentAppointments}
                  type="patient"
                  onStatusChange={fetchAppointments}
                />
              ) : (
                <p>No appointments found.</p>
              )}
            </>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/patient/book-appointment" className="block">
              <Button className="w-full">Book New Appointment</Button>
            </Link>
            {/* Add more quick actions as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
