"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/icons";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    await authClient.signUp.email(
      { email: email, password: password, name: name, callbackURL: "/dashboard" },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          setIsLoading(false);
          console.error("Sign-up failed:", ctx.error);
          setError(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome To MoneyShot</CardTitle>
          {/* <CardDescription>Login with your Apple or Google account</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              {/* <Button variant="outline" className="w-full">
                  <Icons.apple />
                  Login with Apple
                </Button> */}
              <Button
                variant="outline"
                className="w-full"
                onClick={async () =>
                  await authClient.signIn.social(
                    { provider: "google", callbackURL: "/dashboard" },
                    {
                      onRequest: () => {
                        setIsGoogleLoading(true);
                      },
                      onResponse: () => {
                        setIsGoogleLoading(false);
                      },
                      onError: (ctx) => {
                        setIsGoogleLoading(false);
                        console.error("Sign-up failed:", ctx.error);
                        setError(ctx.error.message);
                      },
                    }
                  )
                }
              >
                {isGoogleLoading ? <Loader2Icon className="animate-spin" /> : <Icons.google />}
                Continue with Google
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">{/* Or continue with */}OR</span>
            </div>
            <form onSubmit={onSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Create an account
                  {isLoading && <Loader2Icon className="animate-spin" />}
                </Button>
              </div>
            </form>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
