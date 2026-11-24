# Contributing Guide

## Branching Strategy

- `main` — stable, tested code.
- `develop` — integration branch, if used by the team.
- `feature/<name>` — new features or test modules, e.g. `feature/checkout-tests`.
- `fix/<name>` — bug fixes, e.g. `fix/login-locator`.

Use descriptive branch names and keep commits focused on one logical change.

## Adding a New Page Object

### 1. Create the page object

Create a file under the appropriate directory in `pages/`, using the existing kebab-case `.page.ts` naming convention.

Example: `pages/user/cart.page.ts`

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/base.page";

export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly cartItemName: Locator;

  constructor(page: Page) {
    super(page);

    this.checkoutButton = page.getByRole("button", {
      name: "Checkout",
    });
    this.cartItemName = page.locator(".cart-item-name");
  }

  async clickCheckoutButton(): Promise<void> {
    await this.checkoutButton.click();
  }
}
```

Adapt the constructor and method signatures to match the existing `BasePage` and page-object patterns. Use reliable locators, preferably role-, label-, or text-based locators where appropriate.

### 2. Register the page object

If the framework uses a page generator or page manager to create page objects, add the new page using the same pattern as the existing page objects.

Keep page-object creation in the existing framework structure. Avoid introducing another page-management mechanism.

### 3. Write the test

Place the test under the appropriate directory in `tests/ui/`.

Example: `tests/ui/user/cart.spec.ts`

```typescript
import { test, expect } from "../../../fixtures";

test("Verify that a user can proceed to checkout", async ({ page }) => {
  // Use the existing fixture and page-object patterns.
  // Arrange the required cart state.
  // Perform the checkout action.
  // Assert the expected result.
});
```

Adapt the fixture import, test setup, and page-object access to match the existing tests. Tests should verify observable outcomes rather than merely checking that an action completed.

## Coding Guidelines

- Follow the existing Page Object Model structure.
- Use the existing naming conventions for files, classes, locators, and methods.
- Keep locators and page-specific interactions inside page objects where appropriate.
- Reuse existing base-page methods and fixtures instead of duplicating functionality.
- Use `async`/`await` consistently for asynchronous operations.
- Prefer Playwright's auto-waiting and web-first assertions over fixed delays.
- Keep tests independent and make their expected outcomes explicit.
- Avoid unnecessary abstractions and dependencies.

## Checklist Before Committing

- [ ] File names and class names follow existing conventions.
- [ ] Locators are descriptive and reliable.
- [ ] Methods have clear responsibilities and appropriate return types.
- [ ] Asynchronous operations are awaited.
- [ ] Dialog handlers are registered before the action that triggers them.
- [ ] Page transitions and returned page objects are handled consistently.
- [ ] Tests contain meaningful assertions.
- [ ] No unnecessary fixed sleeps are used.
- [ ] New page objects are registered when required by the existing architecture.
- [ ] Relevant documentation is updated when coverage or framework behavior changes.
- [ ] Type checking and relevant tests pass.

## Commit Guidelines

- Make one logical change per commit.
- Use clear commit messages, for example:
  - `feat: add cart page object`
  - `test: add checkout navigation test`
  - `fix: update login locator`
  - `docs: update contributing guide`
- Review staged changes before committing.
- Do not include unrelated changes in the same commit.
