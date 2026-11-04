import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "ImgBB API key is not configured" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    const imgbbFormData = new FormData()
    imgbbFormData.append("image", file)

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbFormData,
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { error: data?.error?.message || "ImgBB upload error" },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json({
      url: data.data.display_url || data.data.url,
      delete_url: data.data.delete_url,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error during upload" },
      { status: 500 }
    )
  }
}