import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription
// } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

interface AppointmentListProps {
  appointments: Appointment[];
  type: "patient" | "doctor";
  onStatusChange?: () => void;
}


export function AppointmentList({ appointments, type, onStatusChange }: AppointmentListProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [doctorNames, setDoctorNames] = useState<Record<string, string>>({});
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const doctorIds = new Set(appointments.map(a => a.doctor._id)); // Extract doctor IDs
        const patientIds = new Set(appointments.map(a => a.patient._id)); // Extract patient IDs

        console.log("Patient IDs to fetch:", Array.from(patientIds));
        console.log("Doctor IDs to fetch:", Array.from(doctorIds));

        // Fetch doctor names
        const doctorPromises = Array.from(doctorIds).map(async (id) => {
          try {
            const response = await api.get(`/doctor/get-doctor/${id}`);
            console.log("Doctor response:", response.data);
            return [id, response.data.name];
          } catch (error) {
            console.error(`Error fetching doctor ${id}:`, error);
            return [id, "Unknown Doctor"];
          }
        });

        // Fetch patient names
        const patientPromises = Array.from(patientIds).map(async (id) => {
          try {
            console.log(`Fetching patient with ID: ${id}`);
            const response = await api.get(`/patient/get-patient/${id}`);
            console.log(`Patient ${id} data:`, response.data);

            if (response.data && response.data.username) {
              return [id, response.data.username];
            } else {
              console.log(`No username found for patient ${id}.`);
              return [id, "Name Not Found"];
            }
          } catch (error) {
            console.error(`Error fetching patient ${id}:`, error);
            return [id, "Unknown Patient"];
          }
        });

        console.log("Starting to fetch all names...");
        const doctorResults = await Promise.all(doctorPromises);
        const patientResults = await Promise.all(patientPromises);

        console.log("Doctor results:", doctorResults);
        console.log("Patient results:", patientResults);

        const doctorNamesObj = Object.fromEntries(doctorResults);
        const patientNamesObj = Object.fromEntries(patientResults);

        console.log("Final doctor names object:", doctorNamesObj);
        console.log("Final patient names object:", patientNamesObj);

        setDoctorNames(doctorNamesObj);
        setPatientNames(patientNamesObj);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    if (appointments.length > 0) {
      console.log("Appointments received:", appointments);
      fetchNames();
    }
  }, [appointments]);


  const handleStatusChange = async (_id: string, status: Appointment["status"]) => {
    try {
      setLoading(true);
      await api.patch(`/appointment/doctor/status/${_id}`, { status });
      toast.success(`Appointment ${status} successfully`);
      onStatusChange?.();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-400";
      case "completed":
        return "bg-green-700";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "rescheduled":
        return "bg-blue-500"
      default:
        return "bg-gray-500";
    }
  };

  const getName = (id: string | object, type: "doctor" | "patient") => {
    if (typeof id !== "string") {
      console.error(`Invalid ID type for ${type}:`, id);
      return "Invalid ID";
    }

    const nameMap = type === "doctor" ? doctorNames : patientNames;
    const name = nameMap[id];

    console.log(`Getting ${type} name for ID ${id}:`, name || "Not found yet");

    return name || "Loading...";
  };


  return (
    <div className="space-y-4">
      <AnimatePresence>
        {appointments.map((appointment, index) => (
          <motion.div
            key={appointment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Appointment with {type === "patient"
                    ? getName(appointment.doctor._id, "doctor")
                    : getName(appointment.patient._id, "patient")}
                </CardTitle>
                <Badge variant="outline" className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(appointment.date), "PPP")}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    {appointment.time} ({appointment.duration} mins)
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4" />
                    {type === "patient"
                      ? getName(appointment.doctor._id, "doctor")
                      : getName(appointment.patient._id, "patient")}
                  </div>
                </div>

                {type === "doctor" && appointment.status === "pending" && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(appointment._id, "confirmed")}
                      disabled={loading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      style={{ height: '33px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleStatusChange(appointment._id, "cancelled")}
                      disabled={loading}
                    >
                      <XCircle className="mr-2 h-4 w-4" />Cancel
                    </Button>
                  </div>
                )}

                {/* patient pending -> cancel */}
                {type === "patient" && appointment.status === "pending" && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(appointment._id, "cancelled")}
                      disabled={loading}
                    >
                    Cancel
                    </Button>
                  </div>
                )}

                {type === "patient" && appointment.status === "missed" && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/patient/reschedule-appointment/${appointment._id}`)}
                      disabled={loading}
                    >
                      Reschedule
                    </Button>
                  </div>
                )}


                {type === "patient" && appointment.status === "rescheduled" && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(appointment._id, "cancelled")}
                      disabled={loading}
                    >
                    Cancel
                    </Button>
                  </div>
                )}

                {type === "doctor" && appointment.status === "confirmed" && (
                  <div className="mt-4 flex items-center">
                    {/* Mark as Ongoing */}
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center"
                      onClick={() => handleStatusChange(appointment._id, "ongoing")}
                      disabled={loading}
                    >
                      <Clock className="mr-2 h-4 w-4" /> Mark as Ongoing
                    </Button>

                    {/* Mark as Completed */}
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-700 hover:bg-green-900 text-white flex items-center ml-2"
                      onClick={() => handleStatusChange(appointment._id, "completed")}
                      disabled={loading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                    </Button>

                    {/* Spacer to push Cancel to the right */}
                    <div className="flex-grow"></div>

                    {/* Cancel */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleStatusChange(appointment._id, "cancelled")}
                      disabled={loading}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                )}

                {/* for rescheduled - doctor */}
                {type === "doctor" && appointment.status === "rescheduled" && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      style={{ height: '32px', display: 'flex', alignItems: 'center' }}
                      onClick={() => handleStatusChange(appointment._id, "confirmed")}
                      disabled={loading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      style={{ height: '33px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleStatusChange(appointment._id, "cancelled")}
                      disabled={loading}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                )}


              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
