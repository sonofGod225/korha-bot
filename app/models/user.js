
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var userPlugin = require('mongoose-user');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  user_id:{type:String,default:''},
  first_name:{type:String,default:''},
  last_name:{type:String,default:''},
  profile_pic:{type:String,default:''},
  gender:{type:String,default:''},
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' }
});

/**
 * User plugin
 */

UserSchema.plugin(userPlugin, {});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UserSchema.method({

});

/**
 * Statics
 */

UserSchema.static({

});

/**
 * Register
 */

export default mongoose.model('User', UserSchema);
