import { LoginForm } from "@/components/login-form";

export default function SignInPage() {
  return (
    <div className="flex h-[calc(100vh-65px)] w-full items-center justify-center p-2 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
