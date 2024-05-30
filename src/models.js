/* istanbul ignore file */

// * Fechas se pueden manejar con number
// * otra opción => https://firebase.google.com/docs/reference/js/firestore_.timestamp

// ? Types que son técnicamente string, pero solo pueden tener estos 3 valores
const UserRole = {
    Admin: 'Admin',
    User: 'User',
    Biker: 'Biker'
  };
  
  const UserStatus = {
    Pending: 'Pending',
    Approved: 'Approved',
    Rejected: 'Rejected'
  };
  
  // https://www.typescriptlang.org/docs/handbook/enums.html
  // ? Enum con las colecciones de Firestore que usaremos
  // ? Puede crecer conforme agreguemos más colecciones
  const FirestoreCollections = {
    users: 'users',
    usersToReview: 'usersToReview',
    userNotes: 'userNotes',
    orders: 'orders',
    aggregatedStatistics: 'aggregatedStatistics'
  };
  
  // ? Representa un Usuario (puede ser Biker, Admin o Cliente)
  class User {
    constructor(firebaseUserId, firstName, lastName, email, role, status, created, modified) {
      this.firebaseUserId = firebaseUserId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.role = role;
      this.status = status;
      this.created = created;
      this.modified = modified;
    }
  }
  
  // ? Usuario que debe ser aprobado por el administrador
  class UserToReview {
    constructor(userId, firebaseUserId, created) {
      this.userId = userId;
      this.firebaseUserId = firebaseUserId;
      this.created = created;
    }
  }
  
  // ? Nota creada por el admin al aprobar o rechazar un usuario
  class UserNote {
    constructor(userId, firebaseUserId, content, created) {
      this.userId = userId;
      this.firebaseUserId = firebaseUserId;
      this.content = content;
      this.created = created;
    }
  }
  
  // ? Una orden básica
  class Order {
    constructor(title, content, created, modified) {
      this.title = title;
      this.content = content;
      this.created = created;
      this.modified = modified;
    }
  }
  
  // ? IDs de las estadísticas
  const Statistics = {
    adminUsers: 'ADMIN_USERS',
    bikerUsers: 'BIKER_USERS',
    regularUsers: 'REGULAR_USERS',
    usersToReview: 'USERS_TO_REVIEW'
  };
  
  // ? Representa una estadística agregada de los datos que tenemos en Firestore
  class AggregatedStatistic {
    constructor(label, value, modified) {
      this.label = label;
      this.value = value;
      this.modified = modified;
    }
  }
  
  module.exports = {
    UserRole,
    UserStatus,
    FirestoreCollections,
    User,
    UserToReview,
    UserNote,
    Order,
    Statistics,
    AggregatedStatistic
  };
  