import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const VALID_ROLES = ['superadmin', 'admin', 'employee'];

export const loginUser = async (req, res) => {
	const { email, password, role } = req.body;
	if (!email || !password || !role) {
		return res.status(400).json({ message: 'Email, password and role are all required.' });
	}

	if (!VALID_ROLES.includes(role)) {
		return res.status(400).json({ message: 'Invalid role selected.' });
	}

	const user = await User.findOne({ email: email.toLowerCase() });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({ message: 'Invalid credentials.' });
	}

	if (user.role !== role) {
		return res.status(401).json({ message: 'Selected role does not match this account.' });
	}

	const token = jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRE }
	);

	res.json({
		token,
		user: { id: user._id, name: user.name, email: user.email, role: user.role }
	});
};

export const getCurrentUser = async (req, res) => {
	const user = await User.findById(req.user.id).select('-password');
	res.json({ user });
};