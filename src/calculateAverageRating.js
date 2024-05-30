
class CalculateAvareRating {
  calculateAverageRatingForUser(userId, userType, newRating, db) {
    const averageRatingDoc = db
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

  async get(request, response, db) {
    const { userId } = request.params;
    try {
      const mainDocs = [];
      const ratingRef = await db.collection(FirestoreCollections.averageRating);
      if (userId) {
        const finalResult = ratingRef.where('ratedUserId', '==', userId);
        const docs = await finalResult.get();
        const promises = docs.map(async (doc) => {
          const data = doc.data();
          if (data.average !== undefined) {
            const average = parseFloat(data.average);
            if (!isNaN(average)) {
              const formattedAverage = average.toFixed(1);
              mainDocs.push({ ...data, _id: doc.id, average: formattedAverage });
            }
          }
        });
        await Promise.all(promises);
      }

      response.json(mainDocs);
    } catch (error) {
      response.status(500).json({ errors: error });
    }
  }
}

module.exports = CalculateAvareRating;
