import { NextRequest, NextResponse } from "next/server";
import { credentialsSchema } from "@/lib/validations";
import {
  getAdminEmail,
  getSession,
  isSuperAdminEmail,
  isSuperAdminPassword,
  updateAdminCredentials,
  validateAdminCredentials,
} from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ email: await getAdminEmail() });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = credentialsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, email, newPassword } = parsed.data;

    if (isSuperAdminEmail(email)) {
      return NextResponse.json(
        { error: "This email is reserved for the superadmin account" },
        { status: 400 }
      );
    }

    // The superadmin password also counts as a valid current password,
    // so a lost admin login can be reset with the master key.
    const currentEmail = await getAdminEmail();
    const valid =
      isSuperAdminPassword(currentPassword) ||
      (await validateAdminCredentials(currentEmail, currentPassword));
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 }
      );
    }

    const updated = await updateAdminCredentials({
      email,
      password: newPassword || undefined,
    });

    return NextResponse.json({ success: true, email: updated.email });
  } catch (err) {
    console.error(`[${request.method} ${request.nextUrl.pathname}]`, err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
