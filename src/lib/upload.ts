/**
 * ImgBB Image Upload Utility
 * Uploads an image file to ImgBB and returns the direct display URL.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

  if (!apiKey) {
    throw new Error("ImgBB API key is missing. Please set NEXT_PUBLIC_IMGBB_API_KEY.")
  }

  // Validate file size (max 10MB)
  const MAX_SIZE_MB = 10
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image size exceeds the ${MAX_SIZE_MB}MB limit.`)
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"]
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPG, PNG, WEBP, or GIF).")
  }

  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.error?.message || `Image upload failed with status ${response.status}`
    )
  }

  const result = await response.json()

  if (!result.success || !result.data?.display_url) {
    throw new Error(result?.error?.message || "Failed to retrieve image URL from ImgBB.")
  }

  return result.data.display_url
}