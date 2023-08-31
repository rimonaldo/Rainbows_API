const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
   query,
   getById,
   getByUsername,
   remove,
   update,
   add,
}

async function add({ primary, secondary, tertiary, neutral, info, success, warning, danger }) {
   try {
      // peek only updatable fields!
      const paletteToAdd = { primary, secondary, tertiary, neutral, info, success, warning, danger }
      const collection = await dbService.getCollection('palette')
      await collection.insertOne(paletteToAdd)
      console.log('paletteToAdd._id:', paletteToAdd._id);
      return paletteToAdd
   } catch (err) {
      logger.error('cannot insert user', err)
      throw err
   }
}

async function query(filterBy = {}) {
   const criteria = _buildCriteria(filterBy)
   try {
      const collection = await dbService.getCollection('palette')
      var users = await collection.find(criteria).toArray()
      users = users.map(user => {
         delete user.password
         user.createdAt = ObjectId(user._id).getTimestamp()
         // Returning fake fresh data
         // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
         return user
      })
      return users
   } catch (err) {
      logger.error('cannot find users', err)
      throw err
   }
}

async function getById(paletteId) {
   try {
      console.log('paletteId:', paletteId)
      const collection = await dbService.getCollection('palette')
      const palette = await collection.findOne({ _id: ObjectId(paletteId) })
      // delete user.password

      // user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) })
      // user.givenReviews = user.givenReviews.map(review => {
      // delete review.byUser
      // return review
      // })

      return palette
   } catch (err) {
      logger.error(`while finding user by id: ${paletteId}`, err)
      throw err
   }
}

async function getByUsername(username) {
   try {
      console.log('getting', username)
      const collection = await dbService.getCollection('palette')
      const user = await collection.findOne({ username })
      return user
   } catch (err) {
      logger.error(`while finding user by username: ${username}`, err)
      throw err
   }
}

async function remove(userId) {
   try {
      const collection = await dbService.getCollection('palette')
      await collection.deleteOne({ _id: ObjectId(userId) })
   } catch (err) {
      logger.error(`cannot remove user ${userId}`, err)
      throw err
   }
}

async function update(palette) {
   try {
      // peek only updatable properties
      const paletteToSave = {
         _id: ObjectId(palette._id), // needed for the returnd obj
         primary: palette.primary,
         secondary: palette.secondary,
         tertiary: palette.tertiary,
         neutral: palette.neutral,
         info: palette.info,
         success: palette.success,
         warning: palette.warning,
         danger: palette.danger,
      }
      const collection = await dbService.getCollection('palette')
      await collection.updateOne({ _id: paletteToSave._id }, { $set: paletteToSave })
      return paletteToSave
   } catch (err) {
      logger.error(`cannot update user ${palette._id}`, err)
      throw err
   }
}

function _buildCriteria(filterBy) {
   const criteria = {}
   if (filterBy.txt) {
      const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
      criteria.$or = [
         {
            username: txtCriteria,
         },
         {
            fullname: txtCriteria,
         },
      ]
   }
   if (filterBy.minBalance) {
      criteria.score = { $gte: filterBy.minBalance }
   }
   return criteria
}
