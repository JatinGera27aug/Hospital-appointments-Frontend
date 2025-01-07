import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Appointment } from "@/types"; 
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
import api from "@/lib/axios"; 
import { useNavigate } from "react-router-dom";

export default function RescheduleAppointment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams(); // Extract appointmentId from URL
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [newTime, setNewTime] = useState<string>("");
  const [newDuration, setNewDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (appointmentId) {
      // Fetch appointment details using the appointmentId
      api
        .get(`/appointment/${appointmentId}`)
        .then((response) => {
          setAppointment(response.data);
          setNewDuration(response.data.duration); // Set default duration
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching appointment:", error);
          setLoading(false);
        });
    }
  }, [appointmentId]);

  const handleReschedule = () => {
    if (!newTime ) return; // || !newDuration
    console.log("Rescheduling with:", { newTime, newDuration });

    const appointmentDate = appointment?.date?.split("T")[0] || "" ;

    if (!appointmentDate) {
        console.error("Error: Appointment date is missing.");
        toast.error("Error: Appointment date is missing.");
        return;
      }

    // Call backend to update the appointment
    api
      .patch(`/appointment/reschedule/${appointmentId}`, {
        startTime: newTime,
        date: appointmentDate,
      })
      .then(() => {
        alert("Appointment rescheduled successfully!");
        navigate("/patient/dashboard"); 
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        console.error("Error rescheduling appointment:", error);
        toast.error(errorMessage);
      });
  };

  if (loading) return <div>Loading appointment details...</div>;

  if (!appointment)
    return <div>Appointment not found. Please try again later.</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reschedule Appointment</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Appointment Details</h2>
        <p>
          <strong>Doctor:</strong> {appointment.doctor.name}
        </p>
        <p>
          <strong>Reason:</strong> {appointment.reason}
        </p>
        <p>
          <strong>Current Slot:</strong> {appointment.date.split('T')[0]} at{" "}
          {appointment.time}
        </p>
        <p>
          <strong>Duration:</strong> {appointment.duration} minutes
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="time" className="block text-sm font-medium mb-1">
          Select New Time Slot
        </label>
        <Select value={newTime} onValueChange={setNewTime}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a time" />
          </SelectTrigger>
          <SelectContent>
            {[
              "09:00",
              "09:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
              "12:30",
              "13:00",
              "13:30",
              "14:00",
              "14:30",
              "15:00",
              "15:30",
              "16:00",
              "16:30",
              "17:00",
              "17:30",
              "18:00",
              "18:30",
              "19:00",
              "19:30",
              "20:00",
              "23:00",
              "23:30",
            ].map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label htmlFor="duration" className="block text-sm font-medium mb-1">
          Adjust Duration (Minutes)
        </label>
        <Input
          id="duration"
          type="number"
          value={newDuration || ""}
          onChange={(e) => setNewDuration(Number(e.target.value))}
          min="15"
          step="15"
        />
      </div>

      <Button
        variant="default"
        size="lg"
        disabled={!newTime || !newDuration}
        onClick={handleReschedule}
      >
        Confirm Reschedule
      </Button>
    </div>
  );
}
