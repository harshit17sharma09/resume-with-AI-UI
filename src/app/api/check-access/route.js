import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return new Response(JSON.stringify({ hasAccess: false }), {
      status: 401,
    });
  }

  const { email } = session.user;

  try {
    const docRef = doc(db, "access_requests", email); // Use email as the document ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return new Response(
        JSON.stringify({ hasAccess: docSnap.data().hasAccess || false }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ hasAccess: false }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error checking access:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
