const assert = require('assert');
const sinon = require('sinon');
const { calculateAverageRatingForUser } = require('../src/calculateAverageRating');

// Mock Firestore and its collection method
const db = {
  collection: sinon.stub(),
};

// Mock FirestoreCollections constant
const FirestoreCollections = {
  averageRating: 'averageRating',
};


const UserType = {
  USER: 'biker',
};

const Rating = {
  ratingValue: 4,
};

// Mock Firestore document
const mockDoc = {
  exists: false,
  data: sinon.stub(),
};

// Mock Firestore collection and document
db.collection.returns({
  doc: sinon.stub().returns({
    get: sinon.stub().resolves(mockDoc),
  }),
});

describe('calculateAverageRatingForUser', function() {
  it('should calculate average rating when document does not exist', async function() {

    mockDoc.exists = false;

    const result = await calculateAverageRatingForUser('user1', UserType.USER, Rating);

    assert.strictEqual(result.ratedUserId, 'user1');
    assert.strictEqual(result.ratedUserType, UserType.USER);
    assert.strictEqual(result.sumOfRatings, Rating.ratingValue);
    assert.strictEqual(result.numberOfRatings, 1);
    assert.strictEqual(result.average, Rating.ratingValue);
  });

  it('should calculate average rating when document exists', async function() {

    mockDoc.exists = true;
    mockDoc.data.returns({
      ratedUserId: 'user1',
      ratedUserType: UserType.USER,
      sumOfRatings: 8,
      numberOfRatings: 2,
      average: 4,
    });

    db.collection.returns({
      doc: sinon.stub().returns({
        get: sinon.stub().resolves(mockDoc),
      }),
    });

    const result = await calculateAverageRatingForUser('user1', UserType.USER, Rating);

    assert.strictEqual(result.sumOfRatings, 12);
    assert.strictEqual(result.numberOfRatings, 3);
    assert.strictEqual(result.average, 12 / 3);
  });
});
