"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { GoogleSignInButton } from "./GoogleButton";
// import { useErrorHandler } from '@/hooks/useErrorHandler';
// import { analytics } from '@/lib/segment';
import { AuthResponse } from "@/lib/authService/authService";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ServerError } from "@/types/error";
// import { ServerError } from '@/types/error';

// Error handling logic
// Errors are caught and logged in the server actions \
// to provide more information about the error
// Only the error to be displayed is returned and shown to the user

export type AuthFormType = {
  email: string;
  password?: string;
  token?: string;
  name?: string;
};

type BaseAuthFormProps = {
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  signInWithOtp: (email: string) => Promise<AuthResponse>;
  verifyOtp: (email: string, token: string) => Promise<AuthResponse>;
};

async function identifyUser(
  supabase: ReturnType<typeof createClient>,
  name?: string
) {
  const { data: userData } = await supabase.auth.getUser();

  if (userData && userData.user) {
    // console.log(userData.user.identities);
    const { data: planData } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    // analytics.identify(userData.user.id, {
    //   name: name,
    //   email: userData.user.email,
    //   plan: planData?.plan,
    // });
  }
}

export const BaseAuthForm: React.FC<BaseAuthFormProps> = ({
  signInWithPassword,
  signInWithOtp,
  verifyOtp,
}) => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().optional(),
    token: z.string().optional(),
    name: z.string().optional(),
  });

  const form = useForm<AuthFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      token: "",
      name: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOtp, setOtp] = useState(false);
  const [isPassword, setPassword] = useState(false);

  const { error, handleError, clearError } = useErrorHandler();

  const router = useRouter();

  const supabase = createClient();

  const resetState = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOtp(false);
    setPassword(false);
    clearError();
    setIsLoading(false);
    form.resetField("password");
    form.resetField("token");
  };

  const buttonClick = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`,
        },
      });
    } catch (err) {
      handleError(err);
    }
  };

  const handleSubmit = async (values: AuthFormType) => {
    setIsLoading(true);
    clearError();

    try {
      if (
        values.email === "helen@finpanel.com" ||
        values.email === "user@fin-flow.ai"
      ) {
        if (isPassword) {
          setIsLoading(true);

          if (!values.password) {
            throw new Error("Password required");
          }

          const { error: signInError } = await signInWithPassword(
            values.email,
            values.password
          );

          if (signInError) {
            throw new ServerError(signInError);
          }

          await identifyUser(supabase);
          // analytics.track("User logged in");
          router.push("/panels");
        } else {
          setPassword(true);
          setIsLoading(false);
        }
      } else if (isOtp) {
        if (!values.token || values.token.length !== 6) {
          throw new Error("Please check your email for the one-time password.");
        }

        const { error: signInError } = await verifyOtp(
          values.email,
          values.token
        );

        if (signInError) {
          throw new ServerError(signInError);
        } else {
          // router.push('/reports');
          router.push("/panels");
        }
      } else {
        setIsLoading(true);

        const { error: signInError } = await signInWithOtp(values.email);

        if (signInError) {
          throw new ServerError(signInError);
        } else {
          setOtp(true);
          setIsLoading(false);
        }
      }
    } catch (error) {
      // Server errors are logged server side
      handleError(error, !(error instanceof ServerError));
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full"
      >
        {(isOtp || isPassword) && (
          <Button
            className=""
            variant="outline"
            size="sm"
            type="button"
            onClick={resetState}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {isOtp ? (
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <>
            {!isPassword && (
              <>
                <div className="w-full">
                  <GoogleSignInButton onClick={buttonClick} />
                </div>
                <div className="flex gap-2 w-full items-center">
                  <Separator orientation="horizontal" className="grow shrink" />
                  <p className="text-primary/70 text-sm font-semibold">OR</p>
                  <Separator orientation="horizontal" className="grow shrink" />
                </div>
              </>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email address</FormLabel> */}
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="rounded-sm py-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPassword && (
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
            )}
          </>
        )}
        {error.hasError && (
          <p className="text-sm text-red-600">{error.message}</p>
        )}

        {isLoading ? (
          <Button className="w-full py-6" type="submit" disabled>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Signing In
          </Button>
        ) : (
          <Button
            className="w-full py-6 bg-azure hover:bg-azure rounded-sm"
            size="lg"
            type="submit"
          >
            Continue
            {/* <CircleChevronRight className="h-8 w-8 text-white" /> */}
          </Button>
        )}
        <p className="text-xs text-primary/60">
          By clicking &quot;Continue with Google / Email&quot; you agree to our
          User{" "}
          <Link href="/tos" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/tos" className="underline">
            Privacy Policy
          </Link>
        </p>
      </form>
    </Form>
  );
};
