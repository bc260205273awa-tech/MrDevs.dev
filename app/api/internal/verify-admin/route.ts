import { NextResponse } from "next/server";

// Rate limiting tracking in-memory (per IP)
const rateLimitMap = new Map<string, { attempts: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute window

export async function POST(request: Request) {
  try {
    // 1. Check IP rate-limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "internal-client";
    const now = Date.now();

    const clientRate = rateLimitMap.get(ip);
    if (clientRate) {
      if (now > clientRate.resetTime) {
        // Reset window
        rateLimitMap.set(ip, { attempts: 1, resetTime: now + WINDOW_MS });
      } else if (clientRate.attempts >= MAX_ATTEMPTS) {
        const remainingSec = Math.ceil((clientRate.resetTime - now) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: `Too many failed attempts. Please wait ${remainingSec} seconds before trying again.`,
          },
          { status: 429 }
        );
      } else {
        clientRate.attempts += 1;
      }
    } else {
      rateLimitMap.set(ip, { attempts: 1, resetTime: now + WINDOW_MS });
    }

    // 2. Parse request body
    const body = await request.json().catch(() => null);
    if (!body || typeof body.passcode !== "string") {
      return NextResponse.json(
        { success: false, error: "Passcode is required." },
        { status: 400 }
      );
    }

    const cleanInput = body.passcode.trim().toLowerCase();

    // 3. Define authorized keys (from env or defaults)
    const envAdminKey = process.env.ADMIN_PASSKEY ? process.env.ADMIN_PASSKEY.trim().toLowerCase() : null;
    const defaultAllowed = ["mrdevs2026", "mubeen2026", "mrdevs", "admin123", "mubeen"];

    const isAuthorized = envAdminKey
      ? cleanInput === envAdminKey || defaultAllowed.includes(cleanInput)
      : defaultAllowed.includes(cleanInput);

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Invalid access key. Please enter the authorized admin passcode." },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful login
    rateLimitMap.delete(ip);

    // Return success response with a verification timestamp
    return NextResponse.json({
      success: true,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
