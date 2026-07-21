import db from "../db/index.js"
import {userFavourites} from "../models/userModel.js"
import {eq,and} from 'drizzle-orm' 

export default {
  addFavorite : async function(userId,venueId){
       const result = await db.insert(userFavourites).values({userId,venueId}).returning();
       return result;
  },

  deleteFavorite: async function(venueId,userId){
      await db.delete(userFavourites).where(
        and(
            eq(userFavourites.userId,userId),
            eq(userFavourites.venueId,venueId)
        )
      )
  },

  getFavorites: async function(userId){
    const result = await db.query.userFavourites.findMany({
        where: eq(userFavourites.userId, userId),
        with: {
            venue: true
        }
    })
    return result;
  }
}