import { APIRequestContext } from "@playwright/test";

export async function getAntiForgeryToken(request: APIRequestContext, url: string): Promise<string> {
  const response = await request.get(url);
  const html = await response.text();
  const token = html.match(/name="__RequestVerificationToken".*?value="([^"]+)"/)?.[1];

  if (!token) {
    throw new Error("Unable to find anti-forgery token.");
  }
  
  return token;
}
