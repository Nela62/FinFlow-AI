import { createClient } from "@/lib/supabase/server";
// import { Logger } from "next-axiom";
import { AuthError, isAuthError } from "@supabase/supabase-js";
import { serviceClient } from "../supabase/service";
import { Logger } from "next-axiom";

export interface AuthResponse {
  error: string | null;
}

const log = new Logger();

const handleAuthError = (
  error: AuthError,
  fnName: string,
  fnInputs: Record<string, any>
): AuthResponse => {
  log.error("Error occurred", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    fnName,
    fnInputs,
    status: error.status,
    code: error.code,
  });

  const errorMessages: Record<number, string> = {
    429: "We are experiencing an unusually high load. Please try again later.",
    400: "Invalid login credentials",
    422: "Account not found. Please sign up instead.",
    403: "Your code has expired or is invalid.",
  };

  return {
    error:
      (error.status && errorMessages[error.status]) ||
      "Could not authenticate user",
  };
};

const handleUnexpectedError = (
  error: any,
  fnName: string,
  fnInputs: Record<string, any>
): AuthResponse => {
  if (error instanceof Error || isAuthError(error)) {
    log.error("Unexpected error occurred", { ...error, fnName, fnInputs });
  } else {
    log.error("Unexpected error occurred", { error, fnName, fnInputs });
  }

  return { error: "Could not authenticate user" };
};

export const signInWithPassword = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  "use server";

  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return error
        ? handleAuthError(error, "signInWithPassword", { email, password })
        : { error: null };
    }

    return { error: null };
  } catch (err) {
    return handleUnexpectedError(err, "signInWithPassword", {
      email,
      password,
    });
  }
};

export const signInWithOtp = async (email: string): Promise<AuthResponse> => {
  "use server";

  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) {
      return handleAuthError(error, "signInWithOtp", { email });
    }

    return { error: null };
  } catch (err) {
    return handleUnexpectedError(err, "signInWithOtp", { email });
  }
};

export const initUser = async (userId: string, email: string) => {
  "use server";

  try {
    const supabase = createClient();

    // await supabase.auth.updateUser({ data: { finished_onboarding: false } });

    const { error: insertSettingsError } = await supabase
      .from("settings")
      .insert({ user_id: userId, email, plan: "free", credit_limit: 1000 });

    const { error: insertWorkspaceError } = await supabase
      .from("workspaces")
      .insert({ user_id: userId, name: "Main Workspace" });

    if (insertSettingsError) {
      return { error: insertSettingsError };
    }

    if (insertWorkspaceError) {
      return { error: insertWorkspaceError };
    }

    return { error: null };
  } catch (err) {
    return { error: err };
  }
};

export const verifyOtp = async (
  email: string,
  token: string
): Promise<AuthResponse> => {
  "use server";

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return handleAuthError(error, "verifyOtp", { email, token });
    }

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return handleAuthError(userError, "verifyOtp, supabase.auth.getUser()", {
        email,
        token,
      });
    }

    // TODO: Check if user settings exist, if not, create settings and workspace
    if (data.user) {
      const { data: settings } = await supabase
        .from("settings")
        .select("id")
        .eq("user_id", data.user.id);

      if (!settings) {
        const { error } = await initUser(data.user.id, email);

        if (error) {
          log.error("Error occurred", {
            error,
            fnName: "verifyOtp",
            fnInputs: { email, token },
            sql: `await supabase.from('profiles').insert({ user_id: ${data.user.id}, plan: 'free' })`,
          });

          return { error: "Could not authenticate user" };
        }
      }
    } else {
      log.error("Error occurred", {
        message: "Could not find authenticated user after verifying Otp",
        fnName: "verifyOtp",
        fnInputs: { email, token },
      });
      return { error: "Could not authenticate user" };
    }

    return { error: null };
  } catch (err) {
    return handleUnexpectedError(err, "verifyOtp", {
      email,
      token,
    });
  }
};
