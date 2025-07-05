const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  bankInfo: {
    type: String,
    trim: true
  },
  cccd: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,  // Cho phép null/undefined và chỉ áp dụng unique khi có giá trị
    validate: {
      validator: function(v) {
        // Kiểm tra CCCD gồm 12 chữ số
        return !v || /^\d{12}$/.test(v);
      },
      message: props => `${props.value} không phải là số CCCD hợp lệ!`
    }
  },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;