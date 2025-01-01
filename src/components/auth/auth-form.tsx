import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
  role: z.enum(["patient", "doctor", "admin"]).optional(),
});

type AuthFormProps = {
  type: "login" | "register";
  onSuccess?: () => void;
};

export function AuthForm({ type, onSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "patient",
    },
  });

  async function onSubmit(values: z.infer<typeof authSchema>) {
    try {
      setLoading(true);
      const endpoint = type === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, values);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      
      toast.success(`Successfully ${type}ed!`);
      onSuccess?.();
      
      // Redirect based on role
      switch (data.user.role) {
        case "patient":
          navigate("/patient/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
      }
    } catch (error) {
      console.error("Error registering doctor:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {type === "register" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : type === "login" ? "Sign In" : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}