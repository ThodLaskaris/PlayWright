import { test, expect } from "@playwright/test"
const websiteLocation = 'https://www.globalsqa.com/demo-site/draganddrop/'
test('drag and drop with iframe', async ({ page }) => {


    await page.goto(websiteLocation)

    // await page.locator('li', { hasText: 'High Tatras 2' })
    //   `  .click()
    // not gonna work cause its iFrame
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', { hasText: "High Tatras 2" })
        .dragTo(frame.locator('#trash'))

    //more prescise control
    await frame.locator('li', { hasText: "High Tatras 4" }).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})