import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors());
const db = admin.firestore();
import {AverageRating, Rating, UserType, FirestoreCollections} from 'rideTypes';

exports.calculateAverageRating = functions.firestore
  .document(`${FirestoreCollections.ratings}/{ratingId}`)
  .onCreate(async (snapshot) => {
    const newRating = snapshot.data();
    const userId = newRating.ratedUserId;

    const averageRating = await calculateAverageRatingForUser(
      userId,
      newRating.ratedUserType,
      newRating
    );

    await db
      .collection(FirestoreCollections.averageRating)
      .doc(userId)
      .set(averageRating);
  });


async function calculateAverageRatingForUser(userId, userType, newRating) {
    const averageRatingDoc = await db
      .collection(FirestoreCollections.averageRating)
      .doc(userId)
      .get();
    let averageRating;
  
    if (averageRatingDoc.exists) {
      averageRating = averageRatingDoc.data();
      averageRating.numberOfRatings += 1;
      averageRating.sumOfRatings += newRating.ratingValue;
      averageRating.average =
        averageRating.sumOfRatings / averageRating.numberOfRatings;
    } else {
      averageRating = {
        ratedUserId: userId,
        ratedUserType: userType,
        sumOfRatings: newRating.ratingValue,
        numberOfRatings: 1,
        average: newRating.ratingValue,
      };
    }
  
    return averageRating;
  }
  
  module.exports = { calculateAverageRatingForUser };
  