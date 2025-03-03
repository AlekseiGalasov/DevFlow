'use server'

export async function testFunction(formData: FormData) {
    const testData = Object.fromEntries(formData)
    console.log(testData)
}