import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getOnboardingData } from "@/services/data"; // Import the same service used in your form

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // 1. Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/user/signin", request.url));
    }

    // 2. Admins skip onboarding
    if (token.role === "admin") {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    // 3. Check if this is a completely new user (from OAuth creation)
    const isNewUser = token.isNewUser;

    if (isNewUser) {
      // New users go to onboarding
      return NextResponse.redirect(
        new URL(
          `/user/onboarding?next=${encodeURIComponent(callbackUrl)}`,
          request.url
        )
      );
    }

    // 4. EXISTING USERS: Check if they actually finished onboarding
    // This is the missing piece! Just because they aren't 'new', doesn't mean they are 'done'.
    if (token.id) {
      try {
        const onboardingResponse = await getOnboardingData(token.id);
        const onboardingRecord = onboardingResponse?.data;
        const onboardingStatus = onboardingRecord?.status;

        // If record is missing OR status is NOT 'completed', send them to onboarding
        if (!onboardingRecord || onboardingStatus !== "completed") {
          return NextResponse.redirect(
            new URL(
              `/user/onboarding?next=${encodeURIComponent(callbackUrl)}`,
              request.url
            )
          );
        }
      } catch (error) {
        console.error(
          "Error checking onboarding status in OAuth redirect:",
          error
        );
        // If error checking, send to onboarding to be safe
        return NextResponse.redirect(
          new URL(
            `/user/onboarding?next=${encodeURIComponent(callbackUrl)}`,
            request.url
          )
        );
      }
    }

    // 5. If we get here, the user is an existing user who HAS completed onboarding
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    console.error("OAuth redirect error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
