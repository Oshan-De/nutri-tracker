import { getAuth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { Mistral } from '@mistralai/mistralai'

const MODEL_NAME = 'pixtral-12b-2409'
const SYSTEM_PROMPT = `
You are a helpful nutritionist assistant that provides healthy meal suggestions.
Format your response as JSON with the following structure, and there should be only JSON in the response:
{
  "suggestion": "name and brief description",
  "calories": number,
  "ingredients": "comma separated list",
  "instructions": "brief cooking instructions"
}`

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const { ingredients } = body

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients must be a non-empty array.' },
        { status: 400 },
      )
    }

    const apiKey = process.env.MISTRAL_API_KEY

    if (!apiKey) {
      throw new Error('Mistral API key is missing in environment variables.')
    }

    const client = new Mistral({ apiKey })

    const completion = await client.chat.complete({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Suggest a healthy meal using some or all of these ingredients: ${ingredients.join(
            ', ',
          )}`,
        },
      ],
    })

    const result = completion?.choices?.[0]?.message?.content || '{}'

    const sanitizedResult =
      typeof result === 'string'
        ? result.replace(/```(?:json)?/g, '').trim()
        : ''

    const parsedResult = JSON.parse(sanitizedResult)

    if (
      !parsedResult ||
      typeof parsedResult.suggestion !== 'string' ||
      typeof parsedResult.calories !== 'number' ||
      typeof parsedResult.ingredients !== 'string' ||
      typeof parsedResult.instructions !== 'string'
    ) {
      throw new Error('Invalid response format from AI.')
    }

    return NextResponse.json(parsedResult)
  } catch (error) {
    console.error('Error in AI suggestions handler:', error)
    return NextResponse.json(
      { error: 'Failed to process AI suggestions. Please try again later.' },
      { status: 500 },
    )
  }
}
