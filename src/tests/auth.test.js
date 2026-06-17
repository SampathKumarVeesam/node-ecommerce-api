const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock bcryptjs to avoid actual CPU cycles and Mongoose dependencies in simple unit test
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  genSalt: jest.fn().mockResolvedValue('mallsalt'),
  hash: jest.fn().mockResolvedValue('mockhashedpassword')
}));

// Mock jsonwebtoken to verify its usage
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_jwt_token')
}));

describe('User Model Methods (Unit Tests)', () => {
  let user;

  beforeEach(() => {
    // Instantiate a new unsaved user model instance for testing
    user = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'mypassword123'
    });
  });

  it('should match password using bcrypt.compare helper', async () => {
    bcrypt.compare.mockResolvedValueOnce(true);
    
    const isMatch = await user.matchPassword('mypassword123');
    
    expect(isMatch).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('mypassword123', user.password);
  });

  it('should sign a JWT token using model getSignedJwtToken method', () => {
    process.env.JWT_SECRET = 'mytestsecretkey';
    process.env.JWT_EXPIRE = '30d';

    const token = user.getSignedJwtToken();

    expect(token).toBe('mocked_jwt_token');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user._id, role: user.role },
      'mytestsecretkey',
      { expiresIn: '30d' }
    );
  });
});
