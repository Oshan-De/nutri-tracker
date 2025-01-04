import { getAuth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { Mistral } from '@mistralai/mistralai'

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { ingredients } = await req.json()

    const apiKey = process.env.MISTRAL_API_KEY
    const client = new Mistral({ apiKey: apiKey })

    const completion = await client.chat.complete({
      model: 'pixtral-12b-2409',
      messages: [
        {
          role: 'system',
          content: `You are a helpful nutritionist assistant that provides healthy meal suggestions. 
          Format your response as JSON with the following structure and there should be only JSON in the response:
          {
            "suggestion": "name and brief description",
            "calories": number,
            "ingredients": "comma separated list",
            "instructions": "brief cooking instructions"
          }`,
        },
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

    return NextResponse.json(parsedResult)
  } catch (error) {
    console.error('Error in AI suggestions:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
