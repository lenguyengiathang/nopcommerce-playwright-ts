import { APIRequestContext, expect } from "@playwright/test";
import { getAntiForgeryToken } from "./anti-forgery";

export async function registerViaApi(
  request: APIRequestContext,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender?: string;
  },
): Promise<void> {
  const token = await getAntiForgeryToken(request, "/register");

  const response = await request.post("/register?returnurl=/", {
    form: {
      Gender: "M",
      FirstName: userData.firstName,
      LastName: userData.lastName,
      DateOfBirthDay: "0",
      DateOfBirthMonth: "0",
      DateOfBirthYear: "0",
      Email: userData.email,
      Password: userData.password,
      ConfirmPassword: userData.password,
      "register-button": "",
      __RequestVerificationToken: token,
    },
  });

  expect(response.ok()).toBeTruthy();
}

export async function loginViaApi(request: APIRequestContext, email: string, password: string): Promise<void> {
  const token = await getAntiForgeryToken(request, "/login");

  const response = await request.post("/login?returnurl=/", {
    form: {
      Email: email,
      Password: password,
      RememberMe: "false",
      __RequestVerificationToken: token,
    },
  });

  expect(response.ok()).toBeTruthy();
}

export async function logoutViaApi(request: APIRequestContext): Promise<void> {
  const response = await request.get("/logout", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(302);
}

export async function getCustomerIdByEmail(request: APIRequestContext, email: string): Promise<number> {
  const token = await getAntiForgeryToken(request, "/Admin/Customer/List");

  const response = await request.post("/Admin/Customer/CustomerList", {
    form: {
      SearchEmail: email,
      SearchIsActive: true,
      __RequestVerificationToken: token,
    },
  });

  const body = await response.json();

  return body.Data[0].Id;
}

export async function deleteCustomerViaApi(request: APIRequestContext, customerId: string): Promise<void> {
  const token = await getAntiForgeryToken(request, `/Admin/Customer/Delete/${customerId}`);

  const response = await request.post(`/Admin/Customer/Delete/${customerId}`, {
    form: {
      __RequestVerificationToken: token,
    },
  });

  expect(response.ok()).toBeTruthy();
}
