import {z} from 'zod';

export const loginSchema = z.object({
  email: z.email({message: 'Email tidak valid'}),
  password: z.string().min(1, {message: 'Password wajib diisi'}),
});

export const registerSchema = z
  .object({
    fullname: z.string().min(3, {message: 'Nama lengkap minimal 3 karakter'}),
    email: z.email({message: 'Email tidak valid'}),
    password: z.string().min(6, {message: 'Password minimal 6 karakter'}),
    confirmPassword: z
      .string()
      .min(1, {message: 'Konfirmasi password wajib diisi'}),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
