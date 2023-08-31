const authService = require("./openAi.service")
const logger = require("../../services/logger.service")

async function getCompletion(req, res) {
   try {
      const { prompt, max_tokens, temperature, top_p, n, stream, logprobs, echo, stop, presence_penalty, frequency_penalty, best_of, logit_bias, engine, user, context, model, stopSequences } = req.body
      const completion = await authService.getCompletion({ prompt, max_tokens, temperature, top_p, n, stream, logprobs, echo, stop, presence_penalty, frequency_penalty, best_of, logit_bias, engine, user, context, model, stopSequences })
      res.send(completion)
   } catch (err) {
      logger.error('Failed to get completion', err)
      res.status(500).send({ err: 'Failed to get completion' })
   }
}


module.exports = {
   getCompletion,

}
