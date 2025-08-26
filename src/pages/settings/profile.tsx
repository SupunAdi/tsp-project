import { useEffect, useMemo, useState } from "react";
import { Transition } from "@headlessui/react";
import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsLayout from "@/Layouts/settings/layout";
import DeleteUser from "@/components/delete-user";
import { profileApi, type ProfileUser } from "@/lib/api";

export default function ProfileS({
  mustVerifyEmail = true,
  status: statusProp
}: { mustVerifyEmail?: boolean; status?: string; }) {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState<string | undefined>(statusProp);

  useEffect(() => { document.title = "Profile settings"; }, []);
  useEffect(() => { (async () => {
    const me = await profileApi.getMe();
    setUser(me); setName(me.name ?? ""); setEmail(me.email ?? "");
  })(); }, []);

  const showVerifyBlock = useMemo(() => mustVerifyEmail && user?.email_verified_at === null,
    [mustVerifyEmail, user?.email_verified_at]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setProcessing(true); setErrors({}); setRecentlySuccessful(false);
    const res = await profileApi.updateProfile({ name, email });
    if ("ok" in res && res.ok) {
      setUser(res.user); setRecentlySuccessful(true);
      setTimeout(() => setRecentlySuccessful(false), 2000);
    } else {
      setErrors(res.errors ?? {});
    }
    setProcessing(false);
  };

  const resendVerification = async () => {
    await profileApi.resendVerification();
    setStatus("verification-link-sent");
  };

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <HeadingSmall title="Profile information" description="Update your name and email address" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" className="mt-1 block w-full" value={name}
              onChange={(e) => setName(e.target.value)} name="name" required autoComplete="name" placeholder="Full name" />
            <InputError className="mt-2" message={errors.name} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" className="mt-1 block w-full" value={email}
              onChange={(e) => setEmail(e.target.value)} name="email" required autoComplete="username" placeholder="Email address" />
            <InputError className="mt-2" message={errors.email} />
          </div>

          {showVerifyBlock && (
            <div>
              <p className="-mt-4 text-sm text-muted-foreground">
                Your email address is unverified.{" "}
                <button type="button" onClick={resendVerification}
                  className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current dark:decoration-neutral-500">
                  Click here to resend the verification email.
                </button>
              </p>
              {status === "verification-link-sent" && (
                <div className="mt-2 text-sm font-medium text-green-600">
                  A new verification link has been sent to your email address.
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button disabled={processing} type="submit">{processing ? "Saving..." : "Save"}</Button>
            <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
              <p className="text-sm text-neutral-600">Saved</p>
            </Transition>
          </div>
        </form>
      </div>

      <DeleteUser />
    </SettingsLayout>
  );
}
