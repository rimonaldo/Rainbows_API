
const OpenAI = require('openai')
const openai = new OpenAI(process.env.OPENAI_API_KEY)

async function getCompletion(req, res) {
   console.log('getCompletion')
   const prompt = req.body.prompt

   try {
      const completion = await openai.chat.completions.create({
         messages: [
            {
               role: 'user',
               content: `Provide a UX/UI color palette for the theme: '${prompt}'. Return as: "primary: HEX, secondary: HEX, tertiary: HEX".`,
            },
         ],
         model: 'gpt-3.5-turbo',
      })

      const responseContent = completion.choices[0].message.content
      console.log(responseContent)
      res.send({ content: responseContent })
   } catch (error) {
      console.error('Error calling OpenAI API:', error)
      res.status(500).send({ error: 'Failed to fetch completion from OpenAI.' })
   }
}

async function chat(req, res) {
   const prompt = req.body.prompt

   const completion = await openai.chat.completions.create({
      engine: 'davinci',
      prompt: prompt,
      maxTokens: 100,
      temperature: 0.9,
      topP: 1,
      presencePenalty: 0.6,
      frequencyPenalty: 0.6,
      bestOf: 1,
      n: 1,
      stream: false,
      stop: ['\n', ' Human:', ' AI:'],
   })

   console.log(completion)
}

module.exports = {
   getCompletion,
}
