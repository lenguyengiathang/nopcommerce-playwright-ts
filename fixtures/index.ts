import { mergeTests } from "@playwright/test";
import { test as pageManagerTest } from "./page-managers.fixture";
import { test as dataTest } from "./data.fixture";

export const test = mergeTests(
  pageManagerTest,
  dataTest
);

export { expect } from "@playwright/test";