import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/types";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchDoctors();
  }, []);

  const handleSuccess = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="p-0">
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <p>Loading doctors...</p>
            ) : (
              <AppointmentForm doctors={doctors} onSuccess={handleSuccess} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}