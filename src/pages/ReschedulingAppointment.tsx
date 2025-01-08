import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

export default function RescheduleAppointment() {
    const navigate = useNavigate();
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [newTime, setNewTime] = useState<string>("");
    const [newDuration, setNewDuration] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (appointmentId) {
            api
                .get(`/appointment/${appointmentId}`)
                .then((response) => {
                    setAppointment(response.data);
                    setNewDuration(response.data.duration);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching appointment:", error);
                    setLoading(false);
                });
        }
    }, [appointmentId]);

    const handleReschedule = () => {
        if (!newTime) return;

        const appointmentDate = appointment?.date?.split("T")[0] || "";

        if (!appointmentDate) {
            toast.error("Error: Appointment date is missing.");
            return;
        }

        api
            .patch(`/appointment/reschedule/${appointmentId}`, {
                startTime: newTime,
                date: appointmentDate,
            })
            .then(() => {
                toast.success("Appointment rescheduled successfully!");
                navigate("/patient/dashboard");
            })
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.message || "An unexpected error occurred";
                toast.error(errorMessage);
            });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg text-white">Loading appointment details...</div>;
    }

    if (!appointment) {
        return <div className="flex justify-center items-center h-screen text-lg text-white">Appointment not found. Please try again later.</div>;
    }

    return (
        <div
    className="h-[calc(100vh-4rem)] w-screen max-w-full bg-[#1E1E2F] flex justify-center items-center p-6"
    style={{ color: "rgba(255, 255, 255, 0.87)" }}
>
            <div className="w-full max-w-2xl bg-[#2A2A3D] shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-7 text-center text-white">
                    Reschedule Appointment
                </h1>

                <div className="mb-8 bg-[#343447] p-5 rounded-md">
                    <h2 className="text-lg font-semibold mb-3 text-gray-300">
                        Appointment Details
                    </h2>
                    <p className="mb-3">
                        <span className="font-medium text-gray-400">Doctor:</span>{" "}
                        {appointment.doctor.name}
                    </p>
                    <p className="mb-3">
                        <span className="font-medium text-gray-400">Reason:</span>{" "}
                        {appointment.reason}
                    </p>
                    <p className="mb-3">
                        <span className="font-medium text-gray-400">Current Slot:</span>{" "}
                        {appointment.date.split("T")[0]} at {appointment.time}
                    </p>
                    <p>
                        <span className="font-medium text-gray-400">Duration:</span>{" "}
                        {appointment.duration} minutes
                    </p>
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-300 mb-3"
                    >
                        Select New Time Slot
                    </label>
                    <Select value={newTime} onValueChange={setNewTime}>
                        <SelectTrigger className="bg-[#2E2E42] text-white border border-gray-500 rounded-md">
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
                                "20:30",
                                "21:00",
                                "21:30",
                                "22:00",
                                "22:30",
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

                <div className="mb-8">
                    <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-300 mb-3"
                    >
                        Adjust Duration (Minutes)
                    </label>
                    <Select
                        onValueChange={(value) => setNewDuration(Number(value))}
                        defaultValue={newDuration ? String(newDuration) : "15"}
                    >
                        <SelectTrigger className="bg-[#2E2E42] text-white border border-gray-500 rounded-md">
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            {["15", "30", "45", "60"].map((duration) => (
                                <SelectItem key={duration} value={duration}>
                                    {duration} minutes
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    variant="default"
                    size="lg"
                    disabled={!newTime || !newDuration}
                    onClick={handleReschedule}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition duration-300"
                >
                    Confirm Reschedule
                </Button>
            </div>
        </div>
    );
}
