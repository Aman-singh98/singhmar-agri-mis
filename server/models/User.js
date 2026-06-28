// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
// 	name: { type: String, required: true },
// 	email: { type: String, required: true, unique: true, lowercase: true },
// 	password: { type: String, required: true },
// 	role: { type: String, enum: ['superadmin', 'admin', 'employee'], default: '' }
// }, { timestamps: true })

// export default mongoose.model('User', userSchema);









import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	// Common fields
	name: { type: String, required: true, trim: true },
	fatherName: { type: String, required: true, trim: true },
	gender: { type: String, enum: ['male', 'female', 'other'], required: true },
	mobile: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true },
	address: { type: String, required: true, trim: true },

	// Role
	role: {
		type: String,
		enum: ['superadmin', 'admin', 'employee'],
		required: true
	},

	adminId: {
		type: String,
		trim: true,
		required: function () {
			return this.role === 'admin';
		}
	},
	employeeId: {
		type: String,
		trim: true,
		required: function () {
			return this.role === 'employee';
		}
	}
}, { timestamps: true });

export default mongoose.model('User', userSchema);