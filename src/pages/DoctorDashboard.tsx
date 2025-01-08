import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, XCircle, CalendarCheck } from "lucide-react";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { Appointment } from "@/types";
import api from "@/lib/axios";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filterType, setFilterType] = useState<string | null>("upcoming"); // Default to upcoming

  // Fetch Appointments
  // Inside your component
  const fetchAppointments = useCallback(async () => {
    try {
      const { data } = await api.get("/appointment/doctor/6772a794ea5756025c76d6fd");
      setAppointments(data.appointments);
      if (filterType === "upcoming") {
        setFilteredAppointments(data.appointments.filter((a: Appointment) => new Date(a.date) >= new Date()));
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  const handleFilterChange = (type: string) => {
    setFilterType(type);
    let filtered: Appointment[];

    if (type === "today") {
      filtered = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString());
    } else if (type === "upcoming") {
      filtered = appointments.filter(
        (a) =>
          new Date(a.date) >= new Date() 
      //   && 
      //     ["pending", "confirmed", "ongoing"].includes(a.status) && // Include only specific statuses
      // a.status !== "cancelled"
      );
    
    } else {
      filtered = appointments.filter(a => a.status === type); // Filter by status
    }

    setFilteredAppointments(filtered);
  };

  const handleShowUpcoming = () => {
    setFilterType("upcoming");
    fetchAppointments(); // Fetch latest data and reset to upcoming
  };

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your appointments and patient schedule
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <button
          onClick={() => handleFilterChange("today")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "today" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Today's Appointments</span>
          <span className="text-lg">{appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}</span>
        </button>

        <button
          onClick={() => handleFilterChange("pending")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "pending" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Pending</span>
          <span className="text-lg">{appointments.filter(a => a.status === "pending").length}</span> </button>


          <button
          onClick={() => handleFilterChange("confirmed")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "confirmed" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Confirmed</span>
          <span className="text-lg">{appointments.filter(a => a.status === "confirmed").length}</span> </button>


        <button
          onClick={() => handleFilterChange("completed")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "completed" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Completed</span>
          <span className="text-lg">{appointments.filter(a => a.status === "completed").length}</span>
        </button>

        <button
          onClick={() => handleFilterChange("ongoing")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "ongoing" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Ongoing</span>
          <span className="text-lg">{appointments.filter(a => a.status === "ongoing").length}</span>
        </button>

        <button
          onClick={() => handleFilterChange("cancelled")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "cancelled" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <XCircle className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Cancelled</span>
          <span className="text-lg">{appointments.filter(a => a.status === "cancelled").length}</span>
        </button>

        <button
          onClick={() => handleFilterChange("missed")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "missed" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <XCircle className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Missed</span>
          <span className="text-lg">{appointments.filter(a => a.status === "missed").length}</span>
        </button>


        <button
          onClick={() => handleFilterChange("rescheduled")}
          className={`flex flex-col items-center p-4 border rounded-md ${filterType === "rescheduled" ? 'bg-blue-200' : 'hover:bg-blue-400'}`}
        >
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold">Rescheduled Request</span>
          <span className="text-lg">{appointments.filter(a => a.status === "rescheduled").length}</span>
        </button>

      </div>

      <button
        onClick={handleShowUpcoming}
        className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Show Upcoming Appointments
      </button>

      <div className="grid gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-4">Appointments</h3>
          {loading ? (
            <p>Loading appointments...</p>
          ) : (
            <AppointmentList
              appointments={filteredAppointments}
              type="doctor"
              onStatusChange={fetchAppointments}
            />
          )}
        </div>
      </div>
    </div>
  );
}

