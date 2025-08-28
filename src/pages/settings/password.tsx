import { useEffect, useRef, useState } from "react";
import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transition } from "@headlessui/react";
import SettingsLayout from "@/Layouts/settings/layout";

type Errors = {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
  general?: string;
};

export default function Password() {
  // DEMO ONLY (resets on refresh)
  const storedPasswordRef = useRef<string>("Demo@1234");

  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => { document.title = "Password settings"; }, []);

  const validate = () => {
    const e: Errors = {};
    if (!form.current_password) e.current_password = "Current password is required.";
    if (!form.password) e.password = "New password is required.";
    if (form.password && form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.password_confirmation) e.password_confirmation = "Passwords do not match.";
    setErrors(e);
    if (e.password) passwordRef.current?.focus();
    else if (e.current_password) currentPasswordRef.current?.focus();
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecentlySuccessful(false);
    setErrors({});
    if (!validate()) return;

    setProcessing(true);
    setTimeout(() => {
      if (form.current_password !== storedPasswordRef.current) {
        setErrors({ current_password: "Current password is incorrect." });
        currentPasswordRef.current?.focus();
        setProcessing(false);
        return;
      }
      storedPasswordRef.current = form.password;
      setForm({ current_password: "", password: "", password_confirmation: "" });
      setProcessing(false);
      setRecentlySuccessful(true);
      setTimeout(() => setRecentlySuccessful(false), 2000);
    }, 600);
  };

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

        {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="current_password">Current password</Label>
            <Input
              id="current_password"
              ref={currentPasswordRef}
              name="current_password"
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              value={form.current_password}
              onChange={(e) => setForm((f) => ({ ...f, current_password: e.target.value }))}
            />
            <InputError message={errors.current_password} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
            <InputError message={errors.password} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={form.password_confirmation}
              onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
            />
            <InputError message={errors.password_confirmation} />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={processing}>{processing ? "Saving..." : "Save password"}</Button>
            <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
              <p className="text-sm text-muted-foreground">Saved</p>
            </Transition>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
}

