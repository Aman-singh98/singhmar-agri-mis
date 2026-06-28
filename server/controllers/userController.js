import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// POST /api/users  -> create a new user (admin or employee only; superadmin comes from seed)
export const createUser = async (req, res) => {
	try {
		const {
			name,
			fatherName,
			gender,
			mobile,
			email,
			password,
			address,
			role,
			adminId,
			employeeId
		} = req.body;

		if (!name || !fatherName || !gender || !mobile || !email || !password || !address || !role) {
			return res.status(400).json({ message: 'All common fields are required.' });
		}

		if (!['admin', 'employee'].includes(role)) {
			// superadmin is only created via the seed file, never through this API
			return res.status(400).json({ message: 'Role must be either admin or employee.' });
		}

		if (role === 'admin' && !adminId) {
			return res.status(400).json({ message: 'Admin ID is required when role is admin.' });
		}
		if (role === 'employee' && !employeeId) {
			return res.status(400).json({ message: 'Employee ID is required when role is employee.' });
		}

		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return res.status(409).json({ message: 'This email is already registered.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			fatherName,
			gender,
			mobile,
			email,
			password: hashedPassword,
			address,
			role,
			...(role === 'admin' ? { adminId } : { employeeId })
		});

		const savedUser = await newUser.save();
		const { password: _pw, ...userResponse } = savedUser.toObject();

		return res.status(201).json({
			message: 'User created successfully.',
			user: userResponse
		});
	} catch (error) {
		console.error('Create user error:', error);

		if (error.code === 11000) {
			return res.status(409).json({ message: 'This email is already registered.' });
		}
		if (error.name === 'ValidationError') {
			return res.status(400).json({ message: error.message });
		}

		return res.status(500).json({ message: 'Server error, please try again later.' });
	}
};

// GET /api/users  -> list all admin/employee users (excludes superadmin and password)
export const getUsers = async (req, res) => {
	try {
		const users = await User.find({ role: { $in: ['admin', 'employee'] } })
			.select('-password')
			.sort({ createdAt: -1 });

		return res.status(200).json({ users });
	} catch (error) {
		console.error('Fetch users error:', error);
		return res.status(500).json({ message: 'Server error, please try again later.' });
	}
};

// PUT /api/users/:id  -> update an existing user (role and password are not editable here)
export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, fatherName, gender, mobile, email, address, adminId, employeeId } = req.body;

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		if (email && email.toLowerCase() !== user.email) {
			const emailTaken = await User.findOne({ email: email.toLowerCase() });
			if (emailTaken) {
				return res.status(409).json({ message: 'This email is already registered.' });
			}
			user.email = email.toLowerCase();
		}

		if (name) user.name = name;
		if (fatherName) user.fatherName = fatherName;
		if (gender) user.gender = gender;
		if (mobile) user.mobile = mobile;
		if (address) user.address = address;

		if (user.role === 'admin' && adminId) user.adminId = adminId;
		if (user.role === 'employee' && employeeId) user.employeeId = employeeId;

		const updatedUser = await user.save();
		const { password: _pw, ...userResponse } = updatedUser.toObject();

		return res.status(200).json({
			message: 'User updated successfully.',
			user: userResponse
		});
	} catch (error) {
		console.error('Update user error:', error);

		if (error.code === 11000) {
			return res.status(409).json({ message: 'This email is already registered.' });
		}
		if (error.name === 'ValidationError') {
			return res.status(400).json({ message: error.message });
		}

		return res.status(500).json({ message: 'Server error, please try again later.' });
	}
};

// DELETE /api/users/:id  -> delete a user (superadmin is protected, can't be deleted here)
export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}
		if (user.role === 'superadmin') {
			return res.status(403).json({ message: 'Superadmin cannot be deleted.' });
		}

		await User.findByIdAndDelete(id);
		return res.status(200).json({ message: 'User deleted successfully.' });
	} catch (error) {
		console.error('Delete user error:', error);
		return res.status(500).json({ message: 'Server error, please try again later.' });
	}
};

// PUT /api/users/:id/reset-password  -> superadmin resets a user's password
// (e.g. when an employee/admin leaves, or forgets their password)
export const resetPassword = async (req, res) => {
	try {
		const { id } = req.params;
		const { newPassword } = req.body;

		if (!newPassword || newPassword.length < 6) {
			return res.status(400).json({ message: 'New password must be at least 6 characters.' });
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}
		if (user.role === 'superadmin') {
			return res.status(403).json({ message: "Superadmin's password cannot be reset here." });
		}

		user.password = await bcrypt.hash(newPassword, 10);
		await user.save();

		return res.status(200).json({ message: 'Password reset successfully.' });
	} catch (error) {
		console.error('Reset password error:', error);
		return res.status(500).json({ message: 'Server error, please try again later.' });
	}
};