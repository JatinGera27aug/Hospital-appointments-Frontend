import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Doctor } from "@/types";
import api from "@/lib/axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const appointmentSchema = z.object({
  doctorId: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  time: z.string(),
  duration: z.string(),
  mode_of_payment: z.string(),
  reason: z.string().min(10),
});

type AppointmentFormProps = {
  doctors: Doctor[];
  onSuccess?: () => void;
};

interface ErrorResponse {
  message: string;
}

export function AppointmentForm({ doctors, onSuccess }: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
  });

  async function onSubmit(values: z.infer<typeof appointmentSchema>) {
    console.log("Submitting values:", values);
    try {
      setLoading(true);
      await api.post("/appointment/book", values);
      toast.success("Appointment booked successfully!");
      onSuccess?.();
    } catch (error) {
      const errorMessage = (error as AxiosError<ErrorResponse>).response?.data?.message ||
        "Failed to book appointment. Please try again.";
      console.error("Error registering doctor:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-screen max-w-full flex justify-center items-center p-6 mt-4 mb-4">
      <div className="w-full max-w-2xl bg-[#1E1E2F] shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-7 text-center text-white">
          Book Appointment
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Select Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#2E2E42] text-white border border-gray-500">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-300">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#2E2E42] text-white border border-gray-500",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const localDate = new Date(date);
                            localDate.setHours(12, 0, 0, 0);
                            field.onChange(localDate.toISOString().split('T')[0]);
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                        className="rounded-md border bg-[#2E2E42]"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#2E2E42] text-white border border-gray-500">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[180px] scroll-smooth [&_*]:scroll-smooth">
                      {["09:00", '9:30', '10:00', "10:30", '11:00', "11:30", '12:00', '12:30', '13:00', '13:30', "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", '17:00', "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"].map((time) => (
                        <SelectItem
                          key={time}
                          value={time}
                          className="transition-all duration-150"
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#2E2E42] text-white border border-gray-500">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["30", "45", "60"].map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mode_of_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Mode of Payment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#2E2E42] text-white border border-gray-500">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["cash", "card", "upi", "netbanking"].map((paymentMethod) => (
                        <SelectItem key={paymentMethod} value={paymentMethod}>
                          {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Reason for Visit</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your symptoms or reason for visit"
                      className="resize-none bg-[#2E2E42] text-white border border-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
