



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
  