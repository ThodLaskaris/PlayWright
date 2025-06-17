import { expect, test } from "@playwright/test";

// Hook

// test.beforeAll(async ({ page }) => {

// })

// Flakeness of the test try to avoid.
// test.afterEach(async ({ page }) => {

// })
// test.afterAll(async ({ page}) => {

// })
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200')
  await page.getByText('Forms')
    .click()
  await page.getByText('Form Layouts')
    .click()
});


test('Locator syntax rules', async ({ page }) => {
  //  Find the locator by tagName
  page.locator('input')
  //  Find the locator by ID
  await page.locator('#inputEmail1')
    .click()
  //  Find the locator by classValue
  page.locator('.shape-rectangle')
  // Find the locator by attribute
  page.locator('[placeholder="Email"]')
  // Find the locator by entire classValue(full value)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
  // Combine different selectors
  page.locator('input[placeholder="Email"]') // by tagName and by attribute
  // Find the locator by xPath ( Not recommended)
  page.locator('//*[@id=inputEmail1"]')
  // by partial text match
  page.locator(':text("Using")')
  // by exact text match
  page.locator(':text-is("Using The Grid")')
})

test('User facing Locators', async ({ page }) => {
  await page.getByRole('textbox', { name: "Email" })
    .first()
    .click()
  await page.getByRole('button', { name: "Sign in" })
    .first()
    .click()
  await page.getByLabel('Email')
    .first()
    .click()
  await page.getByPlaceholder('Jane Doe')
    .click()
  await page.getByText('Using the Grid')
    .first()
    .click()
  // await page.getByTitle('IoT Dashboard')
  //   .click()
  await page.getByTestId('SignIn')
    .click()
})

// always try to find unique elements.
test('locating child elements', async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")')
    .click()

  //chaining the locators
  await page.locator('nb-card')
    .locator('nb-radio')
    .locator(':text-is("Option 2")')
    .click()

  await page.locator('nb-card')
    .getByRole('button', { name: "Sign in" })
    .first()
    .click()

  // least prefferble approach

  await page.locator('nb-card').nth(3)
    .getByRole('button')
    .click();
})


test('locating parent elements', async ({ page }) => {
  await page.locator('nb-card', { hasText: "Using the Grid" })
    .getByRole('textbox', { name: "Email" })
    .click();

  //providing second attribute as a locator and not as text( first example)
  await page.locator('nb-card', { has: page.locator('#inputEmail1') })
    .getByRole('textbox', { name: "Email" })
    .click()

  await page.locator('nb-card')
    .filter({ hasText: "Basic form" })
    .getByRole('textbox', { name: "Email" })
    .click()

  await page.locator('nb-card')
    .filter({ has: page.locator('.status-danger') })
    .getByRole('textbox', { name: "Password" })
    .click()

  await page.locator('nb-card')
    .filter({ has: page.locator('nb-checkbox') })
    .filter({ hasText: "Sign in" })
    .getByRole('textbox', { name: "Email" })
    .click()


  // not recommended
  await page.locator(':text-is("Using the Grid")')
    .locator('..') // one level up to the parent element
    .getByRole('textbox', { name: "Email" })
    .click()

})

test('Reusing the locators', async ({ page }) => {

  const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole('textbox', { name: "Email" })
  const passwordField = basicForm.getByRole('textbox', { name: "Password" })

  await emailField.fill('test@test.com')

  await passwordField.fill('Welcome123')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  await expect(emailField).toHaveValue('test@test.com');
})

test('extracting values', async ({ page }) => {
  // single test value
  const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator('button').textContent()
  expect(buttonText).toEqual('Submit')
  //  all text values
  //  all values from the each element and put them in an array and then validate that the array(allradiobuttons) contains ( option 1)
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsLabels).toContain("Option 1");
  //  Error: expect(received).toContain(expected) // indexOf
  //  Expected value: "Option 9"
  //  Received array: ["Option 1", "Option 2", "Disabled Option"]

  // find the value of input field.

  const emailField = basicForm.getByRole('textbox', { name: "Email" })
  await emailField.fill('test@test.com')
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual('test@test.com');

  // get the value of the attribute

  const placeholderValue = await emailField.getAttribute('placeholder')
  expect(placeholderValue).toEqual('Email')
})
test('assertions', async ({ page }) => {
  const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')

  const value = 5
  expect(value).toEqual(5)

  const text = await basicFormButton.textContent() //get the text
  expect(text).toEqual("Submit")

  // Locator assertion
  expect(basicFormButton).toHaveText('Submit')


  // Soft assertion
  //  Not good practice Test continues even if fails
  await expect.soft(basicFormButton).toHaveText('Submit')
  await basicFormButton.click();
})