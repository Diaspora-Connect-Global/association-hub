/**
 * Uploads a file binary to a GCS signed URL.
 *
 * Two-step upload flow:
 *   1. Call the relevant upload URL mutation (e.g. requestUploadUrl) to receive
 *      { uploadUrl, objectKey }.
 *   2. Call this function with the signed uploadUrl, the File/Blob, and the same
 *      contentType you passed to the mutation.
 *   3. Send the objectKey along with the create-post mutation.
 *
 * Note: No Authorization header is sent — the signed URL embeds credentials.
 */
export async function uploadFileToSignedUrl(
  uploadUrl: string,
  file: File | Blob,
  contentType: string,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(
      `GCS upload failed: ${response.status.toString()} ${response.statusText}`,
    );
  }
}
