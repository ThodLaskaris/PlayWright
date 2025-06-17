import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success')
    // await successButton.click();

    // const text = await successButton.textContent() // grab the text from the web element
    await successButton.waitFor({ state: "attached" })

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')

    // default time for the locator assertion is 5 seconds.
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })

})

test('alternative waits', async ({ page }) => {
    const successButton = page.locator('.bg-success')
    // example 1 wait for element

    // await page.waitForSelector('.bg-success')

    // example 2 wait for particular response.
    // When the api is called we can go for the next step
    // await page.waitForResponse('http://uitestingplayground.com/ajax')

    //example 3 wait for network calls to be completed( ' Not recommended ' )

    await page.waitForLoadState('networkidle');

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({ page}) => {
    const successButton = page.locator('.bg-success')
    await successButton.click()
    // we can change the timeout time from playwright.config.ts  defineconfig timeout: x globalTimeout: x
    // actionTimeout: x ( use block) navigationTimeout: x
})