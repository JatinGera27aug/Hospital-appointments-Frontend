import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";

const doctorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  yearsOfExperience: z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().min(0, "Experience must be at least 0")
  ),
  qualifications: z.preprocess(
    (value) => (typeof value === "string" ? value.split(",").map((q) => q.trim()) : value),
    z.array(z.string().min(1, "Qualification cannot be empty"))
  ),
  availability: z
    .array(
      z.object({
        day: z.string().min(1, "Day is required"),
        startTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time"),
        endTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time"),
      })
    )
    .nonempty("At least one availability slot is required."),
  contact: z.object({
    phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
  }),
  clinicAddress: z.string().min(5, "Clinic address is required"),
  fees: z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().min(100, "Fees must be at least 100")
  ),
  ratings: z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5")
  ),
});

export function DoctorRegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      yearsOfExperience: 0,
      qualifications: [],
      availability: [{ day: "", startTime: "", endTime: "" }],
      contact: {
        phone: "",
        email: "",
      },
      clinicAddress: "",
      fees: 100,
      ratings: 0,
    },
  });

  const handleAddAvailability = async () => {
    const availability = form.getValues("availability");
    form.setValue("availability", [
      ...availability,
      { day: "", startTime: "", endTime: "" },
    ]);
    await form.trigger("availability"); // Re-validate immediately
  };

  const handleRemoveAvailability = async (index: number) => {
    const availability = form.getValues("availability");
    availability.splice(index, 1);
    form.setValue("availability", availability);
    await form.trigger("availability"); // Re-validate immediately
  };

  const onSubmit = async (values: z.infer<typeof doctorSchema>) => {
    try {
      setLoading(true);
      await api.post("/doctor/add/doctor", { ...values, role: "doctor" });
      toast.success("Doctor registered successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to register doctor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Dr. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="doctor@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <FormControl>
                <Input placeholder="Cardiology" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qualifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualifications</FormLabel>
              <FormControl>
                <Input placeholder="MBBS, MD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clinicAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street, City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultation Fees</FormLabel>
              <FormControl>
                <Input type="number" min="100" step="10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ratings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ratings (0-5)</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="5" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Availability Section */}
        <div>
          <h3 className="text-sm font-semibold">Availability</h3>
          {form.getValues("availability").map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <FormField
                control={form.control}
                name={`availability.${index}.day`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <FormControl>
                      <select {...field} className="border rounded p-2 w-full">
                        <option value="">Select a day</option>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`availability.${index}.startTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`availability.${index}.endTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => handleRemoveAvailability(index)} className="self-start mt-8">
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddAvailability}>
            Add Availability
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}