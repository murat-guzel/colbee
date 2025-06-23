const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

class User {
    constructor(data = {}) {
        this._id = data._id || null;
        this.email = data.email || '';
        this.userName = data.userName || '';
        this.password = data.password || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.profilePhoto = data.profilePhoto || null;
        this.profilePhotoUrl = data.profilePhotoUrl || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.role = data.role || 'user';
    }

    // Password hash'leme
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Password doğrulama
    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // User'ı MongoDB'ye kaydetmek için hazırlama
    toMongoDoc() {
        const doc = {
            email: this.email,
            userName: this.userName,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            profilePhoto: this.profilePhoto,
            profilePhotoUrl: this.profilePhotoUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isActive: this.isActive,
            role: this.role
        };

        if (this._id) {
            doc._id = this._id;
        }

        return doc;
    }

    // MongoDB'den gelen veriyi User objesine çevirme
    static fromMongoDoc(doc) {
        if (!doc) return null;
        
        return new User({
            _id: doc._id,
            email: doc.email,
            userName: doc.userName,
            password: doc.password,
            firstName: doc.firstName,
            lastName: doc.lastName,
            profilePhoto: doc.profilePhoto,
            profilePhotoUrl: doc.profilePhotoUrl,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            isActive: doc.isActive,
            role: doc.role
        });
    }

    // Public user data (password hariç)
    toPublicJSON() {
        return {
            id: this._id ? this._id.toString() : null,
            email: this.email,
            userName: this.userName,
            firstName: this.firstName,
            lastName: this.lastName,
            profilePhotoUrl: this.profilePhotoUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isActive: this.isActive,
            role: this.role
        };
    }
}

module.exports = User; 