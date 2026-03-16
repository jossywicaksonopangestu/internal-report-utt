import {createClient} from '@/lib/supabase/client';
import {RegisterSchema} from '../types';

const supabase = createClient();

export async function registerUser(values: RegisterSchema) {
  const {data, error: signUpError} = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        fullname: values.fullname,
      },
    },
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  const user = data.user;
  if (!user) {
    throw new Error('Registration failed, no user returned from Supabase.');
  }

  return data;
}
