import { userContext } from "~/middleware/context";
import { auth } from "~/lib/auth.server";

export async function loader({ request, context }: { request: Request; context: { get: Function } }) {
  const user = context.get(userContext);
  const sessions = await auth.api.listSessions({ headers: request.headers });
  return { user, sessions };
}

type Session = {
  id: string;
  token: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: string;
  createdAt: string;
};

export default function SettingsPage({
  loaderData,
}: {
  loaderData: {
    user: { id: string; name: string; email: string; image: string | null };
    sessions: Session[];
  };
}) {
  const { user, sessions } = loaderData;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account.</p>
      </div>

      {/* Profile */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <Row label="Name" value={user.name || "—"} />
          <Row label="Email" value={user.email} />
          <Row label="User ID" value={user.id} />
        </div>
      </section>

      {/* Active Sessions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Active sessions</h2>
        <div className="rounded-lg border bg-card divide-y">
          {sessions.map((s) => (
            <div key={s.id} className="p-4 space-y-1">
              <p className="text-sm font-medium truncate">
                {s.userAgent || "Unknown device"}
              </p>
              <p className="text-xs text-muted-foreground">
                {s.ipAddress || "Unknown IP"} &middot; Expires{" "}
                {new Date(s.expiresAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No active sessions.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
