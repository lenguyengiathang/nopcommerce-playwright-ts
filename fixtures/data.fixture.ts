import { test as base } from "@playwright/test";
import { getRandomFirstName, getRandomLastName, getRandomPassword } from "../utils/fake-data-helpers";
import { registerViaApi, deleteCustomerViaApi } from "../utils/api-helpers";

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

type DataFixtures = {
  registeredUser: UserData;
};

export const test = base.extend<DataFixtures>({
  registeredUser: async ({ request }, use) => {
    const firstName = getRandomFirstName();
    const lastName = getRandomLastName();

    const registeredUser: UserData = {
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      password: getRandomPassword(),
    };

    await registerViaApi(request, registeredUser);

    await use(registeredUser);

    await deleteCustomerViaApi(request, registeredUser.email);
  },
});
