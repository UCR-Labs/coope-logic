const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FirestoreCollections, Statistics, AggregatedStatistic } = require('../models');

exports.increaseUserToReviewStatistics = functions.firestore
  .document(`${FirestoreCollections.usersToReview}/{userId}`)
  .onCreate(async () => {
    const db = admin.firestore();
    console.log('***************');

    const statisticsObj = await db
      .collection(FirestoreCollections.aggregatedStatistics)
      .doc(Statistics.usersToReview)
      .get();

    let updatedStatistics;
    if (statisticsObj.exists && statisticsObj.data()) {
      updatedStatistics = statisticsObj.data();
      updatedStatistics.value += 1;
      updatedStatistics.modified = new Date().getTime();
      await db
        .collection(FirestoreCollections.aggregatedStatistics)
        .doc(Statistics.usersToReview)
        .update(updatedStatistics);
    } else {
      updatedStatistics = {
        label: FirestoreCollections.usersToReview,
        modified: new Date().getTime(),
        value: 1,
      };
      await db
        .collection(FirestoreCollections.aggregatedStatistics)
        .doc(Statistics.usersToReview)
        .set(updatedStatistics);
    }

    return null;
  });
