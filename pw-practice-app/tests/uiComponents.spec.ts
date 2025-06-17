import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200')

})

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()

    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" })
            .getByRole('textbox', { name: "Email" })

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 })

        // generic assertion

        const inputValue = await usingTheGridEmailInput.inputValue() //extract  the text from input field and will save it into the constant
        expect(inputValue).toEqual('test2@test.com')

        // locator  assertion

        // locator assertion -11-

        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })

        await usingTheGridForm.getByLabel('Option 1')
            .check({ force: true })

        await usingTheGridForm.getByRole('radio', { name: "Option 1" })
            .check({ force: true })
    })
})