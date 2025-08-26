import { useRef, useState } from "react";
import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileApi } from "@/lib/api";

export default function DeleteUser() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; general?: string }>({});
  const passwordInput = useRef<HTMLInputElement>(null);

  const reset = () => { setPassword(""); setErrors({}); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setProcessing(true); setErrors({});
    const res = await profileApi.deleteUser(password);
    if ("ok" in res && res.ok) { reset(); setOpen(false); }
    else { setErrors(res.errors ?? { general: "Failed to delete account." }); passwordInput.current?.focus(); }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <HeadingSmall title="Delete account" description="Delete your account and all of its resources" />
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">Warning</p>
          <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button variant="destructive">Delete account</Button></DialogTrigger>
          <DialogContent>
            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            <DialogDescription>
              Once your account is deleted, all of its resources and data will also be permanently deleted.
              Please enter your password to confirm.
            </DialogDescription>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input id="password" type="password" name="password" ref={passwordInput}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" autoComplete="current-password" />
                <InputError message={errors.password || errors.general} />
              </div>

              <DialogFooter className="gap-2">
                <Button variant="secondary" type="button" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
                <Button variant="destructive" type="submit" disabled={processing}>
                  {processing ? "Deleting..." : "Delete account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
