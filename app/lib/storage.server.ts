import { env } from "cloudflare:workers";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

/**
 * Upload a user photo to R2 and return the object key.
 * The key follows the pattern: `photos/{userId}/{timestamp}.{ext}`
 */
export async function uploadPhoto(
	userId: string,
	file: File,
): Promise<{ key: string }> {
	if (!ALLOWED_TYPES.includes(file.type)) {
		throw new Error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP.");
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error("File too large. Maximum size is 5 MB.");
	}

	const ext = file.type.split("/")[1].replace("jpeg", "jpg");
	const key = `photos/${userId}/${Date.now()}.${ext}`;

	await env.R2.put(key, await file.arrayBuffer(), {
		httpMetadata: { contentType: file.type },
	});

	return { key };
}

/**
 * Delete a photo from R2 by its object key.
 */
export async function deletePhoto(key: string): Promise<void> {
	await env.R2.delete(key);
}

/**
 * Get a photo from R2 and return it as a Response for serving.
 */
export async function getPhoto(key: string): Promise<Response | null> {
	const object = await env.R2.get(key);
	if (!object) return null;

	const headers = new Headers();
	headers.set(
		"Content-Type",
		(object.httpMetadata as { contentType?: string })?.contentType ??
			"application/octet-stream",
	);
	headers.set("Cache-Control", "public, max-age=31536000, immutable");

	return new Response(object.body as ReadableStream, { headers });
}
