export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

export interface Doctor {
  _id: string;
  userId: string;
  name: string;
  specialization: string;
  yearsOfExperience: number;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface Appointment {
  _id: string;
  doctor: { _id: string; name: string; specialization?: string; fees?: number };
  patient: { _id: string; username: string; email?: string; phone?: string };
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'missed' | 'ongoing' | 'rescheduled';
  reason: string;
}
