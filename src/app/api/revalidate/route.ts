import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const { tag } = await request.json().catch(() => ({}));
  if (typeof tag !== "string" || !tag) {
    return NextResponse.json({ message: "tag مطلوب" }, { status: 400 });
  }

  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true, tag });
}
